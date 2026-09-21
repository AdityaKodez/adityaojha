"use client";

import { AskAI, type AskAIProps } from "@/components/ui/ask-ai";

/**
 * The pill/blob trigger, the size, and the popover side are all props now: the
 * two inline button groups this demo used to render moved into the props panel,
 * so the preview stays a plain example of the component's API.
 */
export function AskAIDemo({
  size = "default",
  blobOnly = false,
  side = "top",
}: Partial<AskAIProps> = {}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      <AskAI
        size={size}
        blobOnly={blobOnly}
        side={side}
        tooltip="ask an ai"
        title="ask an ai about me"
        description="a fresh perspective, from your favorite assistant."
        prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he is looking for. Then suggest what I should ask him about next."
      />
    </div>
  );
}
