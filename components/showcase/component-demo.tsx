"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * One chunk per demo. These used to be static imports, which meant every
 * detail page and the card-view catalog downloaded all of them, so viewing
 * "mode-toggler" also pulled in matter-js, cmdk, react-markdown and every
 * other demo's dependency graph.
 *
 * Server rendering stays on: the demos are client components that are already
 * SSR'd on first paint, so this only moves their JavaScript into separate
 * chunks and keeps the loading fallback for when a chunk is still in flight.
 */
const DEMOS: Record<string, ComponentType> = {
  "ask-ai": demoChunk(() =>
    import("@/app/components/[id]/demos/ask-ai-demo").then((m) => m.AskAIDemo),
  ),
  "model-picker": demoChunk(() =>
    import("@/app/components/[id]/demos/model-picker-demo").then(
      (m) => m.ModelPickerDemo,
    ),
  ),
  "dotted-world-map": demoChunk(() =>
    import("@/app/components/[id]/demos/dotted-world-map-demo").then(
      (m) => m.DottedWorldMapDemo,
    ),
  ),
  "copy-command-block": demoChunk(() =>
    import("@/app/components/[id]/demos/copy-command-block-demo").then(
      (m) => m.CopyCommandBlockDemo,
    ),
  ),
  "github-map": demoChunk(() =>
    import("@/app/components/[id]/demos/github-map-demo").then(
      (m) => m.GitHubMapDemo,
    ),
  ),
  "project-explorer": demoChunk(() =>
    import("@/app/components/[id]/demos/project-explorer-demo").then(
      (m) => m.ProjectExplorerDemo,
    ),
  ),
  carousel: demoChunk(() =>
    import("@/app/components/[id]/demos/carousel-demo").then(
      (m) => m.CarouselDemo,
    ),
  ),
  "infinite-slider": demoChunk(() =>
    import("@/app/components/[id]/demos/infinite-slider-demo").then(
      (m) => m.InfiniteSliderDemo,
    ),
  ),
  "mode-toggler": demoChunk(() =>
    import("@/app/components/[id]/demos/mode-toggler-demo").then(
      (m) => m.ModeTogglerDemo,
    ),
  ),
  "progressive-blur": demoChunk(() =>
    import("@/app/components/[id]/demos/progressive-blur-demo").then(
      (m) => m.ProgressiveBlurDemo,
    ),
  ),
  "interactive-skill-cloud": demoChunk(() =>
    import("@/app/components/[id]/demos/interactive-skill-cloud-demo").then(
      (m) => m.InteractiveSkillCloudDemo,
    ),
  ),
  "contact-channels": demoChunk(() =>
    import("@/app/components/[id]/demos/contact-channels-demo").then(
      (m) => m.ContactChannelsDemo,
    ),
  ),
  "section-rail": demoChunk(() =>
    import("@/app/components/[id]/demos/section-rail-demo").then(
      (m) => m.SectionRailDemo,
    ),
  ),
  "progress-bars": demoChunk(() =>
    import("@/app/components/[id]/demos/progress-bars-demo").then(
      (m) => m.ProgressBarsDemo,
    ),
  ),
  "glyph-card": demoChunk(() =>
    import("@/app/components/[id]/demos/glyph-card-demo").then(
      (m) => m.GlyphCardDemo,
    ),
  ),
  "command-palette": demoChunk(() =>
    import("@/app/components/[id]/demos/command-palette-demo").then(
      (m) => m.CommandPaletteDemo,
    ),
  ),
  "workflow-status": demoChunk(() =>
    import("@/app/components/[id]/demos/workflow-status-demo").then(
      (m) => m.WorkflowStatusDemo,
    ),
  ),
};

/** Loads one demo as its own chunk, with the shared placeholder. */
function demoChunk(load: () => Promise<ComponentType>) {
  return dynamic(load, { loading: DemoFallback });
}

/**
 * Placeholder while a demo chunk is still in flight, either during a
 * client-side navigation or when the card view mounts its demos. Shaped like
 * the demos themselves: a centered block with a bar under it.
 */
function DemoFallback() {
  return (
    <div
      aria-hidden
      className="flex min-h-[180px] w-full flex-col items-center justify-center"
    >
      <div className="flex w-full max-w-[18rem] flex-col items-center gap-3">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-2.5 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function ComponentDemo({ id }: { id: string }) {
  const Demo = DEMOS[id];

  if (!Demo) {
    return (
      <div className="text-sm text-muted-foreground">
        No demo registered for &ldquo;{id}&rdquo;.
      </div>
    );
  }

  return <Demo />;
}
