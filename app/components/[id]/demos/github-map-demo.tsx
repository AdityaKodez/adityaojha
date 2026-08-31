"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";

import { GitHubCalendar } from "@/components/ui/github-map";

const GITHUB_GREENS = [
  "var(--heatmap-level-0)",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

export function generateMockContributions(): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const day = subDays(today, i);
    const dayOfWeek = day.getDay();
    const normalized = Math.abs(
      Math.sin(i * 12.9898 + (i % 7)) * 43758.5453 % 1,
    );
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const count = isWeekend
      ? normalized > 0.7
        ? Math.floor(normalized * 4)
        : 0
      : normalized > 0.3
        ? Math.floor(normalized * 12) + 1
        : 0;

    result.push({ date: format(day, "yyyy-MM-dd"), count });
  }

  return result;
}

export function GitHubMapDemo() {
  const data = useMemo(() => generateMockContributions(), []);

  return (
    <div className="w-full">
      <GitHubCalendar data={data} colors={GITHUB_GREENS} />
    </div>
  );
}

export function GitHubCalendarExample({ colors }: { colors?: string[] }) {
  const data = useMemo(() => generateMockContributions(), []);

  return (
    <div className="w-full flex items-center justify-center h-full">
      <GitHubCalendar data={data} colors={colors} />
    </div>
  );
}
