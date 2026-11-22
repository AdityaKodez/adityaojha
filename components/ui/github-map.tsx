"use client";

import { Star } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { Sticker } from "trazo-stickers";
import {
  asteriskDef,
  flowerRedDef,
  flowerYellowDef,
  lightningBoltDef,
  pinkDinoDef,
  redCrabDef,
  sixStarDef,
  solidStarDef,
  spiralDef,
  starOutlineDef,
  starfishDef,
  sunBurstDef,
  type StickerDef,
} from "trazo-stickers/svg";
import { cn } from "@/lib/utils";

const DAY_MS = 86_400_000;
const CELL_SIZE = 13;

export interface NewRepository {
  name: string;
  stars: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  newRepositories?: NewRepository[];
}

export interface ActivityCalendarDay {
  date: string;
  count: number | null;
  newRepositories?: NewRepository[];
  inRange: boolean;
  upcoming: boolean;
}

export interface ActivityCalendar {
  start: string;
  end: string;
  firstIndex: number;
  lastIndex: number;
  weekCount: number;
  days: ActivityCalendarDay[];
  months: { date: string; column: number }[];
}

export interface GitHubCalendarLabels {
  calendarLabel?: string;
  keyboardHint?: string;
  less?: string;
  more?: string;
  legend?: string;
  unavailable?: string;
  contribution?: string;
  contributions?: string;
  newRepository?: string;
  star?: string;
  stars?: string;
  weekdays?: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
}

export interface GitHubCalendarProps {
  /** Daily contribution entries keyed by YYYY-MM-DD UTC dates. */
  data: readonly ContributionDay[];
  /** Five-color intensity ramp for levels 0 through 4+. Defaults to theme-aware CSS variables with literal fallbacks. */
  colors?: readonly string[];
  /** Pad forward with faint outlined upcoming days to at least this many week columns. */
  minWeeks?: number;
  /** Render the contribution count directly inside non-zero circular dots. */
  showCounts?: boolean;
  /** Render the intensity legend (and repository sticker key when present) below the grid. */
  showLegend?: boolean;
  /** Play a once-only left-to-right dot pop-in wave when the calendar scrolls into view. */
  animateOnScroll?: boolean;
  /** Custom `trazo-stickers` definitions cycled across days with `newRepositories`. Pass `[]` to disable stickers. */
  stickers?: readonly StickerDef[];
  /** Accessible and visible copy overrides. */
  labels?: GitHubCalendarLabels;
  className?: string;
}

export const defaultRepoStickers: readonly StickerDef[] = [
  sunBurstDef,
  solidStarDef,
  starfishDef,
  lightningBoltDef,
  flowerRedDef,
  sixStarDef,
  pinkDinoDef,
  flowerYellowDef,
  redCrabDef,
  spiralDef,
  asteriskDef,
  starOutlineDef,
];

// Theme vars with literal fallbacks so the component renders cleanly outside
// projects that define `--heatmap-level-*`.
const DEFAULT_COLORS: readonly string[] = [
  "var(--heatmap-level-0, oklch(0.92 0 0))",
  "var(--heatmap-level-1, oklch(0.882 0.057 254.128))",
  "var(--heatmap-level-2, oklch(0.707 0.165 254.624))",
  "var(--heatmap-level-3, oklch(0.488 0.243 264.376))",
  "var(--heatmap-level-4, oklch(0.379 0.146 265.522))",
];

const DEFAULT_LABELS: Required<GitHubCalendarLabels> = {
  calendarLabel: "Daily GitHub contributions",
  keyboardHint:
    "Use arrow keys to explore days. Left and right move by week. Home and End move to the first and last week in a row. Control Home and Control End move to the first and last day.",
  less: "Less",
  more: "More",
  legend: "0, 1, 2, 3, 4+ contributions",
  unavailable: "No data available",
  contribution: "contribution",
  contributions: "contributions",
  newRepository: "New repo",
  star: "star",
  stars: "stars",
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: "UTC",
});
const starFormat = new Intl.NumberFormat("en-US");

type Phase = "idle" | "armed" | "shown";

type DayLabel = {
  activity: string | null;
  ariaLabel: string;
  repositories: NewRepository[] | null;
};

type TooltipTarget = {
  index: number;
  x: number;
  top: number;
  bottom: number;
  placement: "top" | "bottom";
  pinned: boolean;
};

