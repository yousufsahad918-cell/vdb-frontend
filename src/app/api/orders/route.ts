import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection("product_order").findOne({ _id: "order" as any });
    return NextResponse.json({ order: doc?.order || [] });
  } catch {
    return NextResponse.json({ order: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { order } = await req.json();
    if (!Array.isArray(order)) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const db = await getDb();
    await db.collection("product_order").updateOne(
      { _id: "order" as any },
      { $set: { order, updated_at: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
