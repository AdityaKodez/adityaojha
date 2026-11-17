"use client";

import { ProjectExplorer, type ProjectExplorerProps } from "@/components/project-explorer";
import { ArrowUpRight } from "@/components/shared/site-icons";
import { trackEvent } from "@/lib/analytics";

export function HomeProjectExplorer(props: ProjectExplorerProps) {
  return (
    <ProjectExplorer
      {...props}
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
