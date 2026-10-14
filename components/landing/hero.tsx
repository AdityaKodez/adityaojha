import Image from "next/image";
import { heroConfig } from "@/config/hero";
import { siteConfig } from "@/config/site";
import { ProfileBanner } from "./profile-banner/figure";
import { ProfileLocation } from "./profile-location";

export function Hero() {
  return (
    <section className="profile-hero">
      <ProfileBanner />
      <div className="profile-intro">
        <Image
          src={siteConfig.personal.avatar.src}
          alt={siteConfig.personal.fullName}
          width={80}
          height={80}
          priority
          className="profile-portrait"
        />
        <div className="profile-greeting-row">
          <p className="profile-greeting">{heroConfig.greeting}</p>
          <ProfileLocation />
        </div>
        <h1 className="profile-headline">
          {heroConfig.headlineBefore}{" "}
          <span className="text-primary">{heroConfig.highlightedPhrases[0]}</span>{" "}
          in {heroConfig.highlightedPhrases[1]} {heroConfig.headlineAfter}
        </h1>
        <p className="profile-description">{heroConfig.description}</p>
      </div>
    </section>
  );
}
