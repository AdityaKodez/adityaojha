"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Check } from "lucide-react";
import {
  AIMascot,
  aiProviderIcons,
  defaultAIProviders,
  getProviderUrl,
  type AIProvider,
} from "@/components/ui/ask-ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const BASE_PROMPT =
  "Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he's looking for. Then suggest what I should ask him about next.";

const MAX_TEXTAREA_HEIGHT = 120;

export function HomeAskAI() {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [provider, setProvider] = useState<AIProvider>(defaultAIProviders[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  useEffect(() => {
    if (expanded) textareaRef.current?.focus();
  }, [expanded]);

  function toggleExpanded() {
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        trackEvent("ask_ai_opened", {
          location: "home_floating",
          trigger_type: "pill",
        });
      }
      return next;
    });
  }

  function send() {
    const message = value.trim();
    if (!message) return;
    const url = getProviderUrl(provider, `${BASE_PROMPT}\n\n${message}`);
    window.open(url, "_blank", "noopener,noreferrer");
    trackEvent("ask_ai_message_sent", {
      location: "home_floating",
      provider: provider.id,
      message_length: message.length,
    });
    setValue("");
    requestAnimationFrame(resizeTextarea);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      setExpanded(false);
      return;
    }
    if (event.key !== "Enter" || event.shiftKey) return;
    // Enter may confirm CJK IME composition instead of sending
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    send();
  }

  const ProviderIcon =
    aiProviderIcons[provider.id as keyof typeof aiProviderIcons];

  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex items-end">
        <Tooltip
          open={expanded || pickerOpen ? false : tooltipOpen}
          onOpenChange={(next) => setTooltipOpen(expanded ? false : next)}
        >
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-label={expanded ? "close composer" : "ask an ai"}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background/80 shadow-sm ring-1 ring-inset ring-border/60 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              <AIMascot awake={expanded} gaze="up" size="compact" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            ask an ai
          </TooltipContent>
        </Tooltip>

        <div
          inert={!expanded}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            expanded
              ? "ms-2 max-w-[min(26rem,calc(100vw-7.5rem))] opacity-100"
              : "ms-0 max-w-0 opacity-0"
          )}
        >
          <div className="flex items-end gap-1 rounded-[22px] bg-background/80 p-1.5 ps-3 shadow-lg ring-1 ring-inset ring-border/60 backdrop-blur-md">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ask an ai about aditya"
              aria-label="message for your ai assistant"
              className="w-44 min-w-0 flex-1 resize-none self-center bg-transparent py-1.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground sm:w-64"
            />

            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`assistant: ${provider.name}, change`}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ProviderIcon ? (
                    <ProviderIcon aria-hidden="true" className="size-4" />
                  ) : null}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="end"
                sideOffset={12}
                className="w-44 gap-0.5 rounded-2xl bg-popover p-1.5 shadow-xl ring-1 ring-inset ring-border/50"
              >
                <span className="px-2 pb-1 pt-0.5 font-mono text-[10px] text-muted-foreground">
                  assistant
                </span>
                <div role="listbox" aria-label="choose assistant">
                  {defaultAIProviders.map((item) => {
                    const Icon =
                      aiProviderIcons[
                        item.id as keyof typeof aiProviderIcons
                      ];
                    const selected = item.id === provider.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setProvider(item);
                          setPickerOpen(false);
                          textareaRef.current?.focus();
                        }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selected
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {Icon ? (
                          <Icon aria-hidden="true" className="size-4 shrink-0" />
                        ) : null}
                        <span className="flex-1 text-left">{item.name}</span>
                        {selected ? (
                          <Check aria-hidden="true" className="size-3.5" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={send}
              disabled={!value.trim()}
              aria-label={`send to ${provider.name} (opens in a new tab)`}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-150 hover:opacity-90 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              <ArrowUp aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
