"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { PropsWithChildren, useRef } from "react";

type ParallaxSectionProps = PropsWithChildren<{
  className?: string;
  offset?: number;
  direction?: 1 | -1;
}>;

export function ParallaxSection({
  children,
  className,
  offset = 36,
  direction = 1,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yTarget = useTransform(
    scrollYProgress,
    [0, 1],
    [offset * direction, -offset * direction]
  );

  const y = useSpring(yTarget, {
    stiffness: 110,
    damping: 24,
    mass: 0.2,
  });

  return (
    <motion.section ref={ref} style={{ y }} className={className}>
      {children}
    </motion.section>
  );
}
