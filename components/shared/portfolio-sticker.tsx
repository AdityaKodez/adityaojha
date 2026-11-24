import Image from "next/image";
import type { ComponentIcon } from "@/config/types";

type PortfolioStickerName = ComponentIcon | "work-open" | "work-closed";

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
