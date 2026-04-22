import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await req.json();
    const { status, cancelled_at } = body;
    const db = await getDb();

    const update: any = {
      status,
      updated_at: new Date(),
    };

    if (status === "cancelled" && cancelled_at) {
      update.cancelled_at = new Date(cancelled_at);
    }

    await db.collection("orders").updateOne(
      { order_id: params.orderId },
      { $set: update }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
