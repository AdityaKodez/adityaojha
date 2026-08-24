import { socialsConfig } from "@/config/socials";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const footerLinks = socialsConfig.filter(
  (social) =>
    social.enabled !== false &&
    social.href &&
    ["x", "github", "peerlist", "email"].includes(social.id),
);

const buildings = [
  { width: "w-12", height: "h-20" },
  { width: "w-16", height: "h-28" },
  { width: "w-10", height: "h-16" },
  { width: "w-20", height: "h-32" },
  { width: "w-14", height: "h-24" },
  { width: "w-24", height: "h-36" },
  { width: "w-12", height: "h-20" },
  { width: "w-16", height: "h-28" },
  { width: "w-10", height: "h-16" },
];

export function Footer() {
  return (
    <footer className="mt-4 overflow-hidden border-t border-dashed bg-background">
      <div className="flex min-h-14 items-center justify-between border-b border-dashed px-6">
        <span className="font-pixel text-sm font-semibold tracking-tight text-foreground">
          AO
        </span>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          {footerLinks.map((social) => (
            <Link
              key={social.id}
              href={social.href!}
              target={social.action === "external" ? "_blank" : undefined}
              rel={social.action === "external" ? "noopener noreferrer" : undefined}
              className="text-xs font-mono uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
            >
              {social.id === "email" ? "Mail" : social.platform.replace(" (Twitter)", "")}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative h-72 overflow-hidden border-b border-dashed">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 px-4 [perspective:700px]">
          {buildings.map((building, index) => (
            <div
              key={`${building.width}-${building.height}-${index}`}
              className={`${building.width} ${building.height} relative shrink-0 border border-border/70 bg-background/40 [transform:rotateY(-18deg)_rotateX(2deg)]`}
              aria-hidden="true"
            >
              <div className="absolute -right-3 -top-2 h-[calc(100%+1px)] w-3 origin-left border-y border-r border-border/50 bg-muted/10 [transform:skewY(-34deg)]" />
              <div className="absolute -left-px -right-3 -top-2 h-2 origin-bottom border border-border/50 bg-background [transform:skewX(-56deg)]" />
              {index % 3 === 0 ? (
                <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 -translate-y-full bg-border/70" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="absolute bottom-5 left-6 max-w-44 text-xs leading-relaxed text-muted-foreground">
          Building useful software from {siteConfig.personal.location.label}.
        </p>
      </div>

      <div className="flex items-center justify-between px-6 py-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {siteConfig.personal.fullName}</span>
        <span className="font-mono uppercase tracking-wide">Keep shipping</span>
      </div>
    </footer>
  );
}
