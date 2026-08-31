"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export type CarouselItem = {
  id: string;
  /** Slide heading, also used for screen-reader labels. */
  title: string;
  description?: string;
  content: ReactNode;
};

export type CarouselProps = {
  items: CarouselItem[];
  /** Accessible name for the carousel region. */
  ariaLabel?: string;
  className?: string;
};

/** Minimum horizontal travel (px) before a touch counts as a swipe. */
const SWIPE_THRESHOLD = 48;

export function Carousel({
  items,
  ariaLabel = "carousel",
  className,
}: CarouselProps) {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = items.length;

  const goToIndex = useCallback((next: number) => {
    setSlide(([current]) => [next, next > current ? 1 : -1]);
  }, []);

  const showNext = useCallback(() => {
    setSlide(([current]) =>
      total === 0 ? [current, 1] : [(current + 1) % total, 1],
    );
  }, [total]);

  const showPrevious = useCallback(() => {
    setSlide(([current]) =>
      total === 0 ? [current, -1] : [(current - 1 + total) % total, -1],
    );
  }, [total]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "Home") {
        event.preventDefault();
        goToIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToIndex(total - 1);
      }
    },
    [goToIndex, showNext, showPrevious, total],
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }, []);

  // Only treat the gesture as a swipe when it is mostly horizontal, so vertical
  // page scrolling on touch devices is never hijacked.
  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = touchStart.current;
      touchStart.current = null;
      const touch = event.changedTouches[0];
      if (!start || !touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      )
        return;

      if (deltaX < 0) showNext();
      else showPrevious();
    },
    [showNext, showPrevious],
  );

  const variants = useMemo(
    () => ({
      enter: (dir: number) => ({
        opacity: 0,
        x: reduceMotion ? 0 : dir >= 0 ? 40 : -40,
      }),
      center: { opacity: 1, x: 0 },
      exit: (dir: number) => ({
        opacity: 0,
        x: reduceMotion ? 0 : dir >= 0 ? -40 : 40,
      }),
    }),
    [reduceMotion],
  );

  if (total === 0) return null;

  const active = items[index] ?? items[0];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
      >
        {/* Viewport — slides share one grid cell so height never collapses
            mid-transition. */}
        <div
          className="relative grid overflow-hidden px-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={active.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${active.title}`}
              className="col-start-1 row-start-1 w-full"
            >
              <div className="mb-5 space-y-1">
                <h3 className="text-sm font-medium">{active.title}</h3>
                {active.description ? (
                  <p className="text-sm text-muted-foreground">
                    {active.description}
                  </p>
                ) : null}
              </div>
              {active.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls: position dots on the left, counter + arrows on the right. */}
      <div className="mt-5 flex items-center justify-between gap-3 px-6">
        <div className="flex items-center gap-0.5">
          {items.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToIndex(itemIndex)}
              aria-label={`Show example: ${item.title}`}
              aria-current={itemIndex === index}
              className="group flex h-9 items-center px-1 outline-none sm:h-8"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none",
                  itemIndex === index
                    ? "w-5 bg-foreground/80"
                    : "w-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/60",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="text-xs tabular-nums text-muted-foreground mr-1"
          >
            {pad(index + 1)} / {pad(total)}
          </span>

        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Example {index + 1} of {total}: {active.title}
      </p>
    </div>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
