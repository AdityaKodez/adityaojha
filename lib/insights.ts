import "server-only";

import { insightsConfig } from "@/config/insights";
import type {
  InsightPoint,
  InsightReport,
  InsightSummary,
} from "@/config/types";

const DAY_MS = 86_400_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function readSummary(value: unknown): InsightSummary | null {
  if (!isRecord(value)) return null;
  const { visitors, sessions, pageviews, averageEngagedSeconds } = value;
  if (
    !isCount(visitors) ||
    !isCount(sessions) ||
    !isCount(pageviews) ||
    (averageEngagedSeconds !== null && !isCount(averageEngagedSeconds))
  )
    return null;

  return {
    visitors,
    sessions,
    pageviews,
    averageEngagedSeconds,
  };
}

export async function getInsights(): Promise<InsightReport | null> {
  const key = process.env.TALVESS_STATS_KEY;
  if (!key) return null;

  const today = new Date().toISOString().slice(0, 10);
  const end = Date.parse(`${today}T00:00:00Z`);
  const dates = Array.from({ length: insightsConfig.days }, (_, index) =>
    new Date(end - (insightsConfig.days - 1 - index) * DAY_MS)
      .toISOString()
      .slice(0, 10),
  );

  try {
    const origin = process.env.TALVESS_ORIGIN ?? "https://talvess.app";
    const url = new URL("/api/v1/stats/traffic", origin);
    url.search = new URLSearchParams({
      startDate: dates[0],
      endDate: today,
      interval: "daily",
      section: "summary",
    }).toString();

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "force-cache",
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Insights request failed:", response.status);
      return null;
    }

    const payload: unknown = await response.json();
    const data = isRecord(payload) ? payload.data : null;
    const series = isRecord(data) ? data.series : null;
    const summary = isRecord(data) ? readSummary(data.summary) : null;
    const previous =
      isRecord(data) && isRecord(data.previous)
        ? readSummary(data.previous.summary)
        : null;
    if (!summary || !previous) {
      console.error(
        "Insights report contains invalid current or previous totals",
      );
      return null;
    }
    if (!Array.isArray(series) || series.length !== dates.length) {
      console.error(
        `Insights report must contain ${insightsConfig.days} daily points`,
      );
      return null;
    }

    const points: InsightPoint[] = [];
    for (const [index, point] of series.entries()) {
      if (
        !isRecord(point) ||
        point.date !== dates[index] ||
        !isCount(point.visitors) ||
        !isCount(point.pageviews)
      ) {
        console.error("Insights report contains an invalid daily point");
        return null;
      }
      points.push({
        date: point.date,
        visitors: point.visitors,
        pageviews: point.pageviews,
      });
    }
    return { points, summary, previous };
  } catch (error) {
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? ((error.cause as NodeJS.ErrnoException).code ?? error.cause.name)
        : null;
    console.error(
      "Insights request failed:",
      error instanceof Error ? error.name : "Unknown error",
      cause
        ? `(${cause}) at ${process.env.TALVESS_ORIGIN ?? "https://talvess.app"}`
        : "",
    );
    return null;
  }
}
