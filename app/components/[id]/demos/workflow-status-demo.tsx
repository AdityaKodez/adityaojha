"use client";

import {
  WorkflowStatusBadge,
  workflowStatuses,
} from "@/components/ui/workflow-status";

export function WorkflowStatusDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8 sm:grid-cols-[1fr_auto] sm:gap-12">
      <section className="space-y-3">
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
          With labels
        </p>
        <div
          aria-label="Workflow statuses with labels"
          className="flex flex-wrap gap-2"
          role="list"
        >
          {workflowStatuses.map((status) => (
            <div key={status} role="listitem">
              <WorkflowStatusBadge size="sm" status={status} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
          Icon only
        </p>
        <div
          aria-label="Icon-only workflow statuses"
          className="flex flex-wrap gap-2 sm:max-w-24"
          role="list"
        >
          {workflowStatuses.map((status) => (
            <div key={status} role="listitem">
              <WorkflowStatusBadge iconOnly size="sm" status={status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
