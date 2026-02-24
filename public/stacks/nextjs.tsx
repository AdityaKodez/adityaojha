import { SVGProps } from "react";

interface BrandNextjsProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const BrandNextjs = ({ size = 24, ...props }: BrandNextjsProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 15V9l7.745 10.65A9 9 0 1 1 19 17.657M15 12V9"
    />
  </svg>
);

export default BrandNextjs;
