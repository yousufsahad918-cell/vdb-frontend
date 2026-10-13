import { NextRequest, NextResponse } from "next/server";

const TARGET = "vapebangalore.com";

// VDB slugs with -bangalore suffix → VB slugs without
const SLUG_MAP: Record<string, string> = {
  "church-street-bangalore": "church-street",
  "ulsoor-bangalore": "ulsoor",
  "tumkur-road-bangalore": "tumkur-road",
  "varthur-bangalore": "varthur",
  "frazer-town-bangalore": "frazer-town",
  "mahadevapura-bangalore": "mahadevapura",
  "nagarbhavi-bangalore": "nagarbhavi",
  "outer-ring-road-bangalore": "outer-ring-road",
  "panathur-bangalore": "panathur",
  "vijayanagar-bangalore": "vijayanagar",
  "yeshwanthpur-bangalore": "yeshwanthpur",
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/^www\./, "");
  if (host === TARGET) return NextResponse.next();

  let pathname = req.nextUrl.pathname;

  // Rewrite -bangalore suffixed area slugs
  const areaMatch = pathname.match(/^\/vape-delivery\/(.+)$/);
  if (areaMatch) {
    const slug = areaMatch[1];
    if (SLUG_MAP[slug]) {
      pathname = `/vape-delivery/${SLUG_MAP[slug]}`;
    }
  }

  const url = new URL(pathname + req.nextUrl.search, `https://${TARGET}`);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
