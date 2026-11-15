import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import styles from "./logo.module.css";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

// The same ordered 4 by 4 Bayer pattern and blue palette as the footer Earth.
const DITHER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const PALETTE = ["deep", "ocean", "light", "cloud"] as const;

function insideMark(x: number, y: number) {
  const distance = Math.abs(x - 19);
  return y >= 5 && y < 33 && distance <= 1.5 + (y - 5) * 0.46 &&
    (y < 18 || distance >= (y - 18) * 0.47);
}

const pixelPaths = PALETTE.map(() => "");

for (let y = 0; y < 40; y++) {
  for (let x = 0; x < 40; x++) {
    const front = insideMark(x + 0.5, y + 0.5);
    const side = insideMark(x - 1.5, y - 1.5);
    if (!front && !side) continue;

    const threshold = (DITHER[(y % 4) * 4 + x % 4] + 0.5) / 16;
    const light = 1 - (x / 40 * 0.65 + y / 40 * 0.35);
    if (front && threshold > 0.84 + light * 0.14) continue;

    const shade = front
      ? Math.min(3, Math.floor(0.45 + light * 2.5 + threshold))
      : threshold > 0.8 ? 1 : 0;
    pixelPaths[shade] += `M${x} ${y}h1v1h-1z`;
  }
}

export function Logo({ size = 20, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", styles.logo, className)}
      {...props}
    >
      {PALETTE.map((shade, index) => (
        <path key={shade} d={pixelPaths[index]} fill={`rgb(var(--footer-earth-${shade}))`} />
      ))}
    </svg>
  );
}

export default Logo;
