/* Lifetime visitor count from the Talvess Stats API. The key is website-scoped
   and server-only. Talvess caches matching reports for 900 seconds, so the
   Data Cache entry below uses the same window. */

const TALVESS_STATS_KEY = process.env.TALVESS_STATS_KEY;
const TALVESS_ORIGIN = process.env.TALVESS_ORIGIN ?? "https://talvess.app";

export async function getVisitorCount(): Promise<number | null> {
  // Without a key the counter stays hidden in the UI instead of erroring, so
  // local dev and forks keep working.
  if (!TALVESS_STATS_KEY) return null;

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

    if (!response.ok) return null;

    const data = (await response.json()) as {
      data?: { count?: number };
    };

    const visitors = data.data?.count;
    return typeof visitors === "number" && visitors > 0 ? visitors : null;
  } catch {
    return null;
  }
}
