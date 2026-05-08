import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      return NextResponse.json({ error: "MONGO_URL not set", overrides: [] });
    }
    const db = await getDb();
    const overrides = await db.collection("product_overrides").find({}).toArray();
    return NextResponse.json({ 
      overrides: overrides.map((o: any) => ({ ...o, _id: o._id.toString() })),
      count: overrides.length
    });
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || "Failed to fetch",
      overrides: [] 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_name, tag, flavours, in_stock, price } = body;
    const db = await getDb();
    await db.collection("product_overrides").updateOne(
      { product_name },
      { $set: { product_name, tag: tag || "", flavours: flavours || [], in_stock: in_stock !== false, price: price || null, updated_at: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save" }, { status: 500 });
  }
}
