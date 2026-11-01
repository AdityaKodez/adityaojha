import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Logo({ size = 20, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="8 6 16 20"
      width={size}
      height={size}
      fill="none"
      className={cn("shrink-0 overflow-visible", className)}
      {...props}
    >
      <path
        d="M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z"
        className="fill-foreground stroke-foreground"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo;
