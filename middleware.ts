import { NextRequest, NextResponse } from "next/server";

const SUSPICIOUS_AGENTS = [
  "python-requests", "curl/", "wget/", "scrapy", "mechanize",
  "phantomjs", "selenium", "headless", "bot", "crawler", "spider",
  "ahrefsbot", "semrushbot", "mj12bot", "dotbot", "blexbot",
  "masscan", "nmap", "sqlmap", "nikto", "zgrab",
];

const RATE_LIMIT: Record<string, { count: number; time: number }> = {};
const WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // max 60 requests per minute per IP

const WA_NUMBER = "916282878843";
const WA_ALERT_URL = `https://api.whatsapp.com/send?phone=${WA_NUMBER}`;

async function sendAlert(ip: string, reason: string, ua: string) {
  const msg = encodeURIComponent(
    `SECURITY ALERT - VapeNetwork\n\nIP: ${ip}\nReason: ${reason}\nAgent: ${ua.slice(0, 100)}\nTime: ${new Date().toISOString()}`
  );
  // Log to console (visible in Vercel logs)
  console.warn(`[SECURITY] ${reason} | IP: ${ip} | UA: ${ua.slice(0, 100)}`);
}

export async function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const path = req.nextUrl.pathname;

  // Skip static assets
  if (path.startsWith("/_next") || path.startsWith("/favicon") || path.includes(".")) {
    return NextResponse.next();
  }

  // Check suspicious user agents
  const isSuspicious = SUSPICIOUS_AGENTS.some(agent => ua.includes(agent));
  if (isSuspicious) {
    await sendAlert(ip, "Suspicious user agent", ua);
    return new NextResponse("Access denied", { status: 403 });
  }

  // Rate limiting
  const now = Date.now();
  if (!RATE_LIMIT[ip] || now - RATE_LIMIT[ip].time > WINDOW) {
    RATE_LIMIT[ip] = { count: 1, time: now };
  } else {
    RATE_LIMIT[ip].count++;
    if (RATE_LIMIT[ip].count > MAX_REQUESTS) {
      await sendAlert(ip, `Rate limit exceeded (${RATE_LIMIT[ip].count} req/min)`, ua);
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  // Block suspicious paths
  const suspiciousPaths = ["/admin", "/wp-admin", "/wp-login", "/.env", "/config", "/api/auth/hack", "/phpmyadmin"];
  if (suspiciousPaths.some(p => path.startsWith(p))) {
    await sendAlert(ip, `Suspicious path access: ${path}`, ua);
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
