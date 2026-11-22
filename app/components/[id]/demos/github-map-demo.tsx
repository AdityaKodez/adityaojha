"use client";

import { useMemo } from "react";

import {
  GitHubCalendar,
  type ContributionDay,
  type GitHubCalendarProps,
} from "@/components/ui/github-map";

const DAY_MS = 86_400_000;

const SAMPLE_REPOSITORIES: Record<number, { name: string; stars: number }[]> = {
  16: [{ name: "trazo-stickers", stars: 142 }],
  64: [{ name: "akoder-ui", stars: 89 }],
  138: [{ name: "prompt-kit", stars: 64 }],
  214: [{ name: "gridly", stars: 37 }],
  296: [{ name: "verse-text", stars: 51 }],
};

export function generateMockContributions(): ContributionDay[] {
  const result: ContributionDay[] = [];
  const now = new Date();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  for (let i = 364; i >= 0; i--) {
    const date = new Date(todayUtc - i * DAY_MS).toISOString().slice(0, 10);
    const dayOfWeek = new Date(todayUtc - i * DAY_MS).getUTCDay();
    const normalized = Math.abs(
      (Math.sin(i * 12.9898 + (i % 7)) * 43758.5453) % 1,
    );
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const count = isWeekend
      ? normalized > 0.68
        ? Math.floor(normalized * 5)
        : 0
      : normalized > 0.28
        ? Math.floor(normalized * 14) + 1
        : 0;
    const newRepositories = SAMPLE_REPOSITORIES[i];

    result.push({
      date,
      count: newRepositories ? Math.max(count, 4) : count,
      ...(newRepositories ? { newRepositories } : {}),
    });
  }

  return result;
}

export function GitHubMapDemo({
  colors,
  showCounts = true,
  showLegend = true,
  minWeeks = 57,
}: Partial<GitHubCalendarProps> = {}) {
  const data = useMemo(() => generateMockContributions(), []);

  return (
    <div className="min-w-0 w-full">
      <GitHubCalendar
        data={data}
        colors={colors}
        showCounts={showCounts}
        showLegend={showLegend}
        minWeeks={minWeeks}
      />
    </div>
  );
}
