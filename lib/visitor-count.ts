import { visitorCountConfig } from "@/config/visitor-count";

/* Reconciled history plus new Talvess visitors. The key is website-scoped
   and server-only. Talvess caches matching reports for 900 seconds, so the
   Data Cache entry below uses the same window. */

const TALVESS_STATS_KEY = process.env.TALVESS_STATS_KEY;
const TALVESS_ORIGIN = process.env.TALVESS_ORIGIN ?? "https://talvess.app";

export async function getVisitorCount(): Promise<number> {
  const { baseline, talvessBaseline } = visitorCountConfig;
  if (!TALVESS_STATS_KEY) return baseline;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const origin = TALVESS_ORIGIN.replace(/\/+$/, "");

    const response = await fetch(
      `${origin}/api/v1/stats/visitors?period=lifetime`,
      {
        next: { revalidate: 900 },
        headers: {
          Authorization: `Bearer ${TALVESS_STATS_KEY}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      },
    ).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      console.error("Visitor count request failed:", response.status);
      return baseline;
    }

    const data = (await response.json()) as {
      data?: { count?: number };
    };

    const visitors = data.data?.count;
    if (
      typeof visitors !== "number" ||
      !Number.isSafeInteger(visitors) ||
      visitors < talvessBaseline ||
      !Number.isSafeInteger(baseline + visitors - talvessBaseline)
    ) {
      console.error("Visitor count is invalid or predates the saved snapshot");
      return baseline;
    }

    return baseline + (visitors - talvessBaseline);
  } catch (error) {
    console.error(
      "Visitor count request failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return baseline;
  }
}
