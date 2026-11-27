import type {
  FooterConfig,
  PersonalInfo,
  PortfolioConfig,
  TrazoColophonConfig,
} from "@/config/types";

export const siteUrl = "https://akoder.xyz";

export const personalClientConfig: PersonalInfo = {
  fullName: "Aditya Ojha",
  firstName: "Aditya",
  avatar: {
    src: "/images/profile-mascot-sticker.webp",
    alt: "Paper-cut sticker of Aditya's spiky-haired avatar",
    fallback: "AK",
  },
  location: {
    label: "New Delhi, India",
    timeZone: "Asia/Kolkata",
  },
  githubUsername: "AdityaKodez",
};

export const bannerClientConfig: PortfolioConfig["banner"] = {
  imageSrc: "/images/profile-banner-cutout.webp",
  imageAlt: "Paper cutouts of a keyboard, notebook, paper plane, and coffee cup",
  openSourceUrl: "https://github.com/AdityaKodez/adityaojha",
  openSourceTooltip: "This project is open source!",
  themeToggleLabel: "Toggle theme",
  themeShortcut: "D",
  themeTooltip: "Toggle theme",
  switchAudioSrc: "/switch.mp3",
};

export const footerClientConfig: FooterConfig = {
  quote: "The soul becomes dyed with the color of its thoughts.",
  attribution: "Marcus Aurelius",
  credit: "Made with <3 and lots of coffee.",
  artwork: {
    src: "/images/footer-garden-strip.webp",
    width: 1264,
    height: 600,
  },
};

export const trazoColophonConfig: TrazoColophonConfig = {
  label: "Explore the Trazo sticker library",
  ctaLabel: "Explore Trazo",
  href: "https://trazo.akoder.xyz/library?utm_source=akoder.xyz&utm_medium=referral&utm_campaign=portfolio_stickers&utm_content=site_colophon",
};
