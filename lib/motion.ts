import type { MotionProps, Transition, Variants } from "motion/react";

/**
 * Shared entrance motion for the site.
 *
 * The hero greeting sets the reference: a short fade with a small rise.
 * Everything that enters on scroll speaks the same language so the page reads
 * as one system rather than a dozen separate reveals.
 *
 * Timing is deliberately split per value, which is what makes it feel snappy
 * rather than slow:
 *   - opacity lands first (fast), so nothing lingers as a ghost
 *   - y settles on a critically damped spring, so it stops without wobble
 *
 * Only `opacity` and `y` are animated. Filter-based reveals were removed:
 * animating `filter: blur()` cannot be composited and forces the browser to
 * re-rasterize the whole subtree on every frame, which shows up as forced
 * reflow and scroll jank on section-sized content.
 *
 * Reduced motion: site-internal usage relies on the `[data-reveal]` rule in
 * `app/globals.css`, which pins the resolved state with `!important` and so
 * beats Motion's inline styles. That keeps these helpers hook-free and avoids
 * hydration mismatches. Registry components cannot depend on this file or that
 * stylesheet, so they gate on `useReducedMotion()` locally instead.
 */

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Damping ratio is ~1.03, so `y` never overshoots into a bounce. */
const REVEAL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} satisfies Transition;

const OPACITY_DURATION = 0.18;

export type RevealOptions = {
  /** Rise distance in px. Keep it small: this is a settle, not a slide. */
  y?: number;
  /** Seconds to hold before starting. Use `revealDelay()` for lists. */
  delay?: number;
  /** Intersection root margin for scroll-triggered reveals. */
  margin?: string;
  /** How much of the element must be visible before it fires. */
  amount?: "some" | "all" | number;
};

type RevealProps = Pick<
  MotionProps,
  "initial" | "animate" | "whileInView" | "viewport" | "transition"
> & {
  "data-reveal": "";
};

function hiddenState(y: number) {
  return { opacity: 0, y };
}

function resolvedState() {
  return { opacity: 1, y: 0 };
}

function revealTransition(delay: number): Transition {
  return {
    default: { ...REVEAL_SPRING, delay },
    opacity: { duration: OPACITY_DURATION, ease: MOTION_EASE, delay },
  };
}

/**
 * Scroll-triggered fade + rise. Fires once.
 *
 * Put the reveal on whatever the eye actually reads: text, rows, cards. When a
 * section animates its own children, let the section wrapper rise without its
 * own delay so entrances never stack.
 */
export function reveal({
  y = 8,
  delay = 0,
  margin = "-40px",
  amount,
}: RevealOptions = {}): RevealProps {
  return {
    "data-reveal": "",
    initial: hiddenState(y),
    whileInView: resolvedState(),
    viewport: { once: true, margin, amount },
    transition: revealTransition(delay),
  };
}

/**
 * Same reveal, driven by mount instead of scroll. For content that appears in
 * response to an interaction, such as rows inside a section that just expanded.
 */
export function revealOnMount({
  y = 8,
  delay = 0,
}: Omit<RevealOptions, "margin" | "amount"> = {}): RevealProps {
  return {
    "data-reveal": "",
    initial: hiddenState(y),
    animate: resolvedState(),
    transition: revealTransition(delay),
  };
}

/**
 * Variant pair for parent-driven staggers, where the container owns the
 * sequencing via `staggerChildren`.
 */
export function revealVariants({
  y = 8,
}: Pick<RevealOptions, "y"> = {}): Variants {
  return {
    hidden: hiddenState(y),
    visible: {
      ...resolvedState(),
      transition: revealTransition(0),
    },
  };
}

/**
 * Capped stagger for lists. The cap matters: without it a long list leaves the
 * last item waiting a second to appear, which reads as sluggish.
 */
export function revealDelay(index: number, step = 0.04, max = 0.2) {
  return Math.min(index * step, max);
}
