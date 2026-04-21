import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection("products")
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    const serialized = products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      created_at: p.created_at?.toISOString(),
    }));
    return NextResponse.json({ products: serialized });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, discount, image_url, flavours, in_stock } = body;
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });
    }
    const db = await getDb();
    const product = {
      name,
      category: category || "Vape",
      price: Number(price),
      discount: Number(discount) || 0,
      image_url: image_url || "",
      flavours: flavours || [],
      in_stock: in_stock !== false,
      created_at: new Date(),
    };
    await db.collection("products").insertOne(product);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
