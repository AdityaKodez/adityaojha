import type { InsightSummary } from "@/config/types";

export const insightsConfig = {
  title: "Insights",
  days: 7,
  chartLabel: "Daily visitors and views over the last 7 days, in UTC",
  instructions:
    "Hover or touch to explore. Use the left and right arrow keys to move between days. Press Escape to clear the selection.",
  unavailable: "Traffic data is unavailable right now.",
  loading: "Loading visitor and view insights",
  visitor: "visitor",
  visitors: "visitors",
  view: "view",
  views: "views",
  visitorsLabel: "Visitors",
  viewsLabel: "Views",
  periodLabel: "Last 7 days",
  peakLabel: "Best day",
  comparisonLabel: "Compared with the previous 7 days",
  noData: "No data",
  newActivity: "New",
  metrics: [
    { key: "visitors", label: "Visitors" },
    { key: "sessions", label: "Sessions" },
    { key: "pageviews", label: "Views" },
    { key: "averageEngagedSeconds", label: "Avg. time" },
  ] satisfies { key: keyof InsightSummary; label: string }[],
} as const;