const colMotion =
  "group-data-[phase=armed]/cal:opacity-0 group-data-[phase=shown]/cal:animate-[github-col-in_280ms_cubic-bezier(0.34,1.45,0.64,1)_backwards] motion-reduce:animate-none motion-reduce:opacity-100";

const tooltipGlide =
  "transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const tooltipFade =
  "transition-opacity duration-150 ease-out motion-reduce:transition-none";

/**
 * Build complete Sunday-first UTC weeks from the supplied dates, independent of
 * the client clock. `minWeeks` pads forward with upcoming days to fill a frame.
 */
export function buildActivityCalendar(
  data: readonly ContributionDay[],
  minWeeks = 0,
): ActivityCalendar | null {
  if (data.length === 0) return null;

  const byDate = new Map<string, ContributionDay>();
  for (const contribution of data) {
    const { date, count } = contribution;
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
    byDate.set(date, contribution);
  }

  const dates = [...byDate.keys()].sort();
  const start = dates[0];
  const end = dates[dates.length - 1];
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  const firstIndex = new Date(first).getUTCDay();
  const lastIndex = firstIndex + Math.round((last - first) / DAY_MS);
  const safeMinWeeks = Number.isFinite(minWeeks)
    ? Math.max(0, Math.floor(minWeeks))
    : 0;
  const weekCount = Math.max(Math.ceil((lastIndex + 1) / 7), safeMinWeeks);
  const gridStart = first - firstIndex * DAY_MS;

  const days: ActivityCalendarDay[] = Array.from(
    { length: weekCount * 7 },
    (_, index) => {
      const date = new Date(gridStart + index * DAY_MS)
        .toISOString()
        .slice(0, 10);
      const contribution = byDate.get(date);
      return {
        date,
        // Missing records stay unknown; padding outside the returned range is blank.
        count: contribution?.count ?? null,
        newRepositories: contribution?.newRepositories,
        inRange: index >= firstIndex && index <= lastIndex,
        upcoming: index > lastIndex,
      };
    },
  );

  const months: { date: string; column: number }[] = [];
  for (let index = firstIndex; index < days.length; index++) {
    const date = days[index].date;
    if (index === firstIndex || date.endsWith("-01")) {
      const column = Math.floor(index / 7);
      // Avoid collisions when an opening partial month has fewer than 3 columns.
      if (months.length && column - months[months.length - 1].column < 3) {
        months.pop();
      }
      months.push({ date, column });
    }
  }

  return { start, end, firstIndex, lastIndex, weekCount, days, months };
}

function colDelay(column: number) {
  return `${column * 9}ms`;
}

function resolveColor(count: number, colors: readonly string[]) {
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
  const level = Math.min(Math.max(0, count), palette.length - 1);
  return palette[level] ?? DEFAULT_COLORS[Math.min(Math.max(0, count), 4)];
}

function hexLuminance(color: string): number | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : match[1];
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function countTextClass(count: number, background: string) {
  const luminance = hexLuminance(background);
  const tone =
    luminance !== null
      ? luminance > 0.35
        ? "text-neutral-950"
        : "text-white"
      : count <= 2
        ? "text-foreground"
        : "text-background";
  if (count >= 100) return cn(tone, "text-[5px] tracking-[-0.08em]");
  if (count >= 10) return cn(tone, "text-[6px] tracking-[-0.06em]");
  return cn(tone, "text-[7.5px]");
}

function buildDayLabel(
  day: ActivityCalendarDay,
  hasSticker: boolean,
  copy: Required<GitHubCalendarLabels>,
): DayLabel {
  const repositories =
    hasSticker && day.newRepositories?.length ? day.newRepositories : null;
  if (repositories) {
    const ariaLabel = repositories
      .map(
        (repo) =>
          `${repo.name}, ${starFormat.format(repo.stars)} ${repo.stars === 1 ? copy.star : copy.stars}`,
      )
      .join("; ");
    return { activity: null, ariaLabel, repositories };
  }
  const count =
    day.count === null
      ? copy.unavailable
      : `${day.count} ${day.count === 1 ? copy.contribution : copy.contributions}`;
  const date = dateFormat.format(new Date(`${day.date}T00:00:00Z`));
  const activity = `${date}: ${count}`;
  return { activity, ariaLabel: activity, repositories: null };
}

