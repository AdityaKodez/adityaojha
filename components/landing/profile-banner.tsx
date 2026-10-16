"use client";

import {
  profileBannerConfig,
  profileBannerStickers,
} from "@/config/profile-banner";
import { siteConfig } from "@/config/site";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import styles from "./profile-banner.module.css";

const pointerSpring = { stiffness: 350, damping: 24, mass: 0.6 };
const gestureSpring = { type: "spring", duration: 0.35, bounce: 0.3 } as const;

function InteractiveSticker({
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
        className={`${styles.stickerButton} relative block size-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background`}
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

export function ProfileBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative px-6 pt-8 sm:pt-10">
      <div
        className={styles.composition}
        role="group"
        aria-label={profileBannerConfig.label}
      >
        {profileBannerStickers.map((sticker) => (
          <motion.div
            key={sticker.id}
            className={`no-js-visible ${styles.sticker} ${styles[sticker.id]}`}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 24, scale: 0.9, rotate: -sticker.tilt }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              duration: 0.6,
              bounce: 0.38,
              delay: reduceMotion ? 0 : (sticker.order - 1) * 0.1,
            }}
          >
            <InteractiveSticker
              {...sticker}
              sizes={
                sticker.id === "keyboard"
                  ? "(max-width: 640px) 60vw, 400px"
                  : "(max-width: 640px) 36vw, 240px"
              }
              preload={sticker.id === "keyboard"}
            />
          </motion.div>
        ))}
      </div>
      <div className={styles.profile}>
        <InteractiveSticker
          src={siteConfig.personal.avatar.src}
          alt={siteConfig.personal.avatar.alt}
          label={profileBannerConfig.profileLabel}
          tilt={-5}
          sizes="(max-width: 640px) 72px, 128px"
          soundSrc={profileBannerConfig.profileSoundSrc}
        />
      </div>
    </div>
  );
}
