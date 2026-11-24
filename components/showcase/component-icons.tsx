import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
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

function HomeIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-6} silhouette="M9 29 31 10 54 29 49 29 49 51 15 51 15 29Z">
      <path d="m9 29 22-19 23 19-6 2-17-14-16 14Z" fill="var(--cutout-accent)" />
      <path d="M27 51V35h10v16" fill="var(--cutout-paper)" />
      <path d="M41 32h4v7h-4Z" fill="currentColor" strokeWidth="1.5" />
      <PrintDots x={17} y={38} />
    </PaperCutIcon>
  );
}

function TestimonialIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" silhouette="M13 12 48 10Q54 11 53 18L51 41Q51 46 44 46H29L17 54 19 45H13Q8 45 9 38L10 18Q10 13 13 12Z">
      <path d="M20 22h9v9h-5q0 5-6 7M36 21h9v9h-5q0 5-6 7" fill="currentColor" strokeWidth="2" />
      <PrintDots x={35} y={37} />
    </PaperCutIcon>
  );
}

function GlyphCardIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={7} silhouette="M15 12 42 9Q46 9 48 14L55 39Q56 44 51 47L23 55Q18 56 16 51L8 24Q7 20 10 17Z">
      <path d="m15 12 7 29q1 3 5 2l28-7M22 43l1 12" />
      <path d="m22 33 3-16 12 12m-13-3 8-2" />
      <PrintDots x={34} y={42} />
    </PaperCutIcon>
  );
}

function SparklesIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={8} silhouette="M29 10 35 25 51 30 36 37 30 54 23 39 8 33 23 26Z">
      <path d="m29 10 1 23 21-3-15 7-6 17V33L8 33l15-7Z" fill="currentColor" strokeWidth="1.5" />
      <path d="m47 8 1 5 5 2-5 2-1 5-2-5-4-2 4-2Z" fill="var(--chart-1)" strokeWidth="2" />
      <path d="m12 47-2 3m34-3 3 3" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

const navigationIcons: Record<SiteNavigationItem["icon"], ComponentType<ComponentIconProps>> = {
  home: HomeIcon,
  stack: GlyphCardIcon,
  testimonial: TestimonialIcon,
  sparkles: SparklesIcon,
};

export function getNavigationIcon(name: SiteNavigationItem["icon"]) {
  return navigationIcons[name];
}
