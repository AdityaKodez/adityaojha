"use client";

import {
  CopyCommandBlock,
  type CopyCommandBlockProps,
} from "@/components/ui/copy-command-block";

/**
 * The panel drives the tab switcher and the prompt icon, so both command
 * shapes stay a plain example of the component's API.
 */
export function CopyCommandBlockDemo({
  showTabs = true,
  showPrompt = true,
}: Partial<CopyCommandBlockProps> = {}) {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono text-muted-foreground">
          multi-package manager install command:
        </span>
        <CopyCommandBlock
          showTabs={showTabs}
          showPrompt={showPrompt}
          commands={{
            npm: "npx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
            pnpm: "pnpm dlx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
            yarn: "yarn dlx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
            bun: "bunx --bun shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
          }}
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-muted-foreground">
          single standalone command:
        </span>
        <CopyCommandBlock
          showTabs={showTabs}
          showPrompt={showPrompt}
          command="git clone https://github.com/AdityaKodez/adityaojha.git"
        />
      </div>
    </div>
  );
}
