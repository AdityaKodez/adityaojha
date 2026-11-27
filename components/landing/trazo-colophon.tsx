import { ArrowUpRightCircle } from "@/components/shared/site-icons";
import { SiteSticker } from "@/components/shared/site-sticker";
import { Button } from "@/components/ui/button";
import { trazoColophonConfig } from "@/config/site-client";
import { cn } from "@/lib/utils";

const stickerMotion =
  "inline-flex size-5 items-center justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]";

export function TrazoColophon({ className }: { className?: string }) {
  return (
    <Button
      asChild
      variant="secondary"
      className={cn(
        "group/trazo h-9 w-fit shrink-0 gap-2 rounded-full pl-2.5 pr-3.5 text-[13px] font-medium",
        className,
      )}
    >
      <a
        href={trazoColophonConfig.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={trazoColophonConfig.label}
      >
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center -space-x-1.5"
        >
          <span
            className={cn(
              stickerMotion,
              "translate-x-0.5 -rotate-12 scale-90 motion-safe:pointer-fine:group-hover/trazo:-translate-x-0.5 motion-safe:pointer-fine:group-hover/trazo:-translate-y-px motion-safe:pointer-fine:group-hover/trazo:-rotate-20 motion-safe:pointer-fine:group-hover/trazo:scale-95 motion-safe:group-focus-visible/trazo:-translate-x-0.5 motion-safe:group-focus-visible/trazo:-rotate-20",
            )}
          >
            <SiteSticker
              name="flower-yellow"
              size={18}
              loading="lazy"
              className="size-[18px]"
            />
          </span>
          <span
            className={cn(
              stickerMotion,
              "relative z-10 motion-safe:pointer-fine:group-hover/trazo:-translate-y-0.5 motion-safe:pointer-fine:group-hover/trazo:rotate-6 motion-safe:pointer-fine:group-hover/trazo:scale-105 motion-safe:group-focus-visible/trazo:-translate-y-0.5 motion-safe:group-focus-visible/trazo:rotate-6",
            )}
          >
            <SiteSticker
              name="starfish"
              size={19}
              loading="lazy"
              className="size-[19px]"
            />
          </span>
          <span
            className={cn(
              stickerMotion,
              "-translate-x-0.5 rotate-12 scale-90 motion-safe:pointer-fine:group-hover/trazo:translate-x-0.5 motion-safe:pointer-fine:group-hover/trazo:-translate-y-px motion-safe:pointer-fine:group-hover/trazo:rotate-20 motion-safe:pointer-fine:group-hover/trazo:scale-95 motion-safe:group-focus-visible/trazo:translate-x-0.5 motion-safe:group-focus-visible/trazo:rotate-20",
            )}
          >
            <SiteSticker
              name="red-crab"
              size={18}
              loading="lazy"
              className="size-[18px]"
            />
          </span>
        </span>
        <span>{trazoColophonConfig.ctaLabel}</span>
        <ArrowUpRightCircle className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/trazo:text-foreground" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  );
}
