import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, confirmed, outForDelivery, delivered, todayOrders] = await Promise.all([
      db.collection("orders").countDocuments({}),
      db.collection("orders").countDocuments({ status: "pending" }),
      db.collection("orders").countDocuments({ status: "confirmed" }),
      db.collection("orders").countDocuments({ status: "out_for_delivery" }),
      db.collection("orders").countDocuments({ status: "delivered" }),
      db.collection("orders").countDocuments({ created_at: { $gte: today } }),
    ]);

    const revenueResult = await db.collection("orders").aggregate([
      { $match: { created_at: { $gte: today }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]).toArray();

    return NextResponse.json({
      total_orders: total,
      pending,
      confirmed,
      out_for_delivery: outForDelivery,
      delivered,
      today_orders: todayOrders,
      today_revenue: revenueResult[0]?.total || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
