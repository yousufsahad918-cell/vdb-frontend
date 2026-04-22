import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const overrides = await db.collection("product_overrides").find({}).toArray();
    return NextResponse.json({
      overrides: overrides.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_name, tag, flavours, in_stock } = body;
    const db = await getDb();
    await db.collection("product_overrides").updateOne(
      { product_name },
      { $set: { product_name, tag: tag || "", flavours: flavours || [], in_stock: in_stock !== false, updated_at: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
