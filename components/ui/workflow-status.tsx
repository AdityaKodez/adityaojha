import { clsx, type ClassValue } from "clsx";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleX,
  Clock3,
  ScanSearch,
  Send,
  type LucideIcon
} from "lucide-react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const workflowStatuses = [
  "pending",
  "in-progress",
  "submitted",
  "in-review",
  "success",
  "failed",
  "expired",
] as const;

export type WorkflowStatus = (typeof workflowStatuses)[number];
export type WorkflowStatusValue = WorkflowStatus | (string & {});
export type WorkflowStatusBadgeSize = "sm" | "default";

export interface WorkflowStatusBadgeProps extends ComponentProps<"span"> {
  status: WorkflowStatusValue;
  /** Overrides the default or inferred label for the selected state. */
  label?: string;
  /** Replaces the state's default icon. */
  icon?: LucideIcon;
  /** Replaces the state's background and foreground colour classes. */
  colorClassName?: string;
  /** Adds classes to the icon. */
  iconClassName?: string;
  /** Reduces the badge footprint for dense interfaces. */
  size?: WorkflowStatusBadgeSize;
  /**
   * Shows the icon-only form. The state label stays in the accessibility tree
   * as visually hidden text, so no aria-label is required.
   */
  iconOnly?: boolean;
}

type StatusPresentation = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
};

export const workflowStatusPresentations: Record<
  WorkflowStatus,
  StatusPresentation
> = {
  pending: {
    label: "Pending",
    icon: AlertTriangle,
    className: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  },
  "in-progress": {
    label: "In progress",
    icon: CircleDashed,
    className: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    className: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
  },
  "in-review": {
    label: "In review",
    icon: ScanSearch,
    className: "bg-yellow-500/12 text-yellow-700 dark:text-yellow-300",
  },
  success: {
    label: "Success",
    icon: CheckCircle2,
    className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  },
  failed: {
    label: "Failed",
    icon: CircleX,
    className: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
  },
  expired: {
    label: "Expired",
    icon: Clock3,
    className: "bg-zinc-500/12 text-zinc-700 dark:text-zinc-300",
  },
};

/** Default label for a state. Useful for filters and legends built alongside the badge. */
export function getWorkflowStatusLabel(status: WorkflowStatusValue): string {
  return isWorkflowStatus(status)
    ? workflowStatusPresentations[status].label
    : humanizeStatus(status);
}

function isWorkflowStatus(status: WorkflowStatusValue): status is WorkflowStatus {
  return status in workflowStatusPresentations;
}

function humanizeStatus(status: string) {
  const label = status.trim().replace(/[-_]+/g, " ");
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : "Status";
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A compact semantic label for workflow states. Each state has an icon, colour,
 * and accessible text without requiring a separate icon library or stylesheet.
 */
export function WorkflowStatusBadge({
  status,
  label,
  icon,
  colorClassName,
  iconClassName,
  size = "default",
  iconOnly = false,
  className,
  ...props
}: WorkflowStatusBadgeProps) {
  const presentation = isWorkflowStatus(status)
    ? workflowStatusPresentations[status]
    : undefined;
  const Icon = icon ?? presentation?.icon ?? CircleDashed;
  const resolvedLabel = label ?? presentation?.label ?? humanizeStatus(status);

  return (
    <span
      data-status={status}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium tracking-tight",
        iconOnly
          ? size === "sm"
            ? "size-6 rounded-full"
            : "size-8 rounded-full"
          : size === "sm"
            ? "min-h-6 gap-1 rounded-lg px-2 py-1 text-xs"
            : "min-h-8 gap-1.5 rounded-xl px-3 py-1.5 text-sm",
        colorClassName ??
          presentation?.className ??
          "bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={2.25}
        className={cn(
          "shrink-0 motion-reduce:animate-none",
          size === "sm" ? "size-3.5" : "size-4.5",
          presentation?.iconClassName,
          iconClassName,
        )}
      />
      {iconOnly ? <span className="sr-only">{resolvedLabel}</span> : resolvedLabel}
    </span>
  );
}
