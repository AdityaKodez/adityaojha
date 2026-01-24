type Typescript01Props = {
  size: string;
};

const Typescript01 = ({ size }: Typescript01Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      color="currentColor"
    >
      <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
      <path d="M18 12h-1.8a1.2 1.2 0 0 0-1.2 1.2v.6a1.2 1.2 0 0 0 1.2 1.2h.6a1.2 1.2 0 0 1 1.2 1.2v.6a1.2 1.2 0 0 1-1.2 1.2H15m-6.5-6h2m2 0h-2m0 0v6" />
    </g>
  </svg>
);

export default Typescript01;
