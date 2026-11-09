import type { Contribution } from "./github";

const DAY_MS = 86_400_000;

/** Build complete Sunday-first weeks from the returned dates, not the client clock. */
export function buildActivityCalendar(data: Contribution[]) {
  if (data.length === 0) return null;

  const byDate = new Map<string, number>();
  for (const { date, count } of data) {
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().slice(0, 10) !== date ||
      !Number.isSafeInteger(count) ||
      count < 0 ||
      byDate.has(date)
    ) {
      throw new Error(`Invalid GitHub contribution for ${date}`);
    }
    byDate.set(date, count);
  }

  const dates = [...byDate.keys()].sort();
  const start = dates[0];
  const end = dates[dates.length - 1];
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  const firstIndex = new Date(first).getUTCDay();
  const lastIndex = firstIndex + Math.round((last - first) / DAY_MS);
  const weekCount = Math.ceil((lastIndex + 1) / 7);
  const gridStart = first - firstIndex * DAY_MS;
  const days = Array.from({ length: weekCount * 7 }, (_, index) => {
    const date = new Date(gridStart + index * DAY_MS)
      .toISOString()
      .slice(0, 10);
    return {
      date,
      // Missing records stay unknown. Padding outside the returned range is blank.
      count: byDate.get(date) ?? null,
      inRange: index >= firstIndex && index <= lastIndex,
    };
  });
  const months: { date: string; column: number }[] = [];
  for (let index = firstIndex; index <= lastIndex; index++) {
    const date = days[index].date;
    if (index === firstIndex || date.endsWith("-01")) {
      const column = Math.floor(index / 7);
      // A short opening month must not collide with the next month's label.
      if (months.length && column - months[months.length - 1].column < 3) {
        months.pop();
      }
      months.push({ date, column });
    }
  }

  return { start, end, firstIndex, lastIndex, weekCount, days, months };
}

export type ActivityCalendar = NonNullable<
  ReturnType<typeof buildActivityCalendar>
>;

export function activityColor(count: number) {
  return `var(--heatmap-level-${Math.min(count, 4)})`;
}
