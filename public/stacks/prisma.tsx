type PrismaProps = {
  size: string;
};

const Prisma = ({ size }: PrismaProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M4.003 15.728a1 1 0 0 1-.008-1.054l7.479-12.199a.996.996 0 0 1 1.753.104l6.832 14.82a.996.996 0 0 1-.618 1.37l-10.628 3.19a.996.996 0 0 1-1.127-.42zm8.334-9.686L9.707 19.14a.373.373 0 0 0 .472.431l7.343-2.192a.373.373 0 0 0 .236-.506L13.046 5.968a.373.373 0 0 0-.71.074"
    />
  </svg>
);

export default Prisma;
