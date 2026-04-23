import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const requests = await db.collection("notify_requests")
      .find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({
      requests: requests.map((r: any) => ({ ...r, _id: r._id.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { product_name, phone } = await req.json();
    if (!product_name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const db = await getDb();
    await db.collection("notify_requests").insertOne({
      product_name,
      phone,
      created_at: new Date(),
      notified: false,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
