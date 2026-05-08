import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RAILWAY_URL = "https://web-production-92e501.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${RAILWAY_URL}/orders/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, site: "VDB .com" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ ok: false });
  }
}
