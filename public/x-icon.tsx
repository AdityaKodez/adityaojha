import { SVGProps } from "react";

interface XProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const X = ({ size = 24, color = "currentColor", ...props }: XProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 21l7.5-7.5m3-3L21 3M8 3H3l13 18h5Z" />
  </svg>
);

export default X;
