"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  subMonths,
} from "date-fns";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface ContributionDay {
  date: string; // ISO date string (e.g., "2025-09-13")
  count: number;
}

interface GitHubCalendarProps {
  data: ContributionDay[]; // Contribution data
  colors?: string[]; // Custom color scale (default: GitHub-like greens)
}

const GitHubCalendar = ({
  data,
  colors = ["#fffde7", "#fff59d", "#ffeb3b", "#fbc02d", "#f57f17"],
}: GitHubCalendarProps) => {
  const today = new Date();
  const startDate = subMonths(today, 12); // One year back
  const endDate = today;

  const weeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );

  // Process data prop
  const contributions = useMemo(() => {
    return data.filter((d) =>
      isWithinInterval(new Date(d.date), {
        start: startDate,
        end: endDate,
      }),
    );
  }, [data, startDate, endDate]);

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
            const contribution = contributions.find((c) =>
              isSameDay(new Date(c.date), day),
            );
            const color = contribution
              ? getColor(contribution.count)
              : colors[0];

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`w-3 h-3 rounded-xs`}
                    style={{ backgroundColor: color }}
                    title={`${format(day, "PPP")}: ${contribution?.count || 0} contributions`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {format(day, "PPP")}: {contribution?.count || 0}{" "}
                    contributions
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
        monthLabels[monthLabels.length - 1].name !== monthName
      ) {
        monthLabels.push({ name: monthName, weekIndex: i });
      }
      currentWeekStart = addDays(currentWeekStart, 7);
    }

    return monthLabels.map((m, i) => (
      <span
        key={i}
        className="text-xs text-muted-foreground absolute whitespace-nowrap"
        style={{
          left: `${(m.weekIndex / weeks) * 100}%`,
        }}
      >
        {m.name}
      </span>
    ));
  };

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="p-4 border-y border-dashed overflow-x-auto overflow-y-hidden"
    >
      <div className="flex">
        <div>
          <div className="relative h-4 w-full mb-2">{renderMonthLabels()}</div>
          <div className="flex gap-0.5">{renderWeeks()}</div>
        </div>
      </div>
      <div className="mt-2 justify-center flex gap-1 text-[10px] text-gray-400 items-center">
        <span>Less</span>

        {colors.map((color, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-[1px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
};

export { GitHubCalendar };
