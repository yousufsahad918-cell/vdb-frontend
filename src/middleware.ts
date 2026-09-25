import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE = false;

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/_next") || path.startsWith("/favicon") || path.includes(".") || path === "/maintenance") {
    return NextResponse.next();
  }
  if (MAINTENANCE) {
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
