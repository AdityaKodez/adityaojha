"use client";

import { DotProgress, ProgressBars, type ProgressBarItem } from "@/components/ui/progress-bars";

const PROJECT_PROGRESS: ProgressBarItem[] = [
  { id: "dashboard", label: "dashboard", value: 82, tooltip: "Responsive states are ready for review." },
  { id: "api", label: "api", value: 64, tooltip: "Read paths are connected; writes are in progress." },
  { id: "database", label: "database", value: 38, tooltip: "The first migration is staged." },
  { id: "security", label: "security", value: 71, tooltip: "Remediation is underway." },
  { id: "launch", label: "launch", value: 49, tooltip: "The channel calendar is taking shape." },
];

export function ProgressBarsDemo() {
  return (
    <div className="w-full max-w-xl">
      <ProgressBars items={PROJECT_PROGRESS} ariaLabel="project milestone progress" />
    </div>
  );
}

const CAPACITY_ALLOCATION: ProgressBarItem[] = [
  { id: "design", label: "design", value: 29 },
  { id: "build", label: "build", value: 35 },
  { id: "test", label: "test", value: 18 },
];

/**
 * Capacity preset for the examples carousel. `formatValue` is a function, so it
 * has to be supplied inside a client component rather than from the server.
 */
export function ProgressBarsCapacityExample() {
  return (
    <ProgressBars
      items={CAPACITY_ALLOCATION}
      max={40}
      orientation="horizontal"
      formatValue={(value) => `${value}h`}
      ariaLabel="capacity allocation in hours"
    />
  );
}

/** Dot variant preset for the examples carousel. */
export function DotProgressExample() {
  return <DotProgress items={PROJECT_PROGRESS} height={180} ariaLabel="milestone dot progress" />;
}
