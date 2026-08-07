import { NextRequest, NextResponse } from "next/server";

const JSONBIN_KEY = process.env.JSONBIN_KEY || "";
const REVIEWS_BIN_ID = process.env.REVIEWS_BIN_ID || "";
const BASE = "https://api.jsonbin.io/v3";

async function getReviews() {
  if (!REVIEWS_BIN_ID) return [];
  try {
    const res = await fetch(`${BASE}/b/${REVIEWS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": JSONBIN_KEY },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.record?.reviews || [];
  } catch { return []; }
}

async function saveReviews(reviews: any[]) {
  if (!REVIEWS_BIN_ID) return;
  await fetch(`${BASE}/b/${REVIEWS_BIN_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY },
    body: JSON.stringify({ reviews }),
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const all = searchParams.get("all");
  const reviews = await getReviews();
  if (all === "true") return NextResponse.json({ reviews });
  const filtered = slug ? reviews.filter((r: any) => r.productSlug === slug && r.approved) : reviews.filter((r: any) => r.approved);
  return NextResponse.json({ reviews: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, productName, author, area, rating, text } = body;
    if (!productSlug || !author || !rating || !text) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (text.length < 10 || text.length > 500) return NextResponse.json({ error: "Review must be 10-500 characters" }, { status: 400 });
    const reviews = await getReviews();
    const newReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productSlug, productName,
      author: author.trim().slice(0, 50),
      area: area?.trim().slice(0, 50) || "Bangalore",
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      text: text.trim().slice(0, 500),
      date: new Date().toISOString().split("T")[0],
      approved: false,
    };
    reviews.push(newReview);
    await saveReviews(reviews);
    return NextResponse.json({ success: true, message: "Review submitted. It will appear after approval." });
  } catch { return NextResponse.json({ error: "Failed to submit review" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, approved } = await req.json();
  const reviews = await getReviews();
  const idx = reviews.findIndex((r: any) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  reviews[idx].approved = approved;
  await saveReviews(reviews);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const reviews = await getReviews();
  await saveReviews(reviews.filter((r: any) => r.id !== id));
  return NextResponse.json({ success: true });
}
