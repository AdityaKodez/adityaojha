import { SVGProps } from "react";

interface BrandCursorProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const BrandCursor = ({ size = 24, ...props }: BrandCursorProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 22"
    fill="none"
    {...props}
  >
    <g fill="currentColor">
      <path d="M19.162 5.452 10.698.565a.88.88 0 0 0-.879 0L1.356 5.452a.74.74 0 0 0-.37.64v9.853a.74.74 0 0 0 .37.64l8.464 4.887a.879.879 0 0 0 .879 0l8.464-4.886a.74.74 0 0 0 .37-.64V6.091a.74.74 0 0 0-.37-.64Zm-.531 1.035L10.46 20.639c-.055.095-.201.056-.201-.055v-9.266a.52.52 0 0 0-.26-.45L1.975 6.237c-.096-.056-.057-.202.054-.202h16.34c.233 0 .378.252.262.453Z" />
    </g>
  </svg>
);

export default BrandCursor;
