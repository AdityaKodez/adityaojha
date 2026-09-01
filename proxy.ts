import { NextResponse, type NextRequest } from "next/server";

// Lightweight, best-effort token-bucket rate limiting for API routes.
// This runs per function instance (module-level state is not shared across
// instances), so it is a first line of defense against abuse — complement it
// with a platform WAF / Vercel Firewall for stronger protection.
const RATE_LIMIT = 30; // requests
const RATE_WINDOW_MS = 60_000; // per minute

const buckets = new Map<string, { tokens: number; updatedAt: number }>();
const MAX_BUCKETS = 5000;
const BUCKET_TTL_MS = 300_000; // 5 minutes

function cleanupOldBuckets(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [ip, b] of buckets.entries()) {
    if (now - b.updatedAt > BUCKET_TTL_MS) {
      buckets.delete(ip);
    }
  }
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  cleanupOldBuckets(now);
  const refillPerMs = RATE_LIMIT / RATE_WINDOW_MS;

  const bucket = buckets.get(ip);
  if (!bucket) {
    buckets.set(ip, { tokens: RATE_LIMIT - 1, updatedAt: now });
    return true;
  }

  bucket.tokens = Math.min(
    RATE_LIMIT,
    bucket.tokens + (now - bucket.updatedAt) * refillPerMs,
  );
  bucket.updatedAt = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!allowRequest(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};