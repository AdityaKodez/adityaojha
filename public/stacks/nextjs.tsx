type BrandNextjsProps = {
  size: string;
};

const BrandNextjs = ({ size }: BrandNextjsProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 15V9l7.745 10.65A9 9 0 1 1 19 17.657M15 12V9"
    />
  </svg>
);

export default BrandNextjs;
