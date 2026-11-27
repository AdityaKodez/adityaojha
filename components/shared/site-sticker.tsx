import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const STICKER_DIMENSIONS = {
  "sun-burst": { width: 256, height: 256 },
  "solid-star": { width: 256, height: 256 },
  starfish: { width: 256, height: 256 },
  "lightning-bolt": { width: 256, height: 256 },
  "flower-red": { width: 256, height: 256 },
  "six-star": { width: 256, height: 256 },
  "pink-dino": { width: 256, height: 256 },
  "flower-yellow": { width: 256, height: 256 },
  "red-crab": { width: 256, height: 256 },
  spiral: { width: 256, height: 256 },
  asterisk: { width: 256, height: 256 },
  "star-outline": { width: 256, height: 256 },
  earth: { width: 256, height: 256 },
  "peace-hand": { width: 289, height: 301 },
  coffee: { width: 464, height: 464 },
  "app-badge": { width: 505, height: 246 },
} as const;

export type SiteStickerName = keyof typeof STICKER_DIMENSIONS;

export interface SiteStickerProps {
  name: SiteStickerName;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  loading?: "eager" | "lazy";
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}

export function SiteSticker({
  name,
  size,
  width,
  height,
  loading = "lazy",
  className,
  style,
  "aria-hidden": ariaHidden = true,
}: SiteStickerProps) {
  const dimensions = STICKER_DIMENSIONS[name];
  const resolvedWidth = width ?? size ?? dimensions.width;
  const resolvedHeight = height ?? size ?? dimensions.height;
  const attrWidth =
    typeof resolvedWidth === "number" && Number.isInteger(resolvedWidth)
      ? resolvedWidth
      : dimensions.width;
  const attrHeight =
    typeof resolvedHeight === "number" && Number.isInteger(resolvedHeight)
      ? resolvedHeight
      : dimensions.height;

  return (
    <Image
      alt=""
      src={`/images/stickers/${name}.svg`}
      width={attrWidth}
      height={attrHeight}
      loading={loading}
      decoding="async"
      draggable={false}
      unoptimized
      aria-hidden={ariaHidden}
      className={cn("inline-block select-none object-contain", className)}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        ...style,
      }}
    />
  );
}

export function PeaceHandSticker({
  loading = "eager",
  ...props
}: Omit<SiteStickerProps, "name">) {
  return <SiteSticker name="peace-hand" loading={loading} {...props} />;
}
