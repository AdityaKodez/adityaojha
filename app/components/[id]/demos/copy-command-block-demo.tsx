"use client";

import { CopyCommandBlock } from "@/components/ui/copy-command-block";

export function CopyCommandBlockDemo() {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono text-muted-foreground">
          Multi-Package Manager Install Command:
        </span>
        <CopyCommandBlock
          commands={{
            npm: "npx shadcn@latest add @akoder/dotted-world-map",
            pnpm: "pnpm dlx shadcn@latest add @akoder/dotted-world-map",
            yarn: "yarn dlx shadcn@latest add @akoder/dotted-world-map",
            bun: "bunx --bun shadcn@latest add @akoder/dotted-world-map",
          }}
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-muted-foreground">
          Single Standalone Command:
        </span>
        <CopyCommandBlock command="git clone https://github.com/AdityaKodez/adityaojha.git" />
      </div>
    </div>
  );
}
