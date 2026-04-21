import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { status } = await req.json();
    const db = await getDb();

    await db.collection("orders").updateOne(
      { order_id: params.orderId },
      { $set: { status, updated_at: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
