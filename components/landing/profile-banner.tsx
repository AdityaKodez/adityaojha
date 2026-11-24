"use client";

import { profileBannerConfig } from "@/config/profile-banner";
import { HeroFluidDither } from "./hero-fluid-dither";
import styles from "./profile-banner.module.css";

export function ProfileBanner() {
  return (
    <div className="relative">
      <div
        className={styles.waveStage}
        role="img"
        aria-label={profileBannerConfig.label}
      >
        <HeroFluidDither className={styles.waveCanvas} />
      </div>
    </div>
  );
}
