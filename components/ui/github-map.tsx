"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subMonths,
} from "date-fns";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface ContributionDay {
  date: string;
  count: number;
}

interface GitHubCalendarProps {
  data: ContributionDay[];
  colors?: string[];
}

/** Parse a bare YYYY-MM-DD date as a local calendar date. */
export function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Index contributions by ISO date for constant-time calendar cell lookup. */
export function indexByDate<T extends { date: string }>(
  data: T[],
): Map<string, T> {
  return new Map(data.map((entry) => [entry.date, entry]));
}

const GitHubCalendar = ({
  data,
  // Theme vars with literal fallbacks so the component renders outside this
  // repo too (consumers won't have --heatmap-level-* defined).
  colors = [
    "var(--heatmap-level-0, oklch(0.92 0 0))",
    "var(--heatmap-level-1, oklch(0.882 0.057 254.128))",
    "var(--heatmap-level-2, oklch(0.707 0.165 254.624))",
    "var(--heatmap-level-3, oklch(0.488 0.243 264.376))",
    "var(--heatmap-level-4, oklch(0.379 0.146 265.522))",
  ],
}: GitHubCalendarProps) => {
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    return { startDate: subMonths(end, 12), endDate: end };
  }, []);

  const weeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );
  const contributionsByDate = useMemo(() => indexByDate(data), [data]);

  // Get color based on contribution count
  const getColor = (count: number) => {
    if (count === 0) return colors[0];
    if (count === 1) return colors[1];
    if (count === 2) return colors[2];
    if (count === 3) return colors[3];
    return colors[4] || colors[colors.length - 1];
  };

  // Render weeks
  const renderWeeks = () => {
    const weeksArray = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    for (let i = 0; i < weeks; i++) {
      const weekDays = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
      });

      weeksArray.push(
        <div key={i} className="flex flex-col gap-1">
          {weekDays.map((day, index) => {
            const contribution = contributionsByDate.get(
              format(day, "yyyy-MM-dd"),
            );
            const count = contribution?.count ?? 0;

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className="w-3 h-3 rounded-xs"
                    style={{ backgroundColor: getColor(count) }}
                    title={`${format(day, "PPP")}: ${count} contributions`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {format(day, "PPP")}: {count} contributions
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>,
      );
      currentWeekStart = addDays(currentWeekStart, 7);
    }

    return weeksArray;
  };

  // Render month labels with proper alignment and solving the 30-day drift
  const renderMonthLabels = () => {
    const monthLabels: { name: string; weekIndex: number }[] = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    for (let i = 0; i < weeks; i++) {
      const monthName = format(currentWeekStart, "MMM");
      if (
        monthLabels.length === 0 ||
        (monthLabels[monthLabels.length - 1].name !== monthName &&
          i - monthLabels[monthLabels.length - 1].weekIndex >= 3)
      ) {
        monthLabels.push({ name: monthName, weekIndex: i });
      }
      currentWeekStart = addDays(currentWeekStart, 7);
    }

    return monthLabels.map((month, index) => (
      <span
        key={index}
        className="text-xs text-muted-foreground absolute whitespace-nowrap"
        style={{
          left: `calc(${month.weekIndex} * (0.75rem + 0.125rem))`,
        }}
      >
        {month.name}
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="no-js-visible p-2 overflow-x-auto overflow-y-hidden no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max">
        <div className="relative">
          <div className="relative h-4 w-full mb-2">{renderMonthLabels()}</div>
          <div className="flex gap-0.5">{renderWeeks()}</div>
        </div>
      </div>
      <div className="mt-2 justify-center flex gap-1 text-[10px] text-gray-400 items-center">
        <span>less</span>

        {colors.map((color, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-[1px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>more</span>
      </div>
    </motion.div>
  );
};

export { GitHubCalendar };
