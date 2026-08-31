"use client";

import { useState } from "react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function ProgressiveBlurDemo() {
  const [position, setPosition] = useState<"bottom" | "top" | "both">("bottom");

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-freground">
          Blur Edge Position:
        </span>
        <div className="flex items-center gap-1">
          {(["bottom", "top", "both"] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosition(pos)}
              aria-pressed={position === pos}
              className={`px-2.5 py-1 text-xs font-mono capitalize rounded-sm transition-colors cursor-pointer ${
                position === pos
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-6 flex flex-col justify-between">
        {/* Decorative background grid and content */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

        <div className="relative z-0 space-y-2">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Backdrop Filter Mask
          </span>
          <h4 className="text-lg font-semibold tracking-tight">
            Multi-tier Gradient Blur
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Progressive blur applies an 8-stage exponential backdrop blur with overlapping alpha masks, eliminating sharp blur edges.
          </p>
        </div>

        <div className="relative z-0 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>8 Blur Layers</span>
          <span>0.5px &rarr; 64px Gaussian Radius</span>
        </div>

        {/* Progressive Blur Overlay */}
        <ProgressiveBlur
          position={position}
          height="45%"
        />
      </div>
    </div>
  );
}
