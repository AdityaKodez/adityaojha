import { socialsConfig } from "@/config/socials";
import { siteConfig } from "@/config/site";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = socialsConfig.filter(
  (social) =>
    social.enabled !== false &&
    social.href &&
    ["x", "github", "peerlist", "email"].includes(social.id),
);

const isometricBlocks = [
  { left: "2%", width: "14%", height: "45%", delay: "0ms" },
  { left: "15%", width: "10%", height: "72%", delay: "80ms" },
  { left: "26%", width: "18%", height: "35%", delay: "120ms" },
  { left: "44%", width: "12%", height: "58%", delay: "180ms" },
  { left: "56%", width: "19%", height: "82%", delay: "240ms" },
  { left: "75%", width: "11%", height: "44%", delay: "300ms" },
  { left: "87%", width: "10%", height: "66%", delay: "360ms" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none relative h-72 overflow-hidden md:h-96" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
        <div className="absolute inset-x-[-5%] bottom-[-16%] h-40 rotate-[-8deg] border-y border-primary/20 bg-primary/[0.03] [transform:perspective(500px)_rotateX(58deg)]" />
        <div className="absolute inset-x-[-5%] bottom-[7%] h-px bg-border/70 [transform:rotate(-8deg)]" />
        <div className="absolute inset-x-[-5%] bottom-[24%] h-px bg-border/50 [transform:rotate(-8deg)]" />

        <div className="absolute inset-x-0 bottom-0 h-[78%]">
          {isometricBlocks.map((block, index) => (
            <div
              key={`${block.left}-${index}`}
              className="absolute bottom-0 border border-primary/25 bg-primary/[0.035] transition-colors duration-500 hover:bg-primary/10"
              style={{
                left: block.left,
                width: block.width,
                height: block.height,
                animationDelay: block.delay,
                clipPath: "polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)",
              }}
            >
              <div className="absolute inset-0 border-r border-t border-primary/15" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:left-10">
          End of viewport / keep building
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 border-t border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg font-bold tracking-[-0.16em] text-foreground" aria-label="Aditya Ojha">
            AO
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.personal.fullName}
          </span>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map((social) => (
            <Link
              key={social.id}
              href={social.href!}
              target={social.action === "external" ? "_blank" : undefined}
              rel={social.action === "external" ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {social.id === "email" ? "Mail" : social.platform.replace(" (Twitter)", "")}
              <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
