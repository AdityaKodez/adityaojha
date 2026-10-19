"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { githubSectionConfig as copy } from "@/config/github";
import { activityColor, type ActivityCalendar } from "@/lib/github-activity";
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

function dayLabel(day: ActivityCalendar["days"][number]) {
  const count =
    day.count === null
      ? copy.unavailable
      : `${day.count} ${day.count === 1 ? copy.contribution : copy.contributions}`;
  return { date: dateFormat.format(new Date(`${day.date}T00:00:00Z`)), count };
}

export function GitHubActivity({ calendar }: { calendar: ActivityCalendar }) {
  const [selectedIndex, setSelectedIndex] = useState(calendar.lastIndex);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const hintId = useId();

  useEffect(() => {
    if (scroller.current)
      scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [calendar.end]);

  function selectDay(index: number, focus = false) {
    if (index < calendar.firstIndex || index > calendar.lastIndex) return;
    setSelectedIndex(index);
    const button = buttons.current.get(index);
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
  }

  function onDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
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
  }

  return (
    <div>
      <p id={hintId} className="sr-only">
        {copy.keyboardHint}
      </p>
      <div
        ref={scroller}
        className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-max min-w-full px-0.5">
          <div
            className="relative mb-2 h-4 font-mono text-[10px] text-muted-foreground"
            aria-hidden="true"
          >
            {calendar.months.map(({ date, column }) => (
              <span
                key={date}
                className="absolute"
                style={{ left: column * 13 }}
              >
                {monthFormat.format(new Date(`${date}T00:00:00Z`))}
              </span>
            ))}
          </div>
          <div
            role="grid"
            aria-label={copy.calendarLabel}
            aria-describedby={hintId}
          >
            {copy.weekdays.map((weekday, row) => (
              <div
                key={weekday}
                role="row"
                aria-label={weekday}
                className="flex"
              >
                {Array.from({ length: calendar.weekCount }, (_, column) => {
                  const index = column * 7 + row;
                  const day = calendar.days[index];
                  const label = dayLabel(day);
                  return (
                    <div
                      key={day.date}
                      role="gridcell"
                      className="size-[13px] shrink-0"
                    >
                      {day.inRange && (
                        <Tooltip
                          open={tooltipIndex === index}
                          onOpenChange={(open) =>
                            setTooltipIndex((current) =>
                              open ? index : current === index ? null : current,
                            )
                          }
                        >
                          <TooltipTrigger asChild>
                            <button
                              ref={(node) => {
                                if (node) buttons.current.set(index, node);
                                else buttons.current.delete(index);
                              }}
                              type="button"
                              tabIndex={index === selectedIndex ? 0 : -1}
                              aria-label={`${label.date}: ${label.count}`}
                              data-date={day.date}
                              data-count={day.count ?? "missing"}
                              className="group flex size-full cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                              onFocus={() => setSelectedIndex(index)}
                              onClick={(event) => {
                                // Keep details available on touch, where hover is absent.
                                event.preventDefault();
                                selectDay(index);
                                setTooltipIndex(index);
                              }}
                              onKeyDown={(event) => onDayKeyDown(event, index)}
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "size-[9px] rounded-full group-hover:outline group-hover:outline-1 group-hover:outline-offset-1 group-hover:outline-muted-foreground",
                                  day.count === null &&
                                    "ring-1 ring-inset ring-border",
                                )}
                                style={
                                  day.count === null
                                    ? undefined
                                    : {
                                        backgroundColor: activityColor(
                                          day.count,
                                        ),
                                      }
                                }
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={4}>
                            <p>
                              {label.date}: {label.count}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
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
      </div>
    </div>
  );
}
