"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Check } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import {
  AIMascot,
  aiProviderIcons,
  defaultAIProviders,
  getProviderUrl,
  type AIProvider,
} from "@/components/ui/ask-ai";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { homeAskAIConfig as config } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 280, damping: 28, mass: 0.72 } as const;
const softSpring = { type: "spring", stiffness: 360, damping: 30, mass: 0.65 } as const;

function ProviderPicker({
  provider,
  open,
  onOpenChange,
  onSelect,
}: {
  provider: AIProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (provider: AIProvider) => void;
}) {
  const labelId = useId();
  const ProviderIcon = aiProviderIcons[provider.id as keyof typeof aiProviderIcons];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`change assistant, ${provider.name} selected`}
          className="home-ai-control text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {ProviderIcon && <ProviderIcon aria-hidden="true" className="size-5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={10} collisionPadding={12} className="w-56 rounded-2xl p-1.5">
        <p id={labelId} className="px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground">
          {config.pickerLabel}
        </p>
        <ToggleGroup.Root type="single" orientation="vertical" value={provider.id} aria-labelledby={labelId} className="flex flex-col gap-0.5">
          {defaultAIProviders.map((item) => {
            const Icon = aiProviderIcons[item.id as keyof typeof aiProviderIcons];
            const selected = item.id === provider.id;
            return (
              <ToggleGroup.Item
                key={item.id}
                value={item.id}
                onClick={() => { onSelect(item); onOpenChange(false); }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus-visible:bg-muted",
                  selected ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
                <span className="flex-1 text-left">{item.name}</span>
                {selected && <Check aria-hidden="true" className="size-4 text-primary" />}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
      </PopoverContent>
    </Popover>
  );
}

export function HomeAskAI() {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [provider, setProvider] = useState<AIProvider>(
    defaultAIProviders.find((item) => item.id === config.defaultProvider) ?? defaultAIProviders[0],
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const inputId = useId();

  function openComposer() {
    setExpanded(true);
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    trackEvent("ask_ai_opened", { location: "home_floating", trigger_type: "pill" });
  }

  function closeComposer() {
    setPickerOpen(false);
    setExpanded(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function send() {
    const message = value.trim();
    if (!message) return;
    const url = getProviderUrl(provider, `${config.basePrompt}\n\nMy question:\n${message}`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeComposer();
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="pointer-events-none flex w-full justify-end font-sans">
      <motion.form
        aria-label={config.label}
        data-home-composer=""
        onSubmit={(event) => { event.preventDefault(); send(); }}
        initial={false}
        animate={{
          width: expanded ? "min(100%, 28rem)" : "3rem",
          scale: expanded ? 1 : 0.96,
        }}
        transition={reduceMotion ? { duration: 0 } : spring}
        className={cn(
          "home-ai-glass pointer-events-auto relative flex min-w-0 items-center overflow-hidden rounded-full p-1",
          expanded ? "gap-0.5" : "justify-center",
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={expanded ? closeComposer : openComposer}
          aria-expanded={expanded}
          aria-controls={inputId}
          aria-label={expanded ? config.closeLabel : config.label}
          className="home-ai-control shrink-0 text-foreground hover:bg-muted/70"
        >
          <AIMascot awake={expanded} size="compact" />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.18 }, width: softSpring }}
              className="flex min-w-0 flex-1 items-center"
            >
              <textarea
                ref={inputRef}
                id={inputId}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={config.placeholder}
                aria-label={config.inputLabel}
                rows={1}
                enterKeyHint="send"
                autoComplete="off"
                className="home-ai-textarea min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
              />
              <ProviderPicker provider={provider} open={pickerOpen} onOpenChange={setPickerOpen} onSelect={setProvider} />
              <button
                type="submit"
                disabled={!value.trim()}
                aria-label={`send to ${provider.name}`}
                className="home-ai-control shrink-0 text-primary-foreground disabled:cursor-default"
              >
                <span className={cn("flex size-9 items-center justify-center rounded-full bg-primary transition-opacity", !value.trim() && "opacity-30")}>
                  <ArrowUp aria-hidden="true" className="size-5" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
