import Image from "next/image";
import type { ComponentIcon } from "@/config/types";

export type NavigationStickerName = "nav-home" | "nav-components" | "nav-testimonials" | "nav-sponsor";

export type DiscordActivityStickerName =
  | "activity-music"
  | "activity-watching"
  | "activity-playing"
  | "activity-streaming"
  | "activity-coding"
  | "activity-competing"
  | "activity-generic";

type PortfolioStickerName =
  | ComponentIcon
  | "work-open"
  | "work-closed"
  | NavigationStickerName
  | DiscordActivityStickerName;

export function PortfolioSticker({
  name,
  size = 64,
  className,
}: {
  name: PortfolioStickerName;
  size?: number | string;
  className?: string;
}) {
  const dimension = typeof size === "number" && Number.isInteger(size) ? size : 64;

  return (
    <Image
      alt=""
      src={`/images/portfolio-stickers/${name}.svg`}
      width={dimension}
      height={dimension}
      className={className}
      draggable={false}
      unoptimized
    />
  );
}
