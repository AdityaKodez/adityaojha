"use client";

import { useId, type SVGProps } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./logo.module.css";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Logo({ size = 20, className, onPointerMove, onPointerLeave, ...props }: LogoProps) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const wind = useSpring(0, { stiffness: 200, damping: 14, mass: 0.45 });
  const lean = useTransform(wind, (value) => `skewX(${-value}deg) rotate(${value * 0.28}deg)`);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 48"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", styles.logo, className)}
      {...props}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (reducedMotion || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width) return;
        const position = (event.clientX - bounds.left) / bounds.width - 0.5;
        wind.set(Math.max(-16, Math.min(16, position * 32)));
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        wind.set(0);
      }}
    >
      <defs>
        <linearGradient id={`${id}-wax`} x1="13" y1="17" x2="28" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--logo-wax-light)" />
          <stop offset="0.35" stopColor="var(--logo-wax-gold)" />
          <stop offset="1" stopColor="var(--logo-wax-amber)" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="20" y1="18" x2="27" y2="47" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--logo-wax-amber)" />
          <stop offset="1" stopColor="var(--logo-wax-shadow)" />
        </linearGradient>
        <linearGradient id={`${id}-flame`} x1="20" y1="1" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--logo-flame)" />
          <stop offset="0.38" stopColor="var(--logo-wax-gold)" />
          <stop offset="0.75" stopColor="var(--logo-wax-amber)" />
          <stop offset="1" stopColor="var(--logo-flame)" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="var(--logo-wax-light)" stopOpacity="0.8" />
          <stop offset="0.22" stopColor="var(--logo-wax-gold)" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="var(--logo-wax-amber)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--logo-wax-amber)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-reflection`} cx="20" cy="18" r="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--logo-flame-core)" stopOpacity="0.8" />
          <stop offset="0.4" stopColor="var(--logo-wax-light)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--logo-wax-light)" stopOpacity="0" />
        </radialGradient>
        <path id={`${id}-mark`} d="M18.35 18.2Q20 14.8 21.65 18.2L33 43.5Q33.5 44.7 32.1 44.7H26.7Q25.8 44.7 25.5 43.8L20 30 14.5 43.8Q14.2 44.7 13.3 44.7H7.9Q6.5 44.7 7 43.5Z" />
      </defs>

      <g className={styles.light}>
        <g className={styles.halo}>
          <ellipse cx="20" cy="11" rx="25" ry="23" fill={`url(#${id}-glow)`} />
          <ellipse cx="20" cy="13" rx="10" ry="13" fill={`url(#${id}-glow)`} />
        </g>
      </g>
      <use href={`#${id}-mark`} transform="translate(1.5 1.7)" fill={`url(#${id}-edge)`} />
      <use href={`#${id}-mark`} fill={`url(#${id}-wax)`} />
      <use href={`#${id}-mark`} fill={`url(#${id}-reflection)`} className={styles.reflection} />
      <path d="M8.3 42.8 19.2 18.6Q20 17 20.8 18.6" stroke="var(--logo-wax-light)" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
      <path d="m20 30 5.5 13.8q.3.9 1.2.9" stroke="var(--logo-wax-shadow)" strokeWidth="0.65" strokeLinecap="round" opacity="0.45" />
      <path d="M18.1 19.7q1.1 1.4 2 .4c.6-.7 1.6-.1 1.6 1v3.4c0 1.7 2.1 1.7 2.1 0v-1.8" fill="var(--logo-wax-light)" opacity="0.8" />
      <path d="m20 18-.25-3" stroke="var(--logo-wick)" strokeWidth="1.2" strokeLinecap="round" />
      <g className={styles.light}>
        <g className={styles.ignition}>
          <motion.g className={styles.wind} style={{ transform: reducedMotion ? "none" : lean }}>
            <g className={styles.flame}>
              <path d="M20 1c1.8 5.8 6 8.3 4.5 12.9-.9 3.3-6 4.5-8.4.8C13.8 11.2 18.3 8.1 20 1Z" fill={`url(#${id}-flame)`} />
              <path d="M20.1 5.4c.8 3.8 3.3 5.4 2.7 8.3-.5 2.5-4.1 3.4-5.2.6-1-2.5 1.9-5.3 2.5-8.9Z" fill="var(--logo-wax-light)" />
              <g className={styles.core}>
                <path d="M20 10.2c.3 1.7 1.5 3 1.4 4.4a1.5 1.5 0 0 1-3-.1c0-1.4 1.3-2.5 1.6-4.3Z" fill="var(--logo-flame-core)" />
              </g>
            </g>
          </motion.g>
        </g>
        <ellipse cx="19.9" cy="16.2" rx="1" ry="0.6" fill="var(--logo-flame)" />
      </g>
    </svg>
  );
}

export default Logo;
