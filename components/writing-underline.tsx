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
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay,
            ease: "easeInOut",
          }}
        />
      </svg>
    </span>
  );
}
