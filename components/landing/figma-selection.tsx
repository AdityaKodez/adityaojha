"use client";

import { MOTION_EASE } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const HANDLES = [
  "-left-[3px] -top-[3px]",
  "-right-[3px] -top-[3px]",
  "-bottom-[3px] -left-[3px]",
  "-bottom-[3px] -right-[3px]",
];

export function FigmaSelection({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[3px] bg-primary/5 ring-1 ring-primary shadow-[0_0_12px_-4px_var(--primary)]"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.32, ease: MOTION_EASE }}
      >
        {label ? (
          <motion.span
            className="absolute -top-[13px] left-0 rounded-[3px] bg-primary px-1.5 py-0.5 font-mono text-[9px] font-medium leading-none text-primary-foreground"
            initial={reduceMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.5, ease: MOTION_EASE }}
          >
            {label}
          </motion.span>
        ) : null}
        {HANDLES.map((position, index) => (
          <motion.span
            key={position}
            className={`absolute size-[5px] bg-background ring-1 ring-primary ${position}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 520,
              damping: 28,
              delay: 0.42 + index * 0.04,
            }}
          />
        ))}
      </motion.span>
    </span>
  );
}
