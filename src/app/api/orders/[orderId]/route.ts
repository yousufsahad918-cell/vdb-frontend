import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function autoTag(stock: number): string {
  if (stock <= 0) return "Stock Out";
  if (stock <= 5) return "Low Stock";
  if (stock <= 10) return "Fast Selling";
  if (stock >= 50) return "People's Choice";
  return "";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await req.json();
    const { status, cancelled_at } = body;
    const db = await getDb();

    const update: any = { status, updated_at: new Date() };
    if (status === "cancelled" && cancelled_at) {
      update.cancelled_at = new Date(cancelled_at);
    }

    const order = await db.collection("orders").findOne({ order_id: params.orderId });
    await db.collection("orders").updateOne({ order_id: params.orderId }, { $set: update });

    // Auto-deduct inventory + auto-tag when confirmed
    if (status === "confirmed" && order) {
      for (const item of order.items || []) {
        const qty = item.quantity || 1;
        const inv = await db.collection("inventory").findOneAndUpdate(
          { product_name: item.name },
          { $inc: { stock_count: -qty }, $set: { updated_at: new Date() } },
          { returnDocument: "after" }
        );
        if (inv && inv.stock_count !== undefined) {
          await db.collection("product_overrides").updateOne(
            { product_name: item.name },
            { $set: { tag: autoTag(inv.stock_count), in_stock: inv.stock_count > 0, updated_at: new Date() } },
            { upsert: true }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
