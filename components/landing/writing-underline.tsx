"use client";

import { motion } from "motion/react";

interface WritingUnderlineProps {
  children: React.ReactNode;
  delay?: number;
}

export function WritingUnderline({
  children,
  delay = 0.5,
}: WritingUnderlineProps) {
  return (
    <span className="relative inline-block group">
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full h-[6px]"
        viewBox="0 0 200 6"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 3 C 20 1, 180 5, 200 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          className="no-js-visible"
          viewport={{ once: true }}
          transition={{
            duration: 0.35,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>
    </span>
  );
}
