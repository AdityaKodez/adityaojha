"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ComponentType } from "react";

/** Pill height in pixels. The vertical step defaults to the same value. */
const PILL_HEIGHT = 50;
/** Default milliseconds between rotations. */
const DEFAULT_INTERVAL = 2000;
/** Default vertical distance between neighbouring pills, in pixels. */
const DEFAULT_STEP = 50;
/** Number of pills visible on each side of the active one. */
const VISIBLE_COUNT = 3;
/** Seconds one rotation step takes to travel. */
const TRAVEL_SECONDS = 0.5;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fades the stack out at both ends so pills dissolve instead of clipping. */
const EDGE_FADE =
  "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)";

/**
 * Pill fill. The token carries a literal fallback so a consumer project that
 * lacks this site's muted token still renders the pill.
 */
const PILL_BG =
  "color-mix(in oklab, var(--muted, oklch(0.97 0 0)) 30%, transparent)";

export interface StackRolodexItem {
  /** Stable key for the pill. */
  id: string;
  /** Text inside the pill. */
  name: string;
  /** Any icon component that accepts a className. */
  icon: ComponentType<{ className?: string }>;
  /** Brand color the icon takes while the pill is the active one. */
  color?: string;
}

export interface StackRolodexProps {
  /** Pills to cycle through. Needs at least two items to rotate. */
  items: StackRolodexItem[];
  /** Static line rendered beside the stack. Omit to render the stack alone. */
  label?: string;
  /** Milliseconds between rotations. */
  interval?: number;
  /** Vertical distance between neighbouring pills, in pixels. */
  step?: number;
  className?: string;
}

/**
 * A rotating vertical pill stack, rolodex-style. The active index grows
 * forever and each pill's offset wraps into a centred window, so the rotation
 * never hits an edge or snaps back to the start. Pills that cross the wrap
 * point teleport with a zero-duration transition instead of sweeping across
 * the stack.
 */
export function StackRolodex({
  items,
  label,
  interval = DEFAULT_INTERVAL,
  step = DEFAULT_STEP,
  className,
}: StackRolodexProps) {
  const [{ active, previous }, setActive] = useState({ active: 0, previous: 0 });
  const reduceMotion = useReducedMotion();

  const count = items.length;
  const half = Math.floor(count / 2);
  const stackHeight = 2 * VISIBLE_COUNT * step + PILL_HEIGHT;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      setActive((s) => ({ active: s.active + 1, previous: s.active }));
    }, interval);
    return () => clearInterval(id);
  }, [count, interval]);

  if (count === 0) return null;

  /**
   * Signed distance from the active pill, wrapped into a centred window.
   * Negative means above the centre, positive means below.
   */
  const offsetFor = (index: number, activeStep: number) => {
    const wrapped = (((index - activeStep) % count) + count) % count;
    return wrapped > half ? wrapped - count : wrapped;
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-8",
        className,
      )}
    >
      <ul
        className="relative w-44 shrink-0"
        style={{
          height: stackHeight,
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
        }}
      >
        {items.map((item, index) => {
          const d = offsetFor(index, active);
          const was = offsetFor(index, previous);
          const crossed = Math.abs(d - was) > 1;
          const distance = Math.abs(d);
          const Icon = item.icon;
          // The brand color lands on the icon only; the pill itself keeps its
          // neutral styling in every slot.
          const tint = d === 0 ? item.color : undefined;

          return (
            <motion.li
              key={item.id}
              initial={false}
              className={cn(
                "absolute left-0 right-0 mx-auto flex w-40 items-center justify-center gap-3.5",
                "rounded-full",
                d === 0 ? "shadow-xs" : "shadow-none",
              )}
              style={{
                height: PILL_HEIGHT,
                top: "50%",
                marginTop: -PILL_HEIGHT / 2,
                zIndex: count - distance,
                background: PILL_BG,
              }}
              animate={{
                y: d * step,
                scale: 1 - distance * 0.14,
                opacity: distance > VISIBLE_COUNT ? 0 : 1 - distance * 0.45,
              }}
              transition={
                crossed || reduceMotion
                  ? { duration: 0 }
                  : { duration: TRAVEL_SECONDS, ease: EASE }
              }
            >
              {/* The pill text names the item, so the icon is decorative. */}
              <span
                aria-hidden
                className="flex motion-safe:transition-colors motion-safe:duration-500"
                style={tint ? { color: tint } : undefined}
              >
                <Icon className="size-6" />
              </span>
              <span className="truncate text-base font-medium">
                {item.name}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {label ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: TRAVEL_SECONDS, ease: EASE }
          }
          className="whitespace-nowrap text-2xl font-medium tracking-tight sm:text-4xl"
        >
          {label}
        </motion.p>
      ) : null}
    </div>
  );
}
