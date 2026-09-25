import * as React from "react";

import { cn } from "@/lib/utils";

function ButtonGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn("inline-flex items-center overflow-hidden rounded-lg", className)}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="button-group-separator"
      aria-hidden="true"
      className={cn("h-4 w-px shrink-0 bg-border", className)}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator };
