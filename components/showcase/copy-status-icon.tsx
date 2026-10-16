"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Copy, X } from "@/components/shared/site-icons";
import type { CopyStatus } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Clipboard feedback for the icon-only copy buttons.
 *
 * The status change morphs instead of snapping: the outgoing glyph fades and
 * shrinks away while the incoming one pops in on a spring, and the check
 * draws itself on. Only transform, opacity, and the stroke path animate, so
 * the swap never touches layout. Reduced motion drops to an instant swap.
 */
export function CopyStatusIcon({
  status,
  className,
  idleIcon,
}: {
  status: CopyStatus;
  /** Extra classes for the glyph box. Size defaults to the shared icon size. */
  className?: string;
  /** Glyph shown while idle. Defaults to the copy icon. */
  idleIcon?: ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex size-3.5 shrink-0", className)}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          className={cn(
            "absolute inset-0 inline-flex items-center justify-center",
            status === "copied" && "text-green-500",
            status === "error" && "text-destructive",
          )}
          initial={
            reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5, rotate: -12 }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 25, mass: 0.6 }
          }
        >
          {status === "copied" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-full"
            >
              <motion.path
                d="M5 14L8.5 17.5L19 6.5"
                initial={{ pathLength: reducedMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.25, ease: EASE, delay: 0.05 }
                }
              />
            </svg>
          ) : status === "error" ? (
            <X className="size-full" />
          ) : idleIcon ? (
            idleIcon
          ) : (
            <Copy className="size-full" />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
