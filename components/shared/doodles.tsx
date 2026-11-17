import { Caveat } from "next/font/google";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import styles from "./doodles.module.css";

export const handwriting = Caveat({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

type DoodleProps = SVGProps<SVGSVGElement>;

function Doodle({
  paths,
  viewBox,
  className,
  ...props
}: DoodleProps & { paths: string[] }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(styles.doodle, className)}
      {...props}
    >
      {paths.map((d) => (
        <path key={d} d={d} pathLength={1} />
      ))}
    </svg>
  );
}

export function FolderDoodle(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 32 28"
      paths={[
        "M3.2 8.6c-.1-1.7.9-2.7 2.5-2.8l6.3-.1 2.7 3.1 11.7-.2c1.8 0 2.9 1.1 2.8 2.8l-.2 10.4c0 1.7-1.1 2.7-2.8 2.7l-20.4.3c-1.8 0-2.7-1-2.7-2.7Z",
        "M3.6 12.1c7.8-.9 16.6-.7 25.2.1",
        "M8.4 16.8c2.9-.5 6-.4 8.7 0M8.6 20.2c1.9-.3 3.9-.2 5.6.1",
      ]}
      {...props}
    />
  );
}

export function ArrowDoodle(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 24 24"
      paths={[
        "M5.2 18.9c2.9-3.6 7.3-8.6 12.9-13.4",
        "M10.8 5.3c2.5-.3 5.3-.5 7.9-.3.3 2.7.1 5.5-.4 8.3",
      ]}
      {...props}
    />
  );
}

export function CodeDoodle(props: DoodleProps) {
  return (
    <Doodle
      viewBox="0 0 24 24"
      paths={[
        "M8.6 6.8 3.9 12.3l4.8 5.1",
        "M15.4 6.6l4.7 5.6-4.9 5.2",
        "M13.5 5.2 10.4 19",
      ]}
      {...props}
    />
  );
}
