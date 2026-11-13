/**
 * Reconciled on November 13, 2026, using the old Vercel project's Stats API
 * (prj_MOsL3nIgwdNft7obCtUprNefKGgd) and Talvess's native pageview history
 * (website 60de5aa9-eea8-4f05-b1d6-8a3d244d5644).
 *
 * Vercel reported 10,159 visitors, with its last traffic on October 27.
 * Exclude that partial day's 15 visitors and use Talvess from October 27
 * 00:00 UTC: 10,144 + 3,421 = 13,565. The periods do not overlap.
 * These are anonymous analytics visitors, not deduplicated individual people.
 *
 * Freeze both totals together. Future growth is the increase in Talvess's
 * lifetime count, so old Talvess traffic is not added a second time and the
 * API's 365-day custom-range limit never truncates the counter.
 */
export const visitorCountConfig = {
  baseline: 13_565,
  talvessBaseline: 5_680,
  recordedAt: "2026-11-13T10:04:05.894Z",
} as const;
