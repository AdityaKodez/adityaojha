"use client";

import {
  ProgressiveBlur,
  type ProgressiveBlurProps,
} from "@/components/ui/progressive-blur";

/**
 * The blur edge and its height are props now: the inline position button group
 * this demo used to render moved into the props panel, so the preview stays a
 * plain example of the component's API. Every prop falls back to the same
 * value the panel starts from, so the catalog cards and the home teaser render
 * exactly what they rendered before.
 */
export function ProgressiveBlurDemo({
  position = "bottom",
  height = "45%",
}: Partial<ProgressiveBlurProps> = {}) {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Blur Edge Position:
        </span>
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
        <ProgressiveBlur position={position} height={height} />
      </div>
    </div>
  );
}
