"use client";

import {
  InfiniteSlider,
  type InfiniteSliderProps,
} from "@/components/motion-primitives/infinite-slider";
import {
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

const STACK_ITEMS = [
  { icon: Globe, label: "Next.js" },
  { icon: Code2, label: "TypeScript" },
  { icon: Layers, label: "Tailwind CSS" },
  { icon: Sparkles, label: "Motion" },
  { icon: Database, label: "Prisma" },
  { icon: Cpu, label: "AI SDK" },
  { icon: Terminal, label: "tRPC" },
  { icon: Zap, label: "Radix UI" },
];

/**
 * The panel drives the speed, the gap, and the direction; the hover slowdown
 * stays baked in, and the direction button this demo used to render moved into
 * the props panel.
 */
export function InfiniteSliderDemo({
  speed = 60,
  gap = 16,
  reverse = false,
  speedOnHover = 15,
}: Partial<InfiniteSliderProps> = {}) {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Hover to slow down:
        </span>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-muted/10 py-6">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />

        <InfiniteSlider
          gap={gap}
          speed={speed}
          speedOnHover={speedOnHover}
          reverse={reverse}
        >
          {STACK_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.label}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-md border bg-background/80 px-3.5 py-2 shadow-xs backdrop-blur-xs transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            );
          })}
        </InfiniteSlider>
      </div>
    </div>
  );
}
