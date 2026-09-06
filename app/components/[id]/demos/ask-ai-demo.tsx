"use client";

import { useState } from "react";
import { AskAI } from "@/components/ui/ask-ai";

export function AskAIDemo() {
  const [size, setSize] = useState<"default" | "compact">("default");
  const [blobOnly, setBlobOnly] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      <AskAI
        size={size}
        blobOnly={blobOnly}
        side="top"
        tooltip="ask an ai"
        title="ask an ai about me"
        description="a fresh perspective, from your favorite assistant."
        prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he is looking for. Then suggest what I should ask him about next."
      />

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 rounded-md border p-1">
          <button
            type="button"
            onClick={() => setBlobOnly(false)}
            className={`cursor-pointer rounded-sm px-2 py-1 transition-colors ${
              !blobOnly
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            pill
          </button>
          <button
            type="button"
            onClick={() => setBlobOnly(true)}
            className={`cursor-pointer rounded-sm px-2 py-1 transition-colors ${
              blobOnly
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            only blob
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border p-1">
          <button
            type="button"
            onClick={() => setSize("default")}
            className={`cursor-pointer rounded-sm px-2 py-1 transition-colors ${
              size === "default"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            default
          </button>
          <button
            type="button"
            onClick={() => setSize("compact")}
            className={`cursor-pointer rounded-sm px-2 py-1 transition-colors ${
              size === "compact"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            compact
          </button>
        </div>
      </div>
    </div>
  );
}
