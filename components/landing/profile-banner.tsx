"use client";

import {
  profileBannerConfig,
  profileBannerStickers,
} from "@/config/profile-banner";
import { siteConfig } from "@/config/site";
import { motion, useReducedMotion } from "motion/react";
import { InteractiveSticker } from "./interactive-sticker";
import styles from "./profile-banner.module.css";

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