type CalendarGridProps = {
  calendar: ActivityCalendar;
  colors: readonly string[];
  showCounts: boolean;
  copy: Required<GitHubCalendarLabels>;
  selectedIndex: number;
  dayLabels: DayLabel[];
  stickerByIndex: Map<number, StickerDef>;
  hintId: string;
  gridRef: RefObject<HTMLDivElement | null>;
  onPointerOver: (event: PointerEvent<HTMLDivElement>) => void;
  onFocus: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const CalendarGrid = memo(function CalendarGrid({
  calendar,
  colors,
  showCounts,
  copy,
  selectedIndex,
  dayLabels,
  stickerByIndex,
  hintId,
  gridRef,
  onPointerOver,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
}: CalendarGridProps) {
  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={copy.calendarLabel}
      aria-describedby={hintId}
      className="group/cal flex py-1"
      onPointerOver={onPointerOver}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {Array.from({ length: calendar.weekCount }, (_, column) => (
        <div
          key={column}
          role="row"
          className={cn("flex snap-start flex-col", colMotion)}
          style={{ animationDelay: colDelay(column) }}
        >
          {copy.weekdays.map((_, row) => {
            const index = column * 7 + row;
            const day = calendar.days[index];
            const label = dayLabels[index];
            const stickerDef = stickerByIndex.get(index);
            const backgroundColor =
              day.count === null ? undefined : resolveColor(day.count, colors);

            return (
              <div
                key={day.date}
                role="gridcell"
                className="relative flex size-[13px] shrink-0 items-center justify-center"
              >
                {day.upcoming && (
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full ring-1 ring-inset ring-border"
                  />
                )}
                {day.inRange && (
                  <button
                    type="button"
                    tabIndex={index === selectedIndex ? 0 : -1}
                    aria-label={label.ariaLabel}
                    data-index={index}
                    data-date={day.date}
                    data-count={day.count ?? "missing"}
                    className="group relative flex size-full cursor-pointer items-center justify-center rounded-full outline-none hover:z-10 focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground"
                  >
                    {stickerDef ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none flex size-3 shrink-0 items-center justify-center"
                      >
                        <Sticker
                          def={stickerDef}
                          size={12}
                          className="block size-full motion-safe:transition-transform motion-safe:duration-150 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-125"
                          focusable="false"
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none inline-flex size-3 select-none items-center justify-center rounded-full font-mono font-semibold leading-none tabular-nums group-hover:ring-1 group-hover:ring-foreground/60",
                          day.count === null && "ring-1 ring-inset ring-border",
                          showCounts &&
                            day.count !== null &&
                            day.count > 0 &&
                            backgroundColor &&
                            countTextClass(day.count, backgroundColor),
                        )}
                        style={{
                          backgroundColor,
                        }}
                      >
                        {showCounts && day.count !== null && day.count > 0
                          ? day.count
                          : null}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

type GitHubCalendarViewProps = {
  calendar: ActivityCalendar;
  colors: readonly string[];
  showCounts: boolean;
  showLegend: boolean;
  animateOnScroll: boolean;
  stickers: readonly StickerDef[];
  copy: Required<GitHubCalendarLabels>;
  className?: string;
};

function GitHubCalendarView({
  calendar,
  colors,
  showCounts,
  showLegend,
  animateOnScroll,
  stickers,
  copy,
  className,
}: GitHubCalendarViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(calendar.lastIndex);
  const [tooltip, setTooltip] = useState<TooltipTarget | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipGliding, setTooltipGliding] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    left: number;
    arrowLeft: number;
  } | null>(null);
  const [scrollerWidth, setScrollerWidth] = useState<number | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const wrapper = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tooltipEl = useRef<HTMLDivElement>(null);
  const tooltipOpenRef = useRef(false);
  const pinnedRef = useRef(false);
  const hintId = useId();
  const tooltipId = useId();

  const stickerByIndex = useMemo(() => {
    const map = new Map<number, StickerDef>();
    if (stickers.length === 0) return map;
    let rank = 0;
    for (let index = 0; index < calendar.days.length; index++) {
      if (calendar.days[index]?.newRepositories?.length) {
        map.set(index, stickers[rank % stickers.length]);
        rank++;
      }
    }
    return map;
  }, [calendar.days, stickers]);

  const dayLabels = useMemo(
    () =>
      calendar.days.map((day, index) =>
        buildDayLabel(day, stickerByIndex.has(index), copy),
      ),
    [calendar.days, stickerByIndex, copy],
  );

  const monthSpans = useMemo(() => {
    const leadingColumns = calendar.months[0]?.column ?? 0;
    const items = calendar.months.map(({ date, column }, index) => {
      const nextColumn = calendar.months[index + 1]?.column ?? calendar.weekCount;
      return {
        date,
        column,
        span: Math.max(1, nextColumn - column),
        label: monthFormat.format(new Date(`${date}T00:00:00Z`)),
      };
    });
    return { leadingColumns, items };
  }, [calendar.months, calendar.weekCount]);

  useLayoutEffect(() => {
    const container = wrapper.current;
    if (!container) return;

    const totalGridWidth = calendar.weekCount * CELL_SIZE;
    const syncWidth = () => {
      const available = Math.floor(container.clientWidth);
      if (available <= 0 || available >= totalGridWidth) {
        setScrollerWidth(null);
        return;
      }
      const visibleWeeks = Math.max(1, Math.floor(available / CELL_SIZE));
      setScrollerWidth(visibleWeeks * CELL_SIZE);
    };

    syncWidth();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(syncWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, [calendar.weekCount]);

  useLayoutEffect(() => {
    if (scroller.current) {
      scroller.current.scrollLeft = scroller.current.scrollWidth;
    }
  }, [calendar.end, calendar.weekCount, scrollerWidth]);

  useEffect(() => {
    const node = grid.current;
    if (!node) return;
    if (
      !animateOnScroll ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      node.getBoundingClientRect().top < window.innerHeight
    ) {
      phaseRef.current = "idle";
      delete node.dataset.phase;
      return;
    }
    if (phaseRef.current === "shown") return;
    phaseRef.current = "armed";
    node.dataset.phase = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        phaseRef.current = "shown";
        node.dataset.phase = "shown";
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnScroll]);

  const hideTooltip = useCallback((force = false) => {
    if (!force && pinnedRef.current) return;
    pinnedRef.current = false;
    tooltipOpenRef.current = false;
    setTooltipOpen(false);
    setTooltipGliding(false);
    setTooltip((current) =>
      current?.pinned ? { ...current, pinned: false } : current,
    );
  }, []);

  useEffect(() => {
    if (!tooltipOpen || !tooltip?.pinned) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (
        event.target instanceof Node &&
        grid.current?.contains(event.target)
      ) {
        return;
      }
      hideTooltip(true);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [tooltipOpen, tooltip?.pinned, hideTooltip]);

  const showTooltipForButton = useCallback(
    (button: HTMLButtonElement, index: number, pinned: boolean) => {
      const container = wrapper.current;
      if (!container) return;
      const cell = button.getBoundingClientRect();
      const box = container.getBoundingClientRect();
      const x = cell.left - box.left + cell.width / 2;
      const top = cell.top - box.top;
      const bottom = cell.bottom - box.top;
      const placement: "top" | "bottom" = cell.top < 48 ? "bottom" : "top";
      const wasOpen = tooltipOpenRef.current;
      tooltipOpenRef.current = true;
      pinnedRef.current = pinned;
      setTooltipGliding(wasOpen);
      setTooltipOpen(true);
      setTooltip((current) => {
        if (
          current &&
          current.index === index &&
          current.pinned === pinned &&
          Math.abs(current.x - x) < 0.5 &&
          Math.abs(current.top - top) < 0.5 &&
          current.placement === placement
        ) {
          return current;
        }
        return { index, x, top, bottom, placement, pinned };
      });
    },
    [],
  );

  useLayoutEffect(() => {
    if (!tooltip || !wrapper.current || !tooltipEl.current) {
      setTooltipPos(null);
      return;
    }
    const containerWidth = wrapper.current.clientWidth;
    const tipWidth = tooltipEl.current.offsetWidth;
    const margin = 4;
    const maxLeft = Math.max(margin, containerWidth - tipWidth - margin);
    const left = Math.max(margin, Math.min(tooltip.x - tipWidth / 2, maxLeft));
    const arrowLeft = Math.max(10, Math.min(tooltip.x - left, tipWidth - 10));
    setTooltipPos((current) =>
      current && current.left === left && current.arrowLeft === arrowLeft
        ? current
        : { left, arrowLeft },
    );
  }, [tooltip]);

  const selectDay = useCallback(
    (index: number, focus = false) => {
      if (index < calendar.firstIndex || index > calendar.lastIndex) return;
      setSelectedIndex(index);
      const button = grid.current?.querySelector<HTMLButtonElement>(
        `button[data-index="${index}"]`,
      );
      if (focus) button?.focus({ preventScroll: true });
      // Scroll only the calendar without shifting the surrounding page.
      const viewport = scroller.current;
      if (button && viewport) {
        const cell = button.getBoundingClientRect();
        const view = viewport.getBoundingClientRect();
        if (cell.left < view.left + 2) {
          viewport.scrollLeft -= view.left + 2 - cell.left;
        }
        if (cell.right > view.right - 2) {
          viewport.scrollLeft += cell.right - view.right + 2;
        }
      }
      if (button && focus) {
        showTooltipForButton(button, index, false);
      }
    },
    [calendar.firstIndex, calendar.lastIndex, showTooltipForButton],
  );

  const readButton = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    const button = target.closest<HTMLButtonElement>("button[data-index]");
    if (!button) return null;
    const index = Number(button.dataset.index);
    if (!Number.isInteger(index)) return null;
    return { button, index };
  };

  const onGridPointerOver = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      const hit = readButton(event.target);
      if (!hit) return;
      showTooltipForButton(hit.button, hit.index, false);
    },
    [showTooltipForButton],
  );

  const onGridPointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      hideTooltip(false);
    },
    [hideTooltip],
  );

  const onGridFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const hit = readButton(event.target);
      if (!hit) return;
      setSelectedIndex(hit.index);
      showTooltipForButton(hit.button, hit.index, false);
    },
    [showTooltipForButton],
  );

  const onGridBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }
      hideTooltip(true);
    },
    [hideTooltip],
  );

  const onGridClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const hit = readButton(event.target);
      if (!hit) return;
      // Keep day details accessible on touch devices where hover is absent.
      event.preventDefault();
      selectDay(hit.index);
      showTooltipForButton(hit.button, hit.index, true);
    },
    [selectDay, showTooltipForButton],
  );

  const onGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        hideTooltip(true);
        return;
      }
      const hit = readButton(event.target);
      if (!hit) return;
      const { index } = hit;
      const row = index % 7;
      const rowStart = row < calendar.firstIndex ? row + 7 : row;
      const rowEnd = calendar.lastIndex - ((calendar.lastIndex - row) % 7);
      let next: number;
      switch (event.key) {
        case "ArrowLeft":
          next = index - 7;
          break;
        case "ArrowRight":
          next = index + 7;
          break;
        case "ArrowUp":
          next = row > 0 ? index - 1 : index;
          break;
        case "ArrowDown":
          next = row < 6 ? index + 1 : index;
          break;
        case "Home":
          next = event.ctrlKey ? calendar.firstIndex : rowStart;
          break;
        case "End":
          next = event.ctrlKey ? calendar.lastIndex : rowEnd;
          break;
        default:
          return;
      }
      event.preventDefault();
      selectDay(next, true);
    },
    [calendar.firstIndex, calendar.lastIndex, hideTooltip, selectDay],
  );

  const activeSelectedIndex =
    selectedIndex >= calendar.firstIndex && selectedIndex <= calendar.lastIndex
      ? selectedIndex
      : calendar.lastIndex;
  const activeLabel = tooltip ? (dayLabels[tooltip.index] ?? null) : null;
  const tooltipMotion = tooltipGliding ? tooltipGlide : tooltipFade;
  const tooltipVisible = tooltipOpen && Boolean(tooltipPos);
  const tooltipY = tooltip
    ? tooltip.placement === "top"
      ? tooltip.top - 6
      : tooltip.bottom + 6
    : 0;

  return (
    <div
      ref={wrapper}
      className={cn("relative", className)}
      onPointerLeave={onGridPointerLeave}
    >
      <style>{`
        @keyframes github-col-in {
          from {
            opacity: 0;
            transform: scale(0.84);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
      <p id={hintId} className="sr-only">
        {copy.keyboardHint}
      </p>
      <div
        ref={scroller}
        onScroll={() => hideTooltip(true)}
        style={scrollerWidth ? { maxWidth: scrollerWidth } : undefined}
        className="no-scrollbar mx-auto snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="mx-auto w-max"
          style={{ width: calendar.weekCount * CELL_SIZE }}
        >
          <div
            className="mb-1 flex h-4 items-center font-mono text-[10px] text-muted-foreground"
            aria-hidden="true"
          >
            {monthSpans.leadingColumns > 0 && (
              <div
                className="shrink-0"
                style={{ width: monthSpans.leadingColumns * CELL_SIZE }}
              />
            )}
            {monthSpans.items.map(({ date, span, label }) => (
              <div
                key={date}
                className="shrink-0"
                style={{ width: span * CELL_SIZE }}
              >
                <span className="sticky left-0 inline-block whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <CalendarGrid
            calendar={calendar}
            colors={colors}
            showCounts={showCounts}
            copy={copy}
            selectedIndex={activeSelectedIndex}
            dayLabels={dayLabels}
            stickerByIndex={stickerByIndex}
            hintId={hintId}
            gridRef={grid}
            onPointerOver={onGridPointerOver}
            onFocus={onGridFocus}
            onBlur={onGridBlur}
            onClick={onGridClick}
            onKeyDown={onGridKeyDown}
          />
        </div>
      </div>

      {tooltip && activeLabel && (
        <div
          ref={tooltipEl}
          id={tooltipId}
          role="tooltip"
          aria-hidden={!tooltipVisible}
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-50 w-max max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background will-change-transform",
            tooltipMotion,
            tooltipVisible ? "opacity-100" : "opacity-0",
          )}
          style={{
            transform: tooltipPos
              ? `translate3d(${tooltipPos.left}px, ${tooltipY}px, 0) translateY(${tooltip.placement === "top" ? "-100%" : "0%"})`
              : `translate3d(${tooltip.x}px, ${tooltipY}px, 0) translate(-50%, ${tooltip.placement === "top" ? "-100%" : "0%"})`,
          }}
        >
          {activeLabel.repositories ? (
            <div className="flex flex-col gap-0.5 [overflow-wrap:anywhere]">
              {activeLabel.repositories.map((repo) => (
                <p key={repo.name} className="flex items-center gap-1.5">
                  <span>{repo.name}</span>
                  <span className="inline-flex items-center gap-0.5 tabular-nums opacity-80">
                    <Star
                      className="size-3 shrink-0 fill-current"
                      aria-hidden="true"
                    />
                    {starFormat.format(repo.stars)}
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <p className="[overflow-wrap:anywhere]">{activeLabel.activity}</p>
          )}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 size-2 rounded-[1.5px] bg-foreground",
              tooltipGliding
                ? "transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                : undefined,
            )}
            style={{
              transform: `translate3d(${tooltipPos ? tooltipPos.arrowLeft - 4 : 0}px, 0, 0) rotate(45deg)`,
              ...(tooltip.placement === "top"
                ? { bottom: "-3px" }
                : { top: "-3px" }),
            }}
          />
        </div>
      )}

      {showLegend && (
        <div
          className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] text-muted-foreground"
          aria-label={copy.legend}
        >
          <span>{copy.less}</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ backgroundColor: resolveColor(level, colors) }}
            />
          ))}
          <span>{copy.more}</span>
          {stickerByIndex.size > 0 && stickers[0] && (
            <span className="ml-2 flex items-center gap-1">
              <Sticker
                def={stickers[0]}
                size={12}
                className="block shrink-0"
                focusable="false"
              />
              {copy.newRepository}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function GitHubCalendar({
  data,
  colors = DEFAULT_COLORS,
  minWeeks = 0,
  showCounts = true,
  showLegend = true,
  animateOnScroll = true,
  stickers = defaultRepoStickers,
  labels,
  className,
}: GitHubCalendarProps) {
  const calendar = useMemo(
    () => buildActivityCalendar(data, minWeeks),
    [data, minWeeks],
  );

  const copy = useMemo<Required<GitHubCalendarLabels>>(
    () => ({
      ...DEFAULT_LABELS,
      ...labels,
    }),
    [labels],
  );

  if (!calendar) {
    return null;
  }

  return (
    <GitHubCalendarView
      key={calendar.end}
      calendar={calendar}
      colors={colors}
      showCounts={showCounts}
      showLegend={showLegend}
      animateOnScroll={animateOnScroll}
      stickers={stickers}
      copy={copy}
      className={className}
    />
  );
}
