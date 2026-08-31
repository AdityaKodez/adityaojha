"use client";

import { ModeToggler } from "@/components/ui/mode-toggler";

export function ModeTogglerDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ModeToggler />
      <span className="text-xs text-muted-foreground font-mono">
        click to toggle
      </span>
    </div>
  );
}
