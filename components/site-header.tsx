"use client";

import { HeaderActions } from "@/components/header-actions";
import { Logo } from "@/components/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

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
  return (
    <header className="sticky top-3 sm:top-4 z-40 mx-auto -mb-8 flex w-full max-w-[var(--frame-max-w)] items-center justify-between px-6 pointer-events-none">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/"
            aria-label="home"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background/60 backdrop-blur-md shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Logo size={18} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>home</p>
        </TooltipContent>
      </Tooltip>

      <HeaderActions />
    </header>
  );
}
