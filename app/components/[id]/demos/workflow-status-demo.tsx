"use client";

import {
  WorkflowStatusBadge,
  workflowStatuses,
  type WorkflowStatusBadgeProps,
} from "@/components/ui/workflow-status";

/**
 * One row of badges. Both forms this demo used to render side by side are props
 * now, so the props panel switches the size and the icon-only rendering.
 */
export function WorkflowStatusDemo({
  size = "sm",
  iconOnly = false,
}: Partial<WorkflowStatusBadgeProps> = {}) {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-6 sm:p-12">
      <div className="flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          {iconOnly ? "Icon only" : "With labels"}
        </p>
        <div
          aria-label={
            iconOnly
              ? "Workflow statuses, icon only"
              : "Workflow statuses with labels"
          }
          className="flex flex-wrap items-center justify-center gap-2"
          role="list"
        >
          {workflowStatuses.map((status) => (
            <div key={status} role="listitem">
              <WorkflowStatusBadge
                iconOnly={iconOnly}
                size={size}
                status={status}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkflowStatusDemo;
