import type { MotionProps, Transition, Variants } from "motion/react";

/**
 * Shared entrance motion for the site.
 *
 * The hero greeting sets the reference: a short blur-to-sharp resolve with a
 * small rise. Everything that enters on scroll speaks the same language so the
 * page reads as one system rather than a dozen separate reveals.
 *
 * Timing is deliberately split per value, which is what makes it feel snappy
 * rather than slow:
 *   - opacity lands first (fast), so nothing lingers as a ghost
 *   - y settles on a critically damped spring, so it stops without wobble
 *   - filter resolves last, so the final beat is a focus pull, not a slide
 *
 * Reduced motion: site-internal usage relies on the `[data-reveal]` rule in
 * `app/globals.css`, which pins the resolved state with `!important` and so
 * beats Motion's inline styles. That keeps these helpers hook-free and avoids
 * hydration mismatches. Registry components cannot depend on this file or that
 * stylesheet, so they gate on `useReducedMotion()` locally instead.
 */

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Damping ratio is ~1.03, so `filter` never overshoots into a negative blur. */
const REVEAL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} satisfies Transition;

const OPACITY_DURATION = 0.18;
const BLUR_DURATION = 0.32;

export type RevealOptions = {
  /** Rise distance in px. Keep it small: this is a settle, not a slide. */
  y?: number;
  /** Starting blur radius in px. `0` opts out of the filter entirely. */
  blur?: number;
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

function hiddenState(y: number, blur: number) {
  return blur > 0
    ? { opacity: 0, y, filter: `blur(${blur}px)` }
    : { opacity: 0, y };
}

function resolvedState(blur: number) {
  return blur > 0
    ? {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        // Drop the filter once it lands. A resting `blur(0px)` still promotes
        // the subtree to its own raster layer and neutralises any
        // `backdrop-filter` inside it.
        transitionEnd: { filter: "none" },
      }
    : { opacity: 1, y: 0 };
}

function revealTransition(delay: number, blur: number): Transition {
  return {
    default: { ...REVEAL_SPRING, delay },
    opacity: { duration: OPACITY_DURATION, ease: MOTION_EASE, delay },
    ...(blur > 0
      ? { filter: { duration: BLUR_DURATION, ease: MOTION_EASE, delay } }
      : {}),
  };
}

/**
 * Scroll-triggered blur reveal. Fires once.
 *
 * Put the blur on whatever the eye actually reads: text, rows, cards. When a
 * section animates its own children, give the section `blur: 0` so blurs never
 * stack on top of each other.
 */
export function blurReveal({
  y = 8,
  blur = 6,
  delay = 0,
  margin = "-40px",
  amount,
}: RevealOptions = {}): RevealProps {
  return {
    "data-reveal": "",
    initial: hiddenState(y, blur),
    whileInView: resolvedState(blur),
    viewport: { once: true, margin, amount },
    transition: revealTransition(delay, blur),
  };
}

/**
 * Same reveal, driven by mount instead of scroll. For content that appears in
 * response to an interaction, such as rows inside a section that just expanded.
 */
export function blurRevealOnMount({
  y = 8,
  blur = 6,
  delay = 0,
}: Omit<RevealOptions, "margin" | "amount"> = {}): RevealProps {
  return {
    "data-reveal": "",
    initial: hiddenState(y, blur),
    animate: resolvedState(blur),
    transition: revealTransition(delay, blur),
  };
}

/**
 * Variant pair for parent-driven staggers, where the container owns the
 * sequencing via `staggerChildren`.
 */
export function blurRevealVariants({
  y = 8,
  blur = 6,
}: Pick<RevealOptions, "y" | "blur"> = {}): Variants {
  return {
    hidden: hiddenState(y, blur),
    visible: {
      ...resolvedState(blur),
      transition: revealTransition(0, blur),
    },
  };
}

/**
 * Capped stagger for lists. The cap matters: without it a long list leaves the
 * last item waiting a second to sharpen, which reads as sluggish.
 */
export function revealDelay(index: number, step = 0.04, max = 0.2) {
  return Math.min(index * step, max);
}
