import type { ProfileBannerSticker } from "@/config/types";

export const profileBannerConfig = {
  label: "A few things from my desk",
  profileLabel: "Animate my profile sticker",
  profileSoundSrc: "/profile-pop.mp3",
};

export const profileBannerStickers: ProfileBannerSticker[] = [
  {
    id: "notebook",
    src: "/images/profile-stickers/notebook.webp",
    alt: "A paper-cut notebook and pencil with a yellow page tab",
    label: "Animate the notebook sticker",
    tilt: -7,
    order: 1,
    soundSrc: "/notebook-page-turn.mp3",
  },
  {
    id: "keyboard",
    src: "/images/profile-stickers/keyboard.webp",
    alt: "A halftone mechanical keyboard with blue keys",
    label: "Animate the keyboard sticker",
    tilt: 4,
    order: 2,
    soundSrc: "/keyboard-click.mp3",
  },
  {
    id: "plane",
    src: "/images/profile-stickers/plane.webp",
    alt: "A cobalt-blue paper plane",
    label: "Animate the paper plane sticker",
    tilt: -9,
    order: 3,
    soundSrc: "/plane-whoosh.mp3",
  },
  {
    id: "coffee",
    src: "/images/profile-stickers/coffee.webp",
    alt: "A halftone coffee cup with a yellow rim",
    label: "Animate the coffee sticker",
    tilt: 7,
    order: 4,
    soundSrc: "/coffee-cup.mp3",
  },
];
