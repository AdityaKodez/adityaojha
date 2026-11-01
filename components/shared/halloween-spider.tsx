"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { halloweenConfig } from "@/config/halloween";
import { revealOnMount } from "@/lib/motion";
import styles from "./halloween-spider.module.css";

const WEB_SPOKES = "M180 0 0 0M180 0Q94 24 8 44M180 0Q105 48 28 91M180 0Q145 47 109 93L71 143M180 0Q151 85 122 169M180 0V180";
const WEB_RINGS = [
  "M149 0Q153 4 150 8Q155 11 153 16Q160 19 161 25Q167 25 170 30Q175 28 180 32",
  "M123 0Q130 8 126 14Q134 21 132 29Q142 35 145 46Q154 46 162 54Q171 51 180 57",
  "M95 0Q104 11 99 21Q112 31 109 43Q123 53 129 67Q143 68 153 79Q166 75 180 85",
  "M63 0Q76 16 68 29Q86 44 81 59Q102 73 109 93Q129 93 142 110Q162 104 180 117",
  "M31 0Q46 21 38 36Q60 56 54 75Q80 92 90 118Q113 119 132 140Q159 131 180 149",
  "M3 0Q20 26 10 44Q35 67 29 90Q60 109 72 142Q100 145 122 168Q154 157 180 178",
];
const SPIDER_LEGS = [
  "M22 29C17 24 12 22 10 17L8 5 5 1 7 18C9 24 14 28 21 33Z",
  "M21 31 9 24 2 25 0 36 4 29 9 29 21 35Z",
  "M21 34 8 33 2 39 4 48 5 40 10 37 22 37Z",
  "M22 37 14 42 12 53 17 59 15 52 18 44 24 40Z",
];

