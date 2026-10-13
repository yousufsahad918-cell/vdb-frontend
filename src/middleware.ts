import { NextRequest, NextResponse } from "next/server";

const TARGET = "vapebangalore.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (host === TARGET || host === `www.${TARGET}`) {
    return NextResponse.next(); // avoid loops
  }

  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${TARGET}`);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
