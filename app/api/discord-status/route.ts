import { type LanyardData } from "@/lib/discord-status";
import { NextResponse } from "next/server";

const DISCORD_USER_ID = "1243105196477911061";

export const revalidate = 60;

export async function GET() {
  if (!DISCORD_USER_ID) {
    return NextResponse.json(
      { error: "Missing DISCORD_USER_ID environment variable." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/1243105196477911061`,
      {
        next: { revalidate: 60 },
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

    return NextResponse.json(data.data);
  } catch {
    return NextResponse.json(
      { error: "Could not reach Lanyard API." },
      { status: 502 },
    );
  }
}
