"use client";

import { CarouselDemo } from "@/app/components/[id]/demos/carousel-demo";
import { CommandPaletteDemo } from "@/app/components/[id]/demos/command-palette-demo";
import { ContactChannelsDemo } from "@/app/components/[id]/demos/contact-channels-demo";
import { CopyCommandBlockDemo } from "@/app/components/[id]/demos/copy-command-block-demo";
import { DottedWorldMapDemo } from "@/app/components/[id]/demos/dotted-world-map-demo";
import { GitHubMapDemo } from "@/app/components/[id]/demos/github-map-demo";
import { InfiniteSliderDemo } from "@/app/components/[id]/demos/infinite-slider-demo";
import { InteractiveSkillCloudDemo } from "@/app/components/[id]/demos/interactive-skill-cloud-demo";
import { ModeTogglerDemo } from "@/app/components/[id]/demos/mode-toggler-demo";
import { ProgressiveBlurDemo } from "@/app/components/[id]/demos/progressive-blur-demo";
import { ProjectExplorerDemo } from "@/app/components/[id]/demos/project-explorer-demo";
import { ProgressBarsDemo } from "@/app/components/[id]/demos/progress-bars-demo";
import { SectionRailDemo } from "@/app/components/[id]/demos/section-rail-demo";

export function ComponentDemo({ id }: { id: string }) {
  switch (id) {
    case "dotted-world-map":
      return <DottedWorldMapDemo />;
    case "copy-command-block":
      return <CopyCommandBlockDemo />;
    case "github-map":
      return <GitHubMapDemo />;
    case "project-explorer":
      return <ProjectExplorerDemo />;
    case "carousel":
      return <CarouselDemo />;
    case "infinite-slider":
      return <InfiniteSliderDemo />;
    case "mode-toggler":
      return <ModeTogglerDemo />;
    case "progressive-blur":
      return <ProgressiveBlurDemo />;
    case "interactive-skill-cloud":
      return <InteractiveSkillCloudDemo />;
    case "contact-channels":
      return <ContactChannelsDemo />;
    case "section-rail":
      return <SectionRailDemo />;
    case "progress-bars":
      return <ProgressBarsDemo />;
    case "command-palette":
      return <CommandPaletteDemo />;
    default:
      return (
        <div className="text-sm text-muted-foreground">
          No demo registered for &ldquo;{id}&rdquo;.
        </div>
      );
  }
}
