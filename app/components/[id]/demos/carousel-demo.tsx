"use client";

import { Carousel, type CarouselItem } from "@/components/ui/carousel";
import { CheckCircle2, Clock3, FileText, MessageSquareText } from "lucide-react";

const RELEASE_UPDATES: CarouselItem[] = [
  {
    id: "release-checklist",
    title: "Release checklist",
    description: "Keep the final handoff focused on the few checks that prevent avoidable regressions.",
    content: (
      <div className="w-full overflow-hidden rounded-md border bg-card">
        <div className="flex items-center justify-between border-b border-dashed px-4 py-3">
          <div>
            <p className="text-sm font-medium">v2.4 launch</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ready for the production window</p>
          </div>
          <span className="rounded-sm bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
            3 of 3 clear
          </span>
        </div>
        <ul className="divide-y divide-dashed px-4">
          {[
            "Database migration reviewed",
            "Error states verified on mobile",
            "Release notes shared with support",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 py-3 text-xs">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "handoff-brief",
    title: "Team handoff",
    description: "Package context, ownership, and the next action in one compact review card.",
    content: (
      <div className="grid w-full overflow-hidden rounded-md border bg-card sm:grid-cols-[1fr_auto]">
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            Design QA handoff
          </div>
          <p className="text-sm font-medium">Checkout empty state is ready for implementation.</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Includes responsive specs, loading behavior, and the agreed copy for the recovery action.
          </p>
        </div>
        <div className="flex items-center gap-2 border-t border-dashed bg-muted/20 px-4 py-3 sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
          <span className="font-mono text-[10px] text-muted-foreground">OWNER</span>
          <span className="rounded-sm bg-background px-2 py-1 text-xs">Maya</span>
        </div>
      </div>
    ),
  },
  {
    id: "customer-signal",
    title: "Customer signal",
    description: "Use a slide to isolate the one finding worth carrying into the next planning cycle.",
    content: (
      <div className="w-full rounded-md border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-primary">
            <MessageSquareText className="size-3.5" />
            Interview note #18
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Clock3 className="size-3" />
            6 min read
          </div>
        </div>
        <blockquote className="mt-4 text-sm leading-relaxed">
          “I do not need more dashboards. I need to know what deserves attention before the day gets away from me.”
        </blockquote>
        <p className="mt-3 text-xs text-muted-foreground">
          Next action: test a priority digest before adding another reporting view.
        </p>
      </div>
    ),
  },
];

export function CarouselDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel items={RELEASE_UPDATES} ariaLabel="Product operations carousel" />
    </div>
  );
}
