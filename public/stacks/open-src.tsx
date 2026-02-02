type Props = {
  size?: string;
  className?: string;
};

const OpenSrc = ({ size = "24", className }: Props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    id="Open-Source-Fill--Streamline-Remix-Fill"
  >
    <desc>
      {"\n    Open Source Fill Streamline Icon: https://streamlinehq.com\n  "}
    </desc>
    <path
      d="M12.001 2c5.5228 0 10 4.47715 10 10 0 4.1302 -2.504 7.6757 -6.0767 9.201l-2.5185 -6.5496c0.949 -0.5038 1.5952 -1.5021 1.5952 -2.6514 0 -1.6569 -1.3432 -3 -3 -3 -1.6569 0 -3.00002 1.3431 -3.00002 3 0 1.1497 0.64668 2.1483 1.59612 2.6519l-2.51847 6.5495C4.5054 19.6763 2.00098 16.1306 2.00098 12c0 -5.52285 4.47715 -10 10.00002 -10Z"
      strokeWidth={1}
    />
  </svg>
);

export default OpenSrc;
