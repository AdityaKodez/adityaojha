const NPM_DOWNLOADS_ENDPOINT = "https://api.npmjs.org/downloads/point/last-week";

export async function getNpmWeeklyDownloads(
  packageName: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `${NPM_DOWNLOADS_ENDPOINT}/${encodeURIComponent(packageName)}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!res.ok) {
      return null;
    }

    const data: unknown = await res.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "downloads" in data &&
      typeof data.downloads === "number" &&
      Number.isFinite(data.downloads) &&
      data.downloads >= 0
    ) {
      return data.downloads;
    }

    return null;
  } catch {
    return null;
  }
}
