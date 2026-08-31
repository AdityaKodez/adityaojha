"use client";

import { ProjectExplorer } from "@/components/project-explorer";

export function ProjectExplorerDemo() {
  return (
    <div className="w-full max-w-2xl">
      <ProjectExplorer
        showHeading={false}
        defaultOpen="latest"
        showHoverPreview={true}
      />
    </div>
  );
}
