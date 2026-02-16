"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { PropsWithChildren, useRef } from "react";

type ParallaxSectionProps = PropsWithChildren<{
  className?: string;
  offset?: number;
}>;

export function ParallaxSection({
  children,
  className,
  offset = 24,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.section ref={ref} style={{ y }} className={className}>
      {children}
    </motion.section>
  );
}
