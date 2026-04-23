import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const db = await getDb();

    // ── CUSTOMERS ─────────────────────────────────────────────────────────────
    if (section === "customers") {
      const customers = await db.collection("orders").aggregate([
        {
          $group: {
            _id: "$customer_phone",
            customer_name: { $last: "$customer_name" },
            order_count: { $sum: 1 },
            total_spent: { $sum: "$total" },
            last_order: { $max: "$created_at" },
            locations: { $addToSet: "$main_location" },
          },
        },
        { $sort: { order_count: -1 } },
      ]).toArray();

      return NextResponse.json({
        customers: customers.map((c) => ({
          phone: c._id,
          name: c.customer_name,
          order_count: c.order_count,
          total_spent: c.total_spent,
          last_order: c.last_order?.toISOString(),
          locations: c.locations,
        })),
      });
    }

    // ── CUSTOMER ORDER HISTORY ─────────────────────────────────────────────────
    if (section === "customer_orders") {
      const phone = searchParams.get("phone");
      if (!phone) return NextResponse.json({ orders: [] });
      const orders = await db.collection("orders")
        .find({ customer_phone: phone })
        .sort({ created_at: -1 })
        .toArray();
      return NextResponse.json({
        orders: orders.map((o: any) => ({
          ...o,
          _id: o._id.toString(),
          created_at: o.created_at?.toISOString(),
        })),
      });
    }

    // ── INVENTORY ─────────────────────────────────────────────────────────────
    if (section === "inventory") {
      const inventory = await db.collection("inventory").find({}).toArray();
      return NextResponse.json({
        items: inventory.map((i: any) => ({
          _id: i._id.toString(),
          name: i.product_name || i.product_id,
          product_name: i.product_name || i.product_id,
          category: i.category || "Vape",
          price: i.price || 0,
          stock_count: i.stock_count ?? 0,
          reorder_level: i.reorder_level ?? 5,
        })),
      });
    }

    // ── PURCHASES ─────────────────────────────────────────────────────────────
    if (section === "purchases") {
      const purchases = await db.collection("purchases")
        .find({})
        .sort({ date: -1 })
        .limit(100)
        .toArray();
      return NextResponse.json({
        purchases: purchases.map((p: any) => ({
          ...p,
          _id: p._id.toString(),
          date: p.date?.toISOString(),
        })),
      });
    }

    // ── SALES ─────────────────────────────────────────────────────────────────
    if (section === "sales") {
      const range = searchParams.get("range") || "7";
      const days = parseInt(range);
      const since = new Date();
      since.setDate(since.getDate() - days);
      since.setHours(0, 0, 0, 0);

      const [dailySales, topProducts, totalStats] = await Promise.all([
        db.collection("orders").aggregate([
          { $match: { created_at: { $gte: since }, status: { $ne: "cancelled" } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
              },
              revenue: { $sum: "$total" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]).toArray(),

        db.collection("orders").aggregate([
          { $match: { created_at: { $gte: since }, status: { $ne: "cancelled" } } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.name",
              qty: { $sum: "$items.quantity" },
              revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            },
          },
          { $sort: { qty: -1 } },
          { $limit: 10 },
        ]).toArray(),

        db.collection("orders").aggregate([
          { $match: { created_at: { $gte: since }, status: { $ne: "cancelled" } } },
          {
            $group: {
              _id: null,
              total_revenue: { $sum: "$total" },
              total_orders: { $sum: 1 },
              avg_order: { $avg: "$total" },
            },
          },
        ]).toArray(),
      ]);

      return NextResponse.json({
        daily: dailySales.map((d: any) => ({
          date: d._id,
          revenue: d.revenue,
          orders: d.orders,
        })),
        top_products: topProducts.map((p: any) => ({
          name: p._id,
          qty: p.qty,
          revenue: p.revenue,
        })),
        stats: totalStats[0]
          ? {
              total_revenue: totalStats[0].total_revenue,
              total_orders: totalStats[0].total_orders,
              avg_order: Math.round(totalStats[0].avg_order),
            }
          : { total_revenue: 0, total_orders: 0, avg_order: 0 },
      });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    console.error("Accounts API error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// ── POST — add purchase entry / update inventory ───────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const body = await req.json();
    const db = await getDb();

    if (section === "purchases") {
      const { supplier, product_name, quantity, cost_per_unit, notes } = body;
      if (!product_name || !quantity || !cost_per_unit) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      await db.collection("purchases").insertOne({
        supplier: supplier || "Unknown",
        product_name,
        quantity: Number(quantity),
        cost_per_unit: Number(cost_per_unit),
        total_cost: Number(quantity) * Number(cost_per_unit),
        notes: notes || "",
        date: new Date(),
      });
      return NextResponse.json({ success: true });
    }

    if (section === "inventory") {
      const { product_id, product_name, stock_count, reorder_level } = body;
      const key = product_name || product_id;
      await db.collection("inventory").updateOne(
        { $or: [{ product_name: key }, { product_id: key }] },
        {
          $set: {
            product_name: key,
            product_id: key,
            stock_count: Number(stock_count),
            reorder_level: Number(reorder_level ?? 5),
            updated_at: new Date(),
          },
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
