"use client";

import {
  ProgressBars,
  type ProgressBarItem,
  type ProgressBarsProps,
} from "@/components/ui/progress-bars";

const PROJECT_PROGRESS: ProgressBarItem[] = [
  { id: "dashboard", label: "dashboard", value: 82, tooltip: "Responsive states are ready for review." },
  { id: "api", label: "api", value: 64, tooltip: "Read paths are connected; writes are in progress." },
  { id: "database", label: "database", value: 38, tooltip: "The first migration is staged." },
  { id: "security", label: "security", value: 71, tooltip: "Remediation is underway." },
  { id: "launch", label: "launch", value: 49, tooltip: "The channel calendar is taking shape." },
];

/**
 * The etched-rules fill, which is the first paint the catalog card and the home
 * teaser have always rendered. The props are the ones the detail page's panel
 * drives, and each default below matches the components' own defaults so the
 * first paint does not change when the panel is not in play.
 */
export function ProgressBarsDemo({
  orientation = "vertical",
  max,
  height = 240,
  showScale = true,
  showValues = true,
  showTooltip = true,
}: Partial<ProgressBarsProps> = {}) {
  return (
    <div className="w-full max-w-xl">
      <ProgressBars
        items={PROJECT_PROGRESS}
        orientation={orientation}
        max={max}
        height={height}
        showScale={showScale}
        showValues={showValues}
        showTooltip={showTooltip}
        ariaLabel="project milestone progress"
      />
    </div>
  );
}
