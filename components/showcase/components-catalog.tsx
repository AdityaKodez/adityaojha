"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentDoc } from "@/config/types";
import { getComponentIcon } from "@/components/showcase/component-icons";
import { ComponentDemo } from "@/components/showcase/component-demo";
import { useComponentsView } from "@/components/showcase/components-view";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComponentsCatalogProps {
  components: ComponentDoc[];
}

/**
 * Walks the card grid two columns at a time to find out whether the last row
 * ends short. A `colSpan: 2` entry that meets a half-filled row wraps to the
 * next one, so the count of items says nothing about where the grid closes —
 * only the running column cursor does.
 */
function cardGridHasTrailingGap(components: ComponentDoc[]): boolean {
  let column = 0;
  for (const component of components) {
    const span = component.colSpan === 2 ? 2 : 1;
    // A wide item can't start in the second column, so it wraps.
    if (span === 2) {
      column = 0;
      continue;
    }
    column = (column + 1) % 2;
  }
  return column === 1;
}

export function ComponentsCatalog({ components }: ComponentsCatalogProps) {
  const [view, setView] = useComponentsView();
  const needsListFiller = components.length % 2 === 1;
  const needsCardFiller = cardGridHasTrailingGap(components);

  return (
    <div className="w-full">
      {/* View Switcher Toolbar */}
      <div className="flex items-center justify-between border-y border-dashed px-6 py-2.5">
        <span className="font-mono text-xs text-muted-foreground">
          {components.length} components
        </span>

        <TooltipProvider delayDuration={150}>
          <div className="inline-flex items-center rounded-sm border bg-background p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="list view"
                  aria-pressed={view === "list"}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-sm transition-colors",
                    view === "list"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <List className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>list view</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setView("cards")}
                  aria-label="card view"
                  aria-pressed={view === "cards"}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-sm transition-colors",
                    view === "cards"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>card view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {components.map((c, index) => {
            const Icon = getComponentIcon(c.icon);
            return (
              <Link
                key={c.id}
                href={`/components/${c.id}`}
                className={cn(
                  "group relative flex items-stretch",
                  (index < components.length - 1 || needsListFiller) &&
                    "border-b sm:border-b-0"
                )}
              >
                <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="h-4 w-4" />
                    <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                    {c.new && (
                      <span
                        className="absolute -top-1 -right-1 size-2 rounded-full bg-sky-500 ring-2 ring-background"
                        aria-label="new component"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 grow flex-col">
                    <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                      {c.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
                      {c.description}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
                <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}

          {needsListFiller ? (
            <div
              aria-hidden
              className="relative flex select-none items-stretch"
            >
              <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground/50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 6v12" />
                    <path d="M6 12h12" />
                  </svg>
                  <div className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted-foreground/20" />
                </div>
                <div className="flex min-w-0 grow flex-col">
                  <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground/60">
                    something new is on the bench
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/50">
                    the next block lands in this slot. it is being drawn,
                    measured, and argued with.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-dashed border-muted-foreground/15" />
            </div>
          ) : null}
        </div>
      )}

      {/* Card View */}
      {view === "cards" && (
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:gap-5 lg:p-6">
          {components.map((c) => {
            const Icon = getComponentIcon(c.icon);
            const isWide = c.colSpan === 2;

            return (
              <div
                key={c.id}
                className={cn(
                  "group relative isolate flex min-w-0 flex-col",
                  isWide && "sm:col-span-2"
                )}
              >
                {/* Tab strip — the title reads as an editor tab rather than a
                    full-width header. The tab draws only its own top and left
                    edges and sits above the body, so the space to its right
                    stays open instead of being boxed into an empty strip.
                    `-mb-px` drops the tab onto the body's top rule and the
                    tab's own background hides the run of that rule underneath
                    it, which is what leaves the tab open into the preview. */}
                <div className="relative z-10 -mb-px flex items-stretch">
                  <div className="flex min-w-0 items-stretch bg-background">
                    <Link
                      href={`/components/${c.id}`}
                      className="group/title flex min-w-0 items-center gap-2 rounded-tl-md border-t border-l py-2 pl-3 pr-1 sm:pl-4"
                    >
                      <div className="relative flex size-6 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover/title:text-foreground">
                        <Icon className="size-3.5" />
                        <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/10" />
                      </div>
                      <span className="truncate font-pixel text-xs tracking-wider text-foreground transition-colors group-hover/title:text-foreground/80">
                        {c.title}
                      </span>
                      {c.new && (
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-sky-500 ring-2 ring-background"
                          aria-label="new component"
                        />
                      )}
                    </Link>

                    {/* The tab's slanted right edge, stepping down to the
                        body's top rule. `preserveAspectRatio="none"` lets the
                        box stretch to whatever height the tab resolves to
                        while the line still lands on both corners, and the
                        non-scaling stroke keeps it a hairline through that
                        stretch. */}
                    <svg
                      aria-hidden
                      viewBox="0 0 20 40"
                      preserveAspectRatio="none"
                      className="w-5 shrink-0 self-stretch overflow-visible text-border"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="20"
                        y2="40"
                        stroke="currentColor"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>

                  {/* Open space beside the tab — no fill, no rule. */}
                  <div className="min-w-0 flex-1" />
                </div>

                {/* Live preview container — owns the card frame, so its top
                    rule is the tab baseline running out to the right edge. */}
                <div className="catalog-card-body relative flex flex-1 items-center justify-center overflow-hidden rounded-tr-md rounded-b-md border bg-background p-3 sm:p-4 lg:p-6">
                  <div className="flex w-full min-w-0 justify-center">
                    <ComponentDemo id={c.id} />
                  </div>
                </div>
              </div>
            );
          })}

          {needsCardFiller ? (
            <div
              aria-hidden
              className="relative hidden min-w-0 select-none flex-col sm:flex"
            >
              {/* Stands in for the tab strip so the dashed box lines up with
                  the preview body of a real card, not with its tab. */}
              <div className="-mb-px flex items-center py-2">
                <div className="size-6" />
              </div>

              <div className="catalog-card-body flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed p-6 text-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-4 text-muted-foreground/40"
                >
                  <path d="M12 6v12" />
                  <path d="M6 12h12" />
                </svg>
                <p className="font-mono text-[11px] text-muted-foreground/50">
                  next block on the bench
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
