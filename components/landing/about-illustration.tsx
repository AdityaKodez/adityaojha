import type { AboutItem } from "@/config/types";
import styles from "./about-illustration.module.css";

/** Small decorative objects that sit on the text baseline. */
export function AboutIllustration({
  kind,
}: {
  kind: AboutItem["illustration"];
}) {
  return (
    <svg
      viewBox="0 0 56 40"
      aria-hidden="true"
      focusable="false"
      className={`${styles.illustration} mx-0.5 inline-block h-8 w-11 align-[-0.55em] overflow-visible`}
      data-kind={kind}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "browser" && (
        <>
          <ellipse
            cx="28"
            cy="35"
            rx="20"
            ry="2.5"
            className={`${styles.shadow} fill-foreground/8`}
          />
          <g className={styles.object}>
            <g transform="rotate(-6 28 20)">
              <rect
                x="6"
                y="5"
                width="42"
                height="29"
                rx="5"
                className="fill-card stroke-border"
              />
              <path d="M6 14h42" className="stroke-border" />
              <circle cx="12" cy="9.5" r="1.3" className="fill-chart-1" />
              <circle
                cx="16.5"
                cy="9.5"
                r="1.3"
                className="fill-muted-foreground/40"
              />
              <circle cx="21" cy="9.5" r="1.3" className="fill-primary/45" />
              <rect
                x="11"
                y="18"
                width="10"
                height="11"
                rx="2"
                className="fill-primary/15"
              />
              <path
                d="M26 20h14M26 25h8"
                className="stroke-muted-foreground/45"
                strokeWidth="1.5"
              />
            </g>
            <g className={styles.badge}>
              <circle cx="46" cy="31" r="7" className="fill-primary" />
              <path
                d="m42.8 31 2.1 2.2 4.1-4.5"
                className="stroke-primary-foreground"
                strokeWidth="1.8"
              />
            </g>
          </g>
        </>
      )}
      {kind === "notebook" && (
        <>
          <ellipse
            cx="29"
            cy="35"
            rx="17"
            ry="2.5"
            className={`${styles.shadow} fill-foreground/8`}
          />
          <g className={styles.object}>
            <g transform="rotate(7 27 20)">
              <rect
                x="12"
                y="5"
                width="28"
                height="30"
                rx="4"
                className="fill-muted stroke-border"
              />
              <rect
                x="10"
                y="3"
                width="28"
                height="29"
                rx="4"
                className="fill-card stroke-border"
              />
              <path
                d="M16 3v29"
                className="stroke-primary/50"
                strokeWidth="2"
              />
              <path
                d="M21 11h11M21 16h9M21 21h11M21 26h6"
                className="stroke-muted-foreground/35"
                strokeWidth="1.3"
              />
              <path
                d="M12 10H8m4 7H8m4 7H8"
                className="stroke-muted-foreground/60"
                strokeWidth="1.8"
              />
            </g>
            <g className={styles.pencil}>
              <path
                d="M41 9a2 2 0 0 1 4 0v19h-4Z"
                className="fill-chart-1 stroke-chart-2/50"
              />
              <path
                d="m41 28 2 5 2-5"
                className="fill-card stroke-muted-foreground/60"
              />
              <path d="M41 12h4" className="stroke-card/80" />
            </g>
          </g>
        </>
      )}
      {kind === "plane" && (
        <>
          <path
            d="M4 29c11 12 25 1 12-3-6-2-7 7 4 6"
            className={`${styles.trail} stroke-muted-foreground/45`}
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
          <g className={styles.object}>
            <path
              d="m13 14 37-9-12 28-9-11Z"
              className="fill-card stroke-primary/60"
              strokeWidth="1.2"
            />
            <path d="M13 14 50 5 29 22Z" className="fill-primary/10" />
            <path
              d="m29 22-2 10 8-6"
              className="fill-primary/25 stroke-primary/60"
              strokeWidth="1.2"
            />
            <path
              d="M29 22 50 5"
              className="stroke-primary/60"
              strokeWidth="1.2"
            />
            <path d="m38 33-9-11L50 5Z" className="fill-primary/20" />
          </g>
        </>
      )}
    </svg>
  );
}
