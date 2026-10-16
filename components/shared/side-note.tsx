import { Caveat } from "next/font/google";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import styles from "./side-note.module.css";

const handwriting = Caveat({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export interface SideNoteProps extends ComponentProps<"aside"> {
  side?: "left" | "right";
}

export function SideNote({
  children,
  side = "right",
  className,
  ...props
}: SideNoteProps) {
  return (
    <aside
      {...props}
      data-side={side}
      className={cn(handwriting.className, styles.note, className)}
    >
      <span className={styles.text}>{children}</span>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 72 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.arrow}
      >
        <path d="M12 4C8 22 24 41 59 38M50 30C53 34 57 37 61 38C57 40 53 42 49 46" />
      </svg>
    </aside>
  );
}
