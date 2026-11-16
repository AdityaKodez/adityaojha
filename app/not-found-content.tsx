"use client";

import Link from "next/link";
import { Fragment } from "react";
import { motion, useMotionValue, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { notFoundConfig } from "@/config/not-found";
import { FoxDrawing } from "./not-found-illustrations";
import { NOT_FOUND_EASE, notFoundTiming } from "./not-found-timing";
import styles from "./not-found.module.css";

const headingWords = notFoundConfig.heading.split(" ");

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      y: { type: "spring", stiffness: 420, damping: 30 },
      opacity: { duration: 0.3, ease: NOT_FOUND_EASE },
    },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function NotFoundContent({
  onHomePointerChange,
  onHomeFocusChange,
}: {
  onHomePointerChange: (active: boolean) => void;
  onHomeFocusChange: (active: boolean) => void;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const sleepingFox = useMotionValue(0);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0 }
        : { delayChildren: notFoundTiming.text, staggerChildren: 0.12 },
    },
  };

  const headingVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.07 },
    },
  };

  const children = reduceMotion ? reducedItemVariants : itemVariants;

  return (
    <motion.div
      className={styles.content}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p data-reveal="" variants={children} className={`${styles.label} no-js-visible`}>
        {notFoundConfig.code}<span aria-hidden="true"> · </span>{notFoundConfig.label}
      </motion.p>
      <motion.h1 variants={headingVariants} className={styles.heading} aria-label={notFoundConfig.heading}>
        {headingWords.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <motion.span
              data-reveal=""
              aria-hidden="true"
              variants={children}
              className={`${styles.word} no-js-visible`}
            >
              {word}
            </motion.span>
          </Fragment>
        ))}
      </motion.h1>
      <motion.p data-reveal="" variants={children} className={`${styles.description} no-js-visible`}>
        {notFoundConfig.description}
      </motion.p>
      <motion.div data-reveal="" variants={children} className={`${styles.action} no-js-visible`}>
        <Button asChild variant="secondary" className={styles.homeButton}>
          <Link
            href={notFoundConfig.home.href}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onHomePointerChange(true);
            }}
            onPointerLeave={() => onHomePointerChange(false)}
            onPointerDown={() => onHomePointerChange(true)}
            onPointerUp={() => onHomePointerChange(false)}
            onPointerCancel={() => onHomePointerChange(false)}
            onFocus={() => onHomeFocusChange(true)}
            onBlur={() => onHomeFocusChange(false)}
          >
            <span aria-hidden="true" className={styles.buttonFox}>
              <FoxDrawing reaction={sleepingFox} perched />
            </span>
            {notFoundConfig.home.label}
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
