import type { SVGProps } from "react";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Logo({ size = 20, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      {...props}
    >
      <rect
        width="32"
        height="32"
        rx="10"
        className="fill-foreground transition-colors"
      />
      <path
        d="M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z"
        className="fill-background stroke-background transition-colors"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo;
