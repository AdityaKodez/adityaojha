type FileTypeLightShadcnProps = {
  size: string;
};

const FileTypeLightShadcn = ({ size }: FileTypeLightShadcnProps) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="4.48"
      d="m27.76 16.56l-11.2 11.2m8.96-23.52L4.24 25.52"
    />
  </svg>
);

export default FileTypeLightShadcn;
