"use client";

import { motion, useReducedMotion } from "motion/react";

/* Odometer digits roll inside a fixed-height cell. Same spring as the shared
   reveal helpers so the counter speaks the site's motion language. */
const CELL_HEIGHT = "28px";
const ROLL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const;

function Digit({ digit, animate }: { digit: number; animate: boolean }) {
  // Keep the same markup during hydration, even when the browser prefers
  // reduced motion. Resolve the wheel immediately instead of replacing it.
  return (
    <span
      className="inline-block overflow-hidden"
      style={{ height: CELL_HEIGHT }}
    >
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: `calc(${digit} * -${CELL_HEIGHT})` }}
        transition={animate ? ROLL_SPRING : { duration: 0 }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span
            key={n}
            className="flex items-center justify-center leading-none"
            style={{ height: CELL_HEIGHT }}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function VisitorCounterOdometer({ visitors }: { visitors: number }) {
  const reducedMotion = useReducedMotion();
  const chars = visitors.toLocaleString("en-US").split("");

  return (
    <p
      className="liquid-glass flex flex-wrap items-center justify-center rounded-full px-5 py-1.5 font-mono text-[11px] tracking-[0.15em] text-muted-foreground"
    >
      {/* The odometer stacks all numerals 0-9 per column to animate the roll,
          so assistive tech / crawlers would otherwise read the entire digit
          wheel. Hide the animated visual and expose the real number below. */}
      <span aria-hidden="true" className="flex flex-wrap items-center justify-center">
        <span>Say hi, visitor</span>
        {/* tracking-normal plus an explicit gap: the digits are separate flex
            items, so inherited letter-spacing would space them unevenly. The
            gap mirrors the 0.15em rhythm of the surrounding text. */}
        <span className="ml-2 flex items-center gap-[0.15em] font-medium tracking-normal text-foreground">
          {chars.map((char, index) =>
            char >= "0" && char <= "9" ? (
              <Digit
                key={`${chars.length}-${index}`}
                digit={Number(char)}
                animate={!reducedMotion}
              />
            ) : (
              <span key={index} className="leading-none">
                {char}
              </span>
            ),
          )}
        </span>
      </span>
      <span className="sr-only">
        Say hi, visitor {visitors.toLocaleString("en-US")}
      </span>
    </p>
  );
}
