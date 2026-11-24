import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
import { PortfolioSticker, type NavigationStickerName } from "@/components/shared/portfolio-sticker";
import type { SiteNavigationItem } from "@/config/types";
import { cn } from "@/lib/utils";

interface ComponentIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export interface PaperCutIconProps extends ComponentIconProps {
  silhouette: string;
  accent?: string;
  tilt?: number;
  children: ReactNode;
}

export function PaperCutIcon({
  size = 64,
  color = "currentColor",
  accent = "var(--primary)",
  silhouette,
  tilt = -7,
  children,
  style,
  className,
  ...props
}: PaperCutIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      color={color}
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "[--cutout-paper:var(--background)] dark:[--cutout-paper:var(--foreground)] dark:[--cutout-ink:var(--background)]",
        className,
      )}
      style={{
        "--cutout-accent": accent,
        "--cutout-wash": `color-mix(in oklch, ${accent} 18%, var(--cutout-paper))`,
        ...style,
      } as CSSProperties}
      {...props}
    >
      <g transform={`rotate(${tilt} 32 32)`} color="var(--cutout-ink, currentColor)" stroke="currentColor">
        <path
          d={silhouette}
          transform="translate(1 2)"
          fill="var(--foreground)"
          stroke="var(--foreground)"
          strokeWidth="10"
          opacity="0.1"
        />
        <path d={silhouette} fill="var(--cutout-paper)" stroke="var(--cutout-paper)" strokeWidth="9" />
        <path d={silhouette} fill="var(--cutout-wash)" />
        {children}
      </g>
    </svg>
  );
}

export function PrintDots({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="currentColor" stroke="none" opacity="0.35">
      <circle r="0.8" />
      <circle cx="4" r="0.8" />
      <circle cx="8" r="0.8" />
      <circle cx="2" cy="3.5" r="0.8" />
      <circle cx="6" cy="3.5" r="0.8" />
      <circle cy="7" r="0.8" />
      <circle cx="4" cy="7" r="0.8" />
      <circle cx="8" cy="7" r="0.8" />
    </g>
  );
}

function createNavigationIcon(name: NavigationStickerName) {
  return function NavigationIcon({ className }: ComponentIconProps) {
    return <PortfolioSticker name={name} className={className} />;
  };
}
const navigationIcons: Record<SiteNavigationItem["icon"], ComponentType<ComponentIconProps>> = {
  home: createNavigationIcon("nav-home"),
  stack: createNavigationIcon("nav-components"),
  testimonial: createNavigationIcon("nav-testimonials"),
  sparkles: createNavigationIcon("nav-sponsor"),
};

export function getNavigationIcon(name: SiteNavigationItem["icon"]) {
  return navigationIcons[name];
}
