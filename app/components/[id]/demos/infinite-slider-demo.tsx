"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
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
import { useState } from "react";

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

export function InfiniteSliderDemo() {
  const [reverse, setReverse] = useState(false);

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Hover to slow down:
        </span>
        <button
          type="button"
          onClick={() => setReverse((prev) => !prev)}
          className="px-2.5 py-1 text-xs font-mono rounded-sm border bg-muted/20 hover:bg-muted/60 transition-colors cursor-pointer"
        >
          Direction: {reverse ? "Right" : "Left"}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-muted/10 py-6">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />

        <InfiniteSlider
          gap={16}
          speed={60}
          speedOnHover={15}
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
