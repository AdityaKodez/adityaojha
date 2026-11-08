"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";

const pointerSpring = { stiffness: 350, damping: 24, mass: 0.6 };
const gestureSpring = { type: "spring", duration: 0.35, bounce: 0.3 } as const;

export function InteractiveSticker({
  src,
  alt,
  label,
  tilt,
  sizes,
  soundSrc,
  preload = false,
}: {
  src: string;
  alt: string;
  label: string;
  tilt: number;
  sizes: string;
  soundSrc?: string;
  preload?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const x = useSpring(0, pointerSpring);
  const y = useSpring(0, pointerSpring);
  const rotateX = useTransform(y, [-14, 14], [7, -7]);
  const rotateY = useTransform(x, [-8, 8], [-8, 8]);

  const resetPointer = () => {
    x.set(0);
    y.set(0);
    bounds.current = null;
  };

  const playSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const followPointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !bounds.current) return;

    const rect = bounds.current;
    const horizontal = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
    );
    const vertical = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
    );
    x.set(horizontal * 6);
    y.set(vertical * 5 - 7);
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label={label}
        className="relative block size-full touch-pan-y rounded-lg outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        initial={false}
        style={reduceMotion ? undefined : { x, y, rotateX, rotateY }}
        whileHover={reduceMotion ? { opacity: 0.8 } : { scale: 1.075, rotate: tilt }}
        whileTap={
          reduceMotion
            ? { opacity: 0.65 }
            : { scale: 0.94, rotate: -tilt * 0.6 }
        }
        transition={gestureSpring}
        onClick={soundSrc ? playSound : undefined}
        onPointerEnter={(event) => {
          bounds.current =
            event.currentTarget.parentElement?.getBoundingClientRect() ?? null;
        }}
        onPointerMove={followPointer}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
        onBlur={resetPointer}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="pointer-events-none select-none object-contain"
          draggable={false}
          preload={preload}
          loading={preload ? undefined : "eager"}
        />
      </motion.button>
      {soundSrc ? (
        <audio ref={audioRef} src={soundSrc} preload="auto" />
      ) : null}
    </>
  );
}
