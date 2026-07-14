import { type LanyardData } from "@/lib/discord-status";
import { NextResponse } from "next/server";

const DISCORD_USER_ID = process.env.DISCORD_USER_ID ?? "1243105196477911061";
export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Discord status from Lanyard." },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      success: boolean;
      data?: LanyardData;
    };

    if (!data.success || !data.data) {
      return NextResponse.json(
        { error: "Invalid Discord status response." },
        { status: 502 },
      );
    }

    // Serve from the shared/CDN cache and allow serving stale content while
    // revalidating in the background. This collapses concurrent requests onto
    // a single upstream fetch instead of hammering Lanyard on every miss.
    return NextResponse.json(data.data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Lanyard API." },
      { status: 502 },
    );
  }
}
