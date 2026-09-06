"use client";

import { AskAI } from "@/components/ui/ask-ai";
import { trackEvent } from "@/lib/analytics";

export function HomeAskAI() {
  return (
    <AskAI
      blobOnly
      size="default"
      side="top"
      align="end"
      tooltip="ask an ai"
      title="ask an ai about me"
      description="a fresh perspective, from your favorite assistant."
      prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he's looking for. Then suggest what I should ask him about next."
      onOpenChange={(open) => {
        if (open) {
          trackEvent("ask_ai_opened", {
            location: "home_floating",
            trigger_type: "bubble",
          });
        }
      }}
    />
  );
}
