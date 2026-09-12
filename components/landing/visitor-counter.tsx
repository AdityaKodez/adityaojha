"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { revealOnMount } from "@/lib/motion";

/* Odometer digits roll inside a fixed-height cell. Same spring as the shared
   reveal helpers so the counter speaks the site's motion language. */
const CELL_HEIGHT = "40px";
const ROLL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const;

function Digit({ digit, animate }: { digit: number; animate: boolean }) {
  if (!animate) {
    return <span className="leading-none">{digit}</span>;
  }

  return (
    <span
      className="inline-block overflow-hidden"
      style={{ height: CELL_HEIGHT }}
    >
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: `calc(${digit} * -${CELL_HEIGHT})` }}
        transition={ROLL_SPRING}
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

/* Palette mirrors the footer garden above (BLOOM_PINK / STEM / BLOOM_CREAM)
   so the flower reads as part of the same bed of plants. */
function Flower({ animate }: { animate: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transformOrigin: "50% 100%" }}
      animate={animate ? { rotate: [-5, 5, -5] } : undefined}
      transition={
        animate ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined
      }
      className="mr-1.5 shrink-0"
    >
      <path
        d="M12 15v7"
        stroke="#98a265"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse
        cx="9.4"
        cy="18.4"
        rx="2.4"
        ry="1.1"
        transform="rotate(-28 9.4 18.4)"
        fill="#98a265"
      />
      {[
        [12, 4.9],
        [7.63, 8.08],
        [9.3, 13.22],
        [14.7, 13.22],
        [16.37, 8.08],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill="#e06c9f" />
      ))}
      <circle cx="12" cy="9.5" r="2.4" fill="#cfc98d" />
    </motion.svg>
  );
}

export function VisitorCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/visitor-count")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { visitors?: number | null } | null) => {
        if (
          !cancelled &&
          data &&
          typeof data.visitors === "number" &&
          data.visitors > 0
        ) {
          setVisitors(data.visitors);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // Stays out of the layout until real data arrives, so dev environments
  // without credentials render nothing rather than a placeholder.
  if (visitors === null) return null;

  const chars = visitors.toLocaleString("en-US").split("");

  return (
    <p
      {...revealOnMount({ y: 6 })}
      className="flex flex-wrap items-center justify-center font-mono text-[11px] tracking-[0.15em] text-muted-foreground"
    >
      <Flower animate={!reducedMotion} />
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
    </p>
  );
}