export function HalloweenSpider() {
  const id = useId();
  const spiderRef = useRef<HTMLSpanElement>(null);
  const threadRef = useRef<HTMLSpanElement>(null);
  const animationsRef = useRef<Animation[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
    const handleChange = () => {
      if (reducedMotion.matches) stop();
    };

    reducedMotion.addEventListener("change", handleChange);
    return () => {
      stop();
      reducedMotion.removeEventListener("change", handleChange);
    };
  }, []);

  const nudge = () => {
    const spider = spiderRef.current;
    const thread = threadRef.current;
    if (
      !spider ||
      !thread ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    animationsRef.current.forEach((animation) => animation.cancel());
    const timing: KeyframeAnimationOptions = {
      duration: 1400,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    };
    animationsRef.current = [
      spider.animate(
        [
          { transform: "translateY(0) rotate(0)", offset: 0 },
          { transform: "translateY(23.2px) rotate(-9deg)", offset: 0.36 },
          { transform: "translateY(20px) rotate(6deg)", offset: 0.64 },
          { transform: "translateY(0) rotate(0)", offset: 1 },
        ],
        timing,
      ),
      thread.animate(
        [
          { transform: "scaleY(0.35)", offset: 0 },
          { transform: "scaleY(0.7125)", offset: 0.36 },
          { transform: "scaleY(0.6625)", offset: 0.64 },
          { transform: "scaleY(0.35)", offset: 1 },
        ],
        timing,
      ),
    ];
  };

  return (
    <motion.div
      className={`${styles.scene} no-js-visible`}
      {...revealOnMount({ y: -8 })}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 180 180"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        className={styles.web}
      >
        <defs>
          <linearGradient id={`${id}-silk`} x1="20" y1="150" x2="148" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--muted-foreground)" stopOpacity="0.2" />
            <stop offset="0.42" stopColor="var(--foreground)" stopOpacity="0.58" />
            <stop offset="0.66" stopColor="var(--muted-foreground)" stopOpacity="0.32" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.55" />
          </linearGradient>
          <g id={`${id}-web`}>
            <path d={WEB_SPOKES} opacity="0.65" />
            {WEB_RINGS.map((path) => <path key={path} d={path} />)}
          </g>
        </defs>
        <use href={`#${id}-web`} stroke="var(--halloween-spider-ink)" strokeOpacity="0.12" transform="translate(-0.8 1.4)" />
        <use href={`#${id}-web`} stroke={`url(#${id}-silk)`} />
        <g stroke="var(--halloween-spider-shine)" strokeWidth="0.5" opacity="0.8">
          <path d="m69 29 10-2m2 32 10-7m18 41 7-9m26 26 3-9m-91-26 9-5m27 48 6-8m36 30 3-9" />
        </g>
        <g fill="var(--halloween-spider-shine)" stroke="none" opacity="0.8">
          <circle cx="68" cy="29" r="1" />
          <circle cx="109" cy="93" r="0.9" />
          <circle cx="132" cy="140" r="1.1" />
          <circle cx="54" cy="75" r="0.8" />
        </g>
      </svg>
      <button
        type="button"
        aria-label={halloweenConfig.spiderLabel}
        className={styles.trigger}
        onPointerEnter={(event) => {
          if (
            event.pointerType === "mouse" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches
          ) {
            nudge();
          }
        }}
        onClick={nudge}
      >
        <span ref={threadRef} aria-hidden="true" className={styles.thread} />
        <span ref={spiderRef} aria-hidden="true" className={styles.spider}>
          <svg viewBox="0 0 56 62" fill="none" focusable="false" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <radialGradient id={`${id}-body`} cx="0.3" cy="0.22" r="0.8">
                <stop stopColor="var(--halloween-spider-shine)" />
                <stop offset="0.22" stopColor="var(--halloween-spider-shell)" />
                <stop offset="0.62" stopColor="var(--halloween-spider-ink)" />
                <stop offset="0.88" stopColor="var(--halloween-spider-ink)" />
                <stop offset="1" stopColor="var(--halloween-spider-shell)" />
              </radialGradient>
              <linearGradient id={`${id}-leg`} x1="0" y1="0" x2="1" y2="0.8">
                <stop stopColor="var(--halloween-spider-shine)" />
                <stop offset="0.3" stopColor="var(--halloween-spider-shell)" />
                <stop offset="0.65" stopColor="var(--halloween-spider-ink)" />
                <stop offset="1" stopColor="var(--halloween-spider-shell)" />
              </linearGradient>
              <g id={`${id}-legs`} fill={`url(#${id}-leg)`} stroke="var(--halloween-spider-shine)" strokeWidth="0.45">
                {SPIDER_LEGS.map((path) => <path key={path} d={path} />)}
              </g>
            </defs>
            <use href={`#${id}-legs`} />
            <use href={`#${id}-legs`} transform="translate(56 0) scale(-1 1)" />
            <path d="M28 3C18 3 15 11 16 20C17 29 22 33 28 33S39 29 40 20C41 11 38 3 28 3Z" fill={`url(#${id}-body)`} stroke="var(--halloween-spider-shine)" strokeWidth="0.65" />
            <path d="M20 10C18 14 18 20 20 24M35 26C37 23 38 18 37 14" stroke="var(--halloween-spider-shine)" strokeWidth="0.8" opacity="0.6" />
            <path d="m24 11 9 1-4 6 3 7-9-1 4-6Z" fill="var(--destructive)" />
            <path d="m25 12 6 0-3 4" stroke="var(--halloween-spider-shine)" strokeWidth="0.5" opacity="0.5" />
            <ellipse cx="28" cy="35" rx="6.5" ry="7.5" fill={`url(#${id}-body)`} stroke="var(--halloween-spider-shell)" strokeWidth="0.8" />
            <path d="m25 41-2 4 3 2m5-6 2 4-3 2" stroke="var(--halloween-spider-ink)" strokeWidth="1.8" />
            <path d="m24 32 1-1m5 1 1-1" stroke="var(--halloween-spider-shine)" strokeWidth="0.8" opacity="0.7" />
          </svg>
        </span>
      </button>
    </motion.div>
  );
}
