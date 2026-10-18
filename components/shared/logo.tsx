"use client";

import { motion, type Variants } from "motion/react";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

const markVariants: Variants = {
  rest: { opacity: 1, transition: { duration: 0.12 } },
  hover: {
    opacity: [0, 0, 1],
    transition: { duration: 0.7, times: [0, 0.75, 1], ease: "linear" },
  },
};

const strokeVariants: Variants = {
  rest: { pathLength: 0, opacity: 0, transition: { duration: 0.12 } },
  hover: {
    pathLength: [0, 1, 1],
    opacity: [1, 1, 0],
    transition: {
      pathLength: { duration: 0.7, times: [0, 0.8, 1], ease: "linear" },
      opacity: { duration: 0.7, times: [0, 0.8, 1], ease: "linear" },
    },
  },
};

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Logo({ size = 20, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={cn("shrink-0 overflow-visible", className)}
      {...props}
    >
      <rect
        width="32"
        height="32"
        rx="10"
        className="fill-foreground transition-colors"
      />
      <motion.path
        d="M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z"
        variants={markVariants}
        className="fill-background stroke-background transition-colors"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <motion.path
        d="M11.5 23 L16 10.5 L20.5 23"
        pathLength={0}
        variants={strokeVariants}
        className="stroke-background"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo;
