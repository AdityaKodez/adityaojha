import Image from "next/image";
import type { ComponentIcon } from "@/config/types";

export type NavigationStickerName = "nav-home" | "nav-components" | "nav-testimonials" | "nav-sponsor";

type PortfolioStickerName = ComponentIcon | "work-open" | "work-closed" | NavigationStickerName;

export function PortfolioSticker({
  name,
  className,
}: {
  name: PortfolioStickerName;
  className?: string;
}) {
  return (
    <Image
      alt=""
      src={`/images/portfolio-stickers/${name}.svg`}
      width={64}
      height={64}
      className={className}
      draggable={false}
      unoptimized
    />
  );
}
