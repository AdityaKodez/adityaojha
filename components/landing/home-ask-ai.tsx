"use client";

import { useState } from "react";
import { AskAI } from "@/components/ui/ask-ai";
import BitBlob from "@/components/landing/bit";
import { trackEvent } from "@/lib/analytics";

export function HomeAskAI() {
  const [open, setOpen] = useState(false);

  return (
    <AskAI
      blobOnly
      size="default"
      side="top"
      align="end"
      tooltip="ask bit"
      title="ask an ai about me"
      description="a fresh perspective, from your favorite assistant."
      prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he's looking for. Then suggest what I should ask him about next."
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          trackEvent("ask_ai_opened", {
            location: "home_floating",
            trigger_type: "bubble",
          });
        }
      }}
      mascot={
        <BitBlob
          awake={open}
          gaze="up"
          className={`h-10 w-10 transition-transform duration-[440ms] ease-[cubic-bezier(.22,1.5,.5,1)] ${
            open ? "rotate-6 scale-105" : "-rotate-[7deg]"
          }`}
        />
      }
    />
  );
}
