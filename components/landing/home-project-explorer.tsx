"use client";

import { ProjectExplorer, type ProjectExplorerProps } from "@/components/project-explorer";
import { PortfolioSticker } from "@/components/shared/portfolio-sticker";
import { ArrowUpRight } from "@/components/shared/site-icons";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function WorkYearSticker({ open, className }: { open: boolean; className?: string }) {
  return (
    <PortfolioSticker
      name={open ? "work-open" : "work-closed"}
      className={cn("-my-1 size-10 shrink-0", className)}
    />
  );
}

export function HomeProjectExplorer(props: ProjectExplorerProps) {
  return (
    <ProjectExplorer
      {...props}
      yearIcon={WorkYearSticker}
      linkIcon={<ArrowUpRight className="size-4" />}
      onProjectClick={(project, targetType, url) => {
        trackEvent("project_clicked", {
          project_id: project.id,
          project_title: project.title,
          target_type: targetType,
          url,
        });
      }}
      onYearToggle={(year, action) => {
        trackEvent("project_year_toggled", {
          year,
          action,
        });
      }}
    />
  );
}
