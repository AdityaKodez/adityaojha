import { NextResponse } from "next/server";

// Lifetime visitor/pageview totals from Vercel Web Analytics. The count
// endpoint only covers production data, which is what the counter wants.
export const revalidate = 300;

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    // Without credentials the counter stays hidden in the UI instead of
    // erroring, so local dev and forks keep working.
    return NextResponse.json(
      { visitors: null, pageviews: null },
      { headers: NO_CACHE_HEADERS },
    );
  }

  try {
    const params = new URLSearchParams({ projectId: VERCEL_PROJECT_ID });
    if (VERCEL_TEAM_ID) {
      params.set("teamId", VERCEL_TEAM_ID);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.vercel.com/v1/query/web-analytics/visits/count?${params}`,
      {
        next: { revalidate: 300 },
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      },
    ).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      return NextResponse.json(
        { visitors: null, pageviews: null },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }

    const data = (await response.json()) as {
      data?: { visitors?: number; pageviews?: number };
    };

    const visitors =
      typeof data.data?.visitors === "number" ? data.data.visitors : null;
    const pageviews =
      typeof data.data?.pageviews === "number" ? data.data.pageviews : null;

    return NextResponse.json(
      { visitors, pageviews },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { visitors: null, pageviews: null },
      { status: 502, headers: NO_CACHE_HEADERS },
    );
  }
}
