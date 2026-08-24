import { siteConfig } from "@/config/site";

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
    <footer className="mt-4 overflow-hidden bg-background">
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
        <p className="absolute bottom-8 left-6 z-10 max-w-52 text-xs leading-relaxed text-muted-foreground">
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
