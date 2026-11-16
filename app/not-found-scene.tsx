"use client";

import { Caveat } from "next/font/google";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { notFoundConfig } from "@/config/not-found";
import {
  FoxDrawing,
  GrassDrawing,
  HikerDrawing,
  MoleDrawing,
  PineDrawing,
  QuestionDrawing,
  SnailDrawing,
} from "./not-found-illustrations";
import { NOT_FOUND_EASE, notFoundTiming } from "./not-found-timing";
import styles from "./not-found-scene.module.css";

const handwriting = Caveat({ subsets: ["latin"], weight: "400", display: "swap" });

const doodleVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      default: { type: "spring", stiffness: 360, damping: 28 },
      opacity: { duration: 0.35, ease: NOT_FOUND_EASE },
    },
  },
};

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: NOT_FOUND_EASE },
  },
};

const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

const subscribeHydration = () => () => {};
const isVisible = () => !document.hidden;
const isHydrated = () => true;
const serverHydrated = () => false;

// Each finite timeline ignores repeated pokes until it settles, and stops
// when the scene is hidden, reduced motion changes, or it unmounts.
function useReaction(duration: number, reducedMotion: boolean, enabled: boolean) {
  const progress = useMotionValue(0);
  const playback = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!enabled) progress.set(0);
    return () => {
      const previous = playback.current;
      playback.current = null;
      previous?.stop();
      progress.set(0);
    };
  }, [enabled, progress]);

  const play = () => {
    if (reducedMotion) {
      progress.set(progress.get() === 0.3 ? 0 : 0.3);
      return;
    }
    if (!enabled || playback.current) return;

    progress.set(0);
    const controls = animate(progress, 1, { duration, ease: "linear" });
    playback.current = controls;
    controls.then(() => {
      if (playback.current === controls) playback.current = null;
    });
  };

  return { progress, play };
}

export function NotFoundScene({ homeActive }: { homeActive: boolean }) {
  const reduceMotion = useReducedMotion() ?? false;
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef);
  const visible = useSyncExternalStore(subscribeVisibility, isVisible, isHydrated);
  const hydrated = useSyncExternalStore(subscribeHydration, isHydrated, serverHydrated);
  const motionEnabled = !reduceMotion && visible && inView;
  const lookX = useSpring(0, { stiffness: 160, damping: 25 });
  const lookY = useSpring(0, { stiffness: 160, damping: 25 });
  const hiker = useReaction(notFoundTiming.hiker, reduceMotion, motionEnabled && !homeActive);
  const snail = useReaction(notFoundTiming.snail, reduceMotion, motionEnabled);
  const mole = useReaction(notFoundTiming.mole, reduceMotion, motionEnabled && !homeActive);
  const fox = useReaction(notFoundTiming.fox, reduceMotion, motionEnabled);
  const sleepOpacity = useTransform(fox.progress, [0, 0.08, 0.85, 1], [1, 0, 0, 1]);
  const doodle = reduceMotion ? staticVariants : doodleVariants;
  const note = reduceMotion ? staticVariants : noteVariants;

  useEffect(() => {
    if (!motionEnabled) {
      lookX.jump(0);
      lookY.jump(0);
      return;
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reset = () => {
      lookX.set(0);
      lookY.set(0);
    };
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      lookX.set((event.clientX / window.innerWidth - 0.5) * 2);
      lookY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", follow, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", follow);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      lookX.jump(0);
      lookY.jump(0);
    };
  }, [motionEnabled, lookX, lookY]);

  const sceneVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion ? {} : { delayChildren: 0.05, staggerChildren: 0.08 },
    },
  };

  const reveal = (className: string, variants = doodle) => ({
    "data-reveal": "",
    variants,
    className: `${className} no-js-visible`,
  });

  return (
    <motion.div
      ref={sceneRef}
      className={styles.scene}
      data-scene-motion={motionEnabled ? "active" : "paused"}
      data-found={homeActive}
      variants={sceneVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div {...reveal(styles.traveller)}>
        <button
          type="button"
          className={styles.characterButton}
          aria-label={notFoundConfig.interactions.hiker}
          disabled={!hydrated}
          onClick={hiker.play}
        >
          <div className={styles.travellerLayer}>
            <HikerDrawing reaction={hiker.progress} lookX={lookX} lookY={lookY} found={homeActive} reducedMotion={reduceMotion} />
          </div>
          <div className={styles.question}>
            <QuestionDrawing reaction={hiker.progress} found={homeActive} reducedMotion={reduceMotion} />
          </div>
        </button>
      </motion.div>
      <motion.div aria-hidden="true" {...reveal(`${styles.doodle} ${styles.grassTop}`)}>
        <GrassDrawing />
      </motion.div>
      <motion.div {...reveal(`${styles.doodle} ${styles.snail}`)}>
        <button
          type="button"
          className={styles.characterButton}
          aria-label={notFoundConfig.interactions.snail}
          disabled={!hydrated}
          onPointerEnter={(event) => { if (event.pointerType === "mouse" && !reduceMotion) snail.play(); }}
          onClick={snail.play}
        >
          <SnailDrawing reaction={snail.progress} lookX={lookX} lookY={lookY} />
        </button>
      </motion.div>
      <motion.div aria-hidden="true" {...reveal(`${styles.doodle} ${styles.tree}`)}>
        <PineDrawing />
      </motion.div>
      <div className={styles.moleGroup}>
        <motion.div {...reveal(`${styles.doodle} ${styles.mole}`)}>
          <button
            type="button"
            className={styles.characterButton}
            aria-label={notFoundConfig.interactions.mole}
            disabled={!hydrated}
            onPointerEnter={(event) => { if (event.pointerType === "mouse" && !reduceMotion) mole.play(); }}
            onClick={mole.play}
          >
            <MoleDrawing reaction={mole.progress} found={homeActive} reducedMotion={reduceMotion} />
          </button>
        </motion.div>
        <motion.div aria-hidden="true" {...reveal(`${styles.annotation} ${handwriting.className}`, note)}>
          <span>{homeActive ? notFoundConfig.foundNote : notFoundConfig.moleNote}</span>
          <svg viewBox="0 0 50 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              initial={false}
              animate={{ d: homeActive ? "M8 3C4 20 28 31 43 12M31 14L43 12L40 25" : "M8 3C6 19 17 31 35 37M25 36L37 38L34 27" }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: NOT_FOUND_EASE }}
            />
          </svg>
        </motion.div>
      </div>
      <motion.div aria-hidden="true" {...reveal(`${styles.doodle} ${styles.grassBottom}`)}>
        <GrassDrawing />
      </motion.div>
      <div className={styles.foxGroup}>
        <motion.div {...reveal(`${styles.doodle} ${styles.fox}`)}>
          <button
            type="button"
            className={styles.characterButton}
            aria-label={notFoundConfig.interactions.fox}
            disabled={!hydrated}
            onClick={fox.play}
          >
            <FoxDrawing reaction={fox.progress} />
          </button>
        </motion.div>
        <motion.div aria-hidden="true" {...reveal(styles.sleepWrap, note)}>
          <motion.div style={{ opacity: sleepOpacity }}>
            <span className={`${styles.sleep} ${handwriting.className}`}>{notFoundConfig.foxNote}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
