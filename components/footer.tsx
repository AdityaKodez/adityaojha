import { socialsConfig } from "@/config/socials";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const footerLinks = socialsConfig.filter(
  (social) =>
    social.enabled !== false &&
    social.href &&
    ["x", "github", "peerlist", "email"].includes(social.id),
);

/**
 * Wireframe skyline: clusters of overlapping outlined blocks, like the
 * reference. Values are percentages of the skyline canvas (x from left,
 * w = width, h = height from the baseline).
 */
const skyline: { x: number; w: number; h: number }[] = [
  // cluster 1
  { x: 1, w: 7, h: 62 },
  { x: 4, w: 8, h: 88 },
  { x: 9, w: 4, h: 70 },
  // cluster 2
  { x: 16, w: 3, h: 92 },
  { x: 17.5, w: 8, h: 55 },
  { x: 22, w: 5, h: 38 },
  // cluster 3
  { x: 30, w: 9, h: 58 },
  { x: 34, w: 6, h: 40 },
  // cluster 4
  { x: 43, w: 9, h: 55 },
  { x: 45.5, w: 7, h: 38 },
  // cluster 5
  { x: 56, w: 4, h: 92 },
  { x: 58, w: 7, h: 58 },
  { x: 61, w: 5, h: 38 },
  // cluster 6
  { x: 69, w: 7, h: 90 },
  { x: 71.5, w: 7, h: 72 },
  { x: 75.5, w: 3, h: 50 },
  // cluster 7
  { x: 83, w: 7, h: 55 },
  { x: 86.5, w: 5, h: 38 },
  // cluster 8
  { x: 93.5, w: 4, h: 60 },
  { x: 95.5, w: 3.5, h: 82 },
];

export function Footer() {
  return (
    <footer className="relative mt-4 overflow-hidden bg-background">
      {/* Wireframe skyline */}
      <div
        aria-hidden="true"
        className="relative mx-auto h-64 w-full max-w-6xl md:h-80"
      >
        {skyline.map((block, index) => (
          <div
            key={`${block.x}-${index}`}
            className="absolute bottom-0 border border-b-0 border-border/60"
            style={{
              left: `${block.x}%`,
              width: `${block.w}%`,
              height: `${block.h}%`,
            }}
          />
        ))}
        {/* baseline the skyline sits on */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
      </div>

      {/* Single bottom bar */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-5">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.personal.fullName} ·{" "}
          {siteConfig.personal.location.label}
        </span>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          {footerLinks.map((social) => (
            <Link
              key={social.id}
              href={social.href!}
              target={social.action === "external" ? "_blank" : undefined}
              rel={
                social.action === "external" ? "noopener noreferrer" : undefined
              }
              className="text-xs font-mono uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              {social.id === "email"
                ? "Mail"
                : social.platform.replace(" (Twitter)", "")}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
