"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

export interface ThemeSwitcherProps {
  /** Extra classes applied to the three-column selector. */
  className?: string;
  /** Disable all theme changes. Forced themes also disable the selector. */
  disabled?: boolean;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/** A visual Light / Dark / System selector backed by next-themes. */
export function ThemeSwitcher({ className, disabled = false }: ThemeSwitcherProps) {
  const { theme, setTheme, forcedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion();
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const [focused, setFocused] = useState<ThemeValue | null>(null);
  const activeTheme = mounted ? forcedTheme || theme : undefined;
  const activeIndex = OPTIONS.findIndex((option) => option.value === activeTheme);
  const unavailable = disabled || !mounted || Boolean(forcedTheme);
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.26, bounce: 0.12 };

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % OPTIONS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index - 1 + OPTIONS.length) % OPTIONS.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = OPTIONS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setTheme(OPTIONS[nextIndex].value);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      aria-disabled={unavailable}
      className={cn("grid w-full max-w-[26rem] grid-cols-3 gap-3", className)}
    >
      {OPTIONS.map((option, index) => {
        const selected = activeTheme === option.value;

        return (
          <motion.button
            key={option.value}
            ref={(button) => { buttons.current[index] = button; }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={unavailable}
            tabIndex={index === (activeIndex < 0 ? 0 : activeIndex) ? 0 : -1}
            onClick={() => setTheme(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onFocus={() => setFocused(option.value)}
            onBlur={() => setFocused(null)}
            animate={{ y: focused === option.value && !reduceMotion ? -2 : 0 }}
            whileHover={unavailable || reduceMotion ? undefined : { y: -2 }}
            whileTap={unavailable || reduceMotion ? undefined : { scale: 0.97 }}
            transition={transition}
            className="group min-w-0 cursor-pointer rounded-xl outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={cn(
                "relative block rounded-xl group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-ring",
                !selected && "ring-1 ring-inset ring-border",
              )}
            >
              <ThemePreview theme={option.value} id={`${id}-${option.value}`} />
              {selected && (
                <motion.span
                  layoutId={`${id}-selection`}
                  initial={false}
                  transition={transition}
                  className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-foreground/70"
                />
              )}
            </span>
            <span
              className={cn(
                "mt-2.5 block text-sm leading-none",
                selected ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {option.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Static SVG artwork keeps every preview independent of the active site theme. */
function ThemePreview({ theme, id }: { theme: ThemeValue; id: string }) {
  const light = theme === "light";
  const system = theme === "system";
  const page = light ? "#fafafa" : "#080808";
  const ink = light ? "#111111" : "#f5f5f5";
  const line = light ? "#ececec" : "#262626";

  return (
    <svg aria-hidden="true" viewBox="0 0 124 80" fill="none" className="block w-full overflow-hidden rounded-xl">
      <defs>
        <linearGradient id={`${id}-backdrop`} x1="62" y1="0" x2="62" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor={light ? "#252525" : "#080808"} />
          <stop offset="1" stopColor={light ? "#818181" : "#191919"} />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="38" y1="0" x2="83" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.42" stopColor="white" stopOpacity="0.02" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.24" />
          <stop offset="0.58" stopColor="white" stopOpacity="0.02" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-page`}>
          <stop offset="50%" stopColor={page} />
          <stop offset="50%" stopColor={system ? "#fafafa" : page} />
        </linearGradient>
        <linearGradient id={`${id}-lines`} x1="20" x2="104" gradientUnits="userSpaceOnUse">
          <stop offset="50%" stopColor={line} />
          <stop offset="50%" stopColor={system ? "#ececec" : line} />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <path fill={`url(#${id}-backdrop)`} d="M0 0h124v80H0z" />
      <path fill={`url(#${id}-beam)`} d="M0 0h124v80H0z" />
      <path fill="white" opacity={light ? 0.13 : 0.07} filter={`url(#${id}-grain)`} d="M0 0h124v80H0z" />
      <rect x="20" y="16" width="84" height="55" rx="4" fill="black" opacity="0.15" />
      <rect x="20" y="13" width="84" height="55" rx="4" fill={`url(#${id}-page)`} />
      <path d="M35 13v55" stroke={line} strokeOpacity="0.6" />
      <path d="M25 22v-4h4m-4 4 4-4" stroke={ink} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
      <g fill={`url(#${id}-lines)`}>
        <rect x="67" y="19" width="24" height="5" rx="2.5" />
        <rect x="47" y="29" width="27" height="3" rx="1" />
        <rect x="47" y="34" width="36" height="3" rx="1" />
        <rect x="47" y="39" width="20" height="3" rx="1" />
        <rect x="47" y="44" width="28" height="3" rx="1" />
        <rect x="47" y="59" width="43" height="4" rx="2" />
      </g>
      <circle cx="88" cy="61" r="1.8" fill={system ? "#111111" : ink} />
    </svg>
  );
}
