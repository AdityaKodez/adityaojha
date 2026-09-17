"use client";

import {
  WorkflowStatusBadge,
  workflowStatuses,
} from "@/components/ui/workflow-status";

export function WorkflowStatusDemo() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-6 sm:p-12">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-8">
        <section className="flex w-full flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            With labels
          </p>
          <div
            aria-label="Workflow statuses with labels"
            className="flex flex-wrap items-center justify-center gap-2"
            role="list"
          >
            {workflowStatuses.map((status) => (
              <div key={status} role="listitem">
                <WorkflowStatusBadge size="sm" status={status} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Icon only
          </p>
          <div
            aria-label="Icon-only workflow statuses"
            className="flex flex-wrap items-center justify-center gap-2"
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
    </div>
  );
}

export default WorkflowStatusDemo;
