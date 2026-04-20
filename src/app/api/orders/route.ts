import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, main_location, sub_location, items, total } = body;

    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();
    const orderId = `VIB${now.getDate().toString().padStart(2,"0")}${(now.getMonth()+1).toString().padStart(2,"0")}${now.getFullYear().toString().slice(-2)}${uuidv4().slice(0,4).toUpperCase()}`;

    const order = {
      order_id: orderId,
      customer_name,
      customer_phone,
      main_location,
      sub_location,
      items,
      total,
      status: "pending",
      created_at: now,
      updated_at: now,
    };

    await db.collection("orders").insertOne(order);
    return NextResponse.json({ success: true, order_id: orderId });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = status ? { status } : {};

    const db = await getDb();
    const orders = await db.collection("orders")
      .find(query)
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    const serialized = orders.map(o => ({
      ...o,
      _id: o._id.toString(),
      created_at: o.created_at?.toISOString(),
      updated_at: o.updated_at?.toISOString(),
    }));

    return NextResponse.json({ orders: serialized });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
