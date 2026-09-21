"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentDoc } from "@/config/types";
import { getComponentIcon } from "@/components/showcase/component-icons";
import { CardPlayground } from "@/components/showcase/card-playground";
import { useComponentsView } from "@/components/showcase/components-view";
import type { CatalogView } from "@/components/showcase/components-view";
import { ComponentSuggestion } from "@/components/showcase/component-suggestion";
import { trackEvent } from "@/lib/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComponentsCatalogProps {
  components: ComponentDoc[];
}

export function ComponentsCatalog({ components }: ComponentsCatalogProps) {
  const [view, setView] = useComponentsView();

  // Persist the new view and, only when it actually changes, log the switch so
  // the list-vs-cards preference can be analyzed post-hoc. Re-clicking the
  // already-active view keeps the existing writeView behavior without noise.
  const selectView = (next: CatalogView) => {
    if (next !== view) {
      trackEvent("components_view_switched", {
        view: next,
        previous_view: view,
      });
    }
    setView(next);
  };

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
                  onClick={() => selectView("list")}
                  aria-label="List view"
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
                <p>List view</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => selectView("cards")}
                  aria-label="Card view"
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
                <p>Card view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {components.map((c) => {
            const Icon = getComponentIcon(c.icon);
            return (
              <Link
                key={c.id}
                href={`/components/${c.id}`}
                className="group relative flex items-stretch border-b sm:border-b-0"
              >
                <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="h-4 w-4" />
                    <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                    {c.new && (
                      <span
                        className="absolute -top-1 -right-1 size-2 rounded-full bg-sky-500 ring-2 ring-background"
                        aria-label="New component"
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

          {/* The trailing slot. It squares off an odd row exactly like the
              old filler did, and when the count is even it simply opens the
              next one, because the suggestion CTA is a permanent fixture,
              not a gap-filler. */}
          <ComponentSuggestion variant="list" />
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
                          aria-label="New component"
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
                <div className="catalog-card-body relative flex flex-1 items-center justify-center overflow-hidden rounded-tr-md rounded-b-md border bg-background p-3 transition-colors group-hover:border-muted-foreground/20 sm:p-4 lg:p-6">
                  {/* Stretched link. The body is the largest, most
                      click-inviting surface on the card, but only the tab
                      title above was ever a link, so clicks landing in the
                      body's dead space went nowhere and PostHog logged them
                      as $dead_click.

                      This is a *sibling* of the demo at a lower z-index
                      rather than a wrapper around it, which matters: the
                      demos here are live and interactive, so wrapping them
                      in a link would hijack their own clicks (and nest
                      interactive elements inside an anchor). At z-0 it
                      collects only what the demo does not claim: the
                      padding ring and the space above and below the demo.

                      aria-hidden + tabIndex={-1} because the tab title is
                      already a keyboard-reachable link to this same href;
                      this overlay is a pointer-only convenience and should
                      not be announced or tabbed to twice. */}
                  <Link
                    href={`/components/${c.id}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="absolute inset-0 z-0"
                  />
                  <CardPlayground componentId={c.id} />
                </div>
              </div>
            );
          })}

          {/* Same trailing slot in card view. The tab stand-in keeps the
              dashed body aligned with the preview bodies of real cards. */}
          <ComponentSuggestion variant="cards" />
        </div>
      )}
    </div>
  );
}
