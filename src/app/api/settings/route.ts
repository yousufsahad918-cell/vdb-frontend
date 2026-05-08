import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RAILWAY_URL = "https://web-production-92e501.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${RAILWAY_URL}/settings`, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fallback to default number if Railway is down
    return NextResponse.json({ whatsapp: "916282878843" });
  }
}
