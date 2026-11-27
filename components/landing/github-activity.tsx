"use client";

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
  type PointerEvent,
} from "react";
import { SiteSticker } from "@/components/shared/site-sticker";
import { Star } from "@/components/shared/site-icons";
import {
  githubRepoStickers,
  githubSectionConfig as copy,
} from "@/config/github";
import {
  activityColor,
  type ActivityCalendar,
} from "@/lib/github/github-activity";
import { cn } from "@/lib/utils";

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

type DayLabel = ReturnType<typeof buildDayLabel>;

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

function colDelay(column: number) {
  return `${column * 9}ms`;
}

function countTextClass(count: number) {
  const tone = count <= 2 ? "text-foreground" : "text-background";
  if (count >= 100) return cn(tone, "text-[5px] tracking-[-0.08em]");
  if (count >= 10) return cn(tone, "text-[6px] tracking-[-0.06em]");
  return cn(tone, "text-[7.5px]");
}

function buildDayLabel(day: ActivityCalendar["days"][number]) {
  const repositories = day.newRepositories?.length ? day.newRepositories : null;
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
  selectedIndex: number;
  dayLabels: DayLabel[];
  stickerByIndex: Map<number, (typeof githubRepoStickers)[number]>;
  hintId: string;
  gridRef: React.RefObject<HTMLDivElement | null>;
  onPointerOver: (event: PointerEvent<HTMLDivElement>) => void;
  onFocus: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const CalendarGrid = memo(function CalendarGrid({
  calendar,
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
          className={cn("flex flex-col", colMotion)}
          style={{ animationDelay: colDelay(column) }}
        >
          {copy.weekdays.map((_, row) => {
            const index = column * 7 + row;
            const day = calendar.days[index];
            const label = dayLabels[index];
            const stickerName = stickerByIndex.get(index);
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
                    className="group relative flex size-full cursor-pointer items-center justify-center rounded-full outline-none hover:z-10 focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-foreground"
                  >
                    {stickerName ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none flex size-3 shrink-0 items-center justify-center"
                      >
                        <SiteSticker
                          name={stickerName}
                          size={12}
                          loading="lazy"
                          className="block size-full motion-safe:transition-transform motion-safe:duration-150 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-125"
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none inline-flex size-3 select-none items-center justify-center rounded-full font-mono font-semibold leading-none tabular-nums group-hover:ring-1 group-hover:ring-foreground/60",
                          day.count === null && "ring-1 ring-inset ring-border",
                          day.count !== null &&
                            day.count > 0 &&
                            countTextClass(day.count),
                        )}
                        style={{
                          backgroundColor:
                            day.count === null
                              ? undefined
                              : activityColor(day.count),
                        }}
                      >
                        {day.count !== null && day.count > 0 ? day.count : null}
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

export function GitHubActivity({ calendar }: { calendar: ActivityCalendar }) {
  const [selectedIndex, setSelectedIndex] = useState(calendar.lastIndex);
  const [tooltip, setTooltip] = useState<TooltipTarget | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipGliding, setTooltipGliding] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    left: number;
    arrowLeft: number;
  } | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const wrapper = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tooltipEl = useRef<HTMLDivElement>(null);
  const tooltipOpenRef = useRef(false);
  const pinnedRef = useRef(false);
  const hintId = useId();
  const tooltipId = useId();

  const dayLabels = useMemo(
    () => calendar.days.map(buildDayLabel),
    [calendar.days],
  );

  const monthLabels = useMemo(
    () =>
      calendar.months.map(({ date, column }) => ({
        date,
        column,
        label: monthFormat.format(new Date(`${date}T00:00:00Z`)),
      })),
    [calendar.months],
  );

  const stickerByIndex = useMemo(() => {
    const map = new Map<number, (typeof githubRepoStickers)[number]>();
    let rank = 0;
    for (let index = 0; index < calendar.days.length; index++) {
      if (calendar.days[index]?.newRepositories?.length) {
        map.set(index, githubRepoStickers[rank % githubRepoStickers.length]);
        rank++;
      }
    }
    return map;
  }, [calendar.days]);

  useEffect(() => {
    if (scroller.current)
      scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [calendar.end]);

  useEffect(() => {
    const node = grid.current;
    if (!node) return;
    if (
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
  }, []);

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
      // Scroll only the calendar, without shifting the surrounding page.
      const viewport = scroller.current;
      if (button && viewport) {
        const cell = button.getBoundingClientRect();
        const view = viewport.getBoundingClientRect();
        if (cell.left < view.left + 2)
          viewport.scrollLeft -= view.left + 2 - cell.left;
        if (cell.right > view.right - 2)
          viewport.scrollLeft += cell.right - view.right + 2;
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
    (event: React.MouseEvent<HTMLDivElement>) => {
      const hit = readButton(event.target);
      if (!hit) return;
      // Keep details available on touch, where hover is absent.
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

  const activeLabel = tooltip ? dayLabels[tooltip.index] : null;
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
      className="relative"
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
        className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-max min-w-full px-0.5">
          <div
            className="relative mb-1 h-4 font-mono text-[10px] text-muted-foreground"
            aria-hidden="true"
          >
            {monthLabels.map(({ date, column, label }) => (
              <span
                key={date}
                className="absolute"
                style={{ left: column * 13 }}
              >
                {label}
              </span>
            ))}
          </div>
          <CalendarGrid
            calendar={calendar}
            selectedIndex={selectedIndex}
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
                    <Star className="size-3 shrink-0" />
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
            style={{ backgroundColor: activityColor(level) }}
          />
        ))}
        <span>{copy.more}</span>
        {stickerByIndex.size > 0 && (
          <span className="ml-2 flex items-center gap-1">
            <SiteSticker
              name={githubRepoStickers[0]}
              size={12}
              loading="lazy"
              className="block shrink-0"
            />
            {copy.newRepository}
          </span>
        )}
      </div>
    </div>
  );
}
