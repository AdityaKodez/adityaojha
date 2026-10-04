"use client";

import { HeaderActions } from "@/components/shared/header-actions";
import { Logo } from "@/components/shared/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sticky floating header shared by every route.
 *
 * Lives at the layout level so the brand logo (left) and actions (right) —
 * GitHub star pill + theme toggle — appear on `/`, `/project/[id]`, and
 * `/components/[id]`. The width comes from `--frame-max-w` so the header stays
 * aligned with the centered main column even on routes that widen it, like
 * `/components` in card view.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isComponentsRoute =
    pathname === "/components" || pathname.startsWith("/components/");

  return (
    <header className="sticky top-3 sm:top-4 z-40 mx-auto -mb-8 flex w-full max-w-[var(--frame-max-w)] items-center justify-between px-6 pointer-events-none">
      <div className="pointer-events-auto flex h-8 items-center overflow-hidden rounded-md border border-border/60 bg-background/60 text-muted-foreground shadow-xs backdrop-blur-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              aria-label="Home"
              className="flex size-8 items-center justify-center rounded-md outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <Logo size={18} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
        {isComponentsRoute ? (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-border/60" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/components"
                  aria-label="Components"
                  className="flex h-8 items-center justify-center rounded-md px-2.5 font-mono text-[10px] font-medium leading-none outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  UI
                </Link>
              </TooltipTrigger>
              <TooltipContent><p>Components</p></TooltipContent>
            </Tooltip>
          </>
        ) : null}
      </div>

      <HeaderActions />
    </header>
  );
}
