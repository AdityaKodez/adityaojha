"use client";

import { useEffect, useRef, useState } from "react";
import { FileCode, Globe, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModelPicker, defaultModelProviders } from "@/components/ui/model-picker";
import {
  PromptBar,
  type PromptBarContext,
  type PromptBarProps,
  type PromptBarSubmission,
  type PromptBarSkill,
} from "@/components/ui/prompt-bar";
import { trackEvent } from "@/lib/analytics";

const CONTEXT_OPTIONS: PromptBarContext[] = [
  { id: "page", label: "Current page", description: "The page you are working on", icon: <Globe /> },
  { id: "component", label: "model-picker.tsx", description: "The selected component", icon: <FileCode /> },
];

const SKILLS: PromptBarSkill[] = [
  { id: "design", label: "Design", description: "Shape an interface from your idea" },
  { id: "review", label: "Review", description: "Find issues and suggest improvements" },
  { id: "debug", label: "Debug", description: "Trace a problem and work through a fix" },
];

const DEFAULT_MODEL = defaultModelProviders[0].models[0].id;

export function PromptBarDemo({
  disabled = false,
  maxHeight = 240,
}: Partial<PromptBarProps> = {}) {
  const [contexts, setContexts] = useState<PromptBarContext[]>([]);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState("");
  const [revision, setRevision] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const modelName = defaultModelProviders.flatMap((provider) => provider.models).find((item) => item.id === model)?.name;

  useEffect(() => () => controller.current?.abort(), []);

  async function submit({ contexts: sentContexts, attachments, skill }: PromptBarSubmission) {
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setReply("");
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(resolve, 1600);
        request.signal.addEventListener("abort", () => {
          window.clearTimeout(timer);
          reject(new DOMException("Stopped", "AbortError"));
        }, { once: true });
      });
      const details = [skill?.label, sentContexts.length ? `${sentContexts.length} context ${sentContexts.length === 1 ? "item" : "items"}` : null, attachments.length ? `${attachments.length} ${attachments.length === 1 ? "attachment" : "attachments"}` : null].filter(Boolean);
      setReply(`Demo received your prompt for ${modelName}${details.length ? ` with ${details.join(", ")}` : ""}. No request or files were sent to a model.`);
      trackEvent("prompt_bar_submitted", { component_id: "prompt-bar", demo: true });
    } finally {
      if (controller.current === request) {
        controller.current = null;
        setBusy(false);
      }
    }
  }

  function stop() {
    controller.current?.abort();
    controller.current = null;
    setBusy(false);
    setReply("Demo stopped. Your draft is kept.");
  }

  function reset() {
    stop();
    setContexts([]);
    setModel(DEFAULT_MODEL);
    setReply("");
    setRevision((current) => current + 1);
  }

  return (
    <div className="flex w-full max-w-md min-w-0 flex-col gap-3 py-3">
      <PromptBar
        key={revision}
        contexts={contexts}
        contextOptions={CONTEXT_OPTIONS}
        skills={SKILLS}
        onContextAdd={(context) => setContexts((current) => current.some((item) => item.id === context.id) ? current : [...current, context])}
        onContextRemove={(id) => setContexts((current) => current.filter((context) => context.id !== id))}
        toolbar={<ModelPicker providers={defaultModelProviders} value={model} onValueChange={setModel} closeOnSelect size="sm" side="bottom" align="start" />}
        modelLabel={modelName}
        contextUsage={{ usedTokens: 194_300, maxTokens: 1_000_000, cacheHitRate: 94.4 }}
        onSubmit={submit}
        onStop={stop}
        disabled={disabled}
        maxHeight={maxHeight}
      />
      <div className="flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
        <span><span className="font-mono">/</span> Skills <span className="mx-1.5 text-border">·</span> <span className="font-mono">@</span> Context</span>
        <Button variant="ghost" size="icon-xs" aria-label="Reset demo" onClick={reset} disabled={busy}><RotateCcw aria-hidden /></Button>
      </div>
      {(busy || reply) && <p role="status" className="px-1 text-xs leading-relaxed text-muted-foreground">{busy ? "Preparing a demo response..." : reply}</p>}
    </div>
  );
}
