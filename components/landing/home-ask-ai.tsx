"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import useMeasure from "react-use-measure";
import { ToggleGroup } from "radix-ui";
import { ArrowUp, Check } from "lucide-react";
import {
  AIMascot,
  aiProviderIcons,
  defaultAIProviders,
  getProviderUrl,
  type AIProvider,
} from "@/components/ui/ask-ai";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { homeAskAIConfig as config } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const COMPOSER_SPRING = { type: "spring", stiffness: 320, damping: 36, mass: 1 } as const;
const COLLAPSED_SIZE = 48;

function ProviderPicker({
  provider,
  open,
  onOpenChange,
  onSelect,
  onReturnToInput,
}: {
  provider: AIProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (provider: AIProvider) => void;
  onReturnToInput: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const returnToInput = useRef(false);
  const labelId = useId();
  const descriptionId = useId();
  const ProviderIcon = aiProviderIcons[provider.id as keyof typeof aiProviderIcons];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label={`assistant: ${provider.name}, change`}
          title={`change assistant (${provider.name})`}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          className="home-ai-icon-button text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={provider.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {ProviderIcon && <ProviderIcon aria-hidden="true" className="size-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        collisionPadding={16}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`${labelId}-${provider.id}`)?.focus();
        }}
        onEscapeKeyDown={(event) => event.stopPropagation()}
        onCloseAutoFocus={(event) => {
          if (returnToInput.current) {
            event.preventDefault();
            returnToInput.current = false;
            onReturnToInput();
          }
        }}
        className="home-ai-picker w-60 rounded-3xl p-1.5"
      >
        <div className="px-3 pb-2 pt-2.5">
          <h2 id={labelId} className="text-sm font-medium">{config.pickerLabel}</h2>
        </div>
        <ToggleGroup.Root
          type="single"
          orientation="vertical"
          value={provider.id}
          aria-labelledby={labelId}
          className="flex flex-col gap-0.5"
        >
          {defaultAIProviders.map((item) => {
            const Icon = aiProviderIcons[item.id as keyof typeof aiProviderIcons];
            const selected = item.id === provider.id;
            return (
              <ToggleGroup.Item
                key={item.id}
                id={`${labelId}-${item.id}`}
                value={item.id}
                onClick={() => {
                  returnToInput.current = true;
                  onSelect(item);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors duration-150 focus-visible:bg-muted focus-visible:text-foreground",
                  selected
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
                <span className="flex-1 text-left">{item.name}</span>
                {selected && <Check aria-hidden="true" className="size-4 text-primary" />}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
        <p id={descriptionId} className="px-3 pb-2.5 pt-2 text-sm leading-relaxed text-muted-foreground">
          {config.handoffHint}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function HomeAskAI() {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [provider, setProvider] = useState<AIProvider>(
    defaultAIProviders.find((item) => item.id === config.defaultProvider) ?? defaultAIProviders[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [availableRef, available] = useMeasure();
  const [rowRef, row] = useMeasure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const keyboardOffset = useMotionValue(0);
  const inputId = useId();
  const hintId = useId();
  const composerWidth = available.width || 448;
  const transition = reduceMotion ? { duration: 0 } : COMPOSER_SPRING;

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!expanded || !viewport) {
      keyboardOffset.set(0);
      return;
    }
    const followKeyboard = () => {
      keyboardOffset.set(-Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
    };
    followKeyboard();
    viewport.addEventListener("resize", followKeyboard);
    viewport.addEventListener("scroll", followKeyboard);
    return () => {
      viewport.removeEventListener("resize", followKeyboard);
      viewport.removeEventListener("scroll", followKeyboard);
    };
  }, [expanded, keyboardOffset]);

  function focusInput() {
    textareaRef.current?.focus({ preventScroll: true });
  }

  function collapse() {
    setPickerOpen(false);
    setExpanded(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function toggleExpanded() {
    if (expanded) {
      collapse();
      return;
    }
    // Remove inert inside the tap so iOS can open its keyboard without waiting for the spring.
    flushSync(() => setExpanded(true));
    focusInput();
    trackEvent("ask_ai_opened", { location: "home_floating", trigger_type: "pill" });
  }

  function send() {
    const message = value.trim();
    if (!expanded || !message) return;
    const url = getProviderUrl(provider, `${config.basePrompt}\n\nMy question:\n${message}`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Escape" && !pickerOpen) {
      event.preventDefault();
      collapse();
    }
    if (event.target === textareaRef.current && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <motion.div
      ref={availableRef}
      style={{ y: keyboardOffset }}
      className="pointer-events-none flex w-full justify-end font-sans"
    >
      <motion.form
        aria-label={config.label}
        data-home-composer=""
        data-expanded={expanded}
        initial={false}
        animate={{
          width: expanded ? composerWidth : COLLAPSED_SIZE,
          height: expanded ? (row.height || 40) + 8 : COLLAPSED_SIZE,
        }}
        transition={transition}
        onKeyDown={handleKeyDown}
        onSubmit={(event) => { event.preventDefault(); send(); }}
        className="pointer-events-auto flex shrink-0 items-end overflow-hidden rounded-[24px] bg-background/90 p-1 text-foreground shadow-lg ring-1 ring-inset ring-border/70 backdrop-blur-xl"
      >
        {/* The row keeps its final width while the shell reveals it. Text never wraps during the morph. */}
        <div ref={rowRef} style={{ width: composerWidth - 8 }} className="shrink-0">
          <InputGroup className="home-ai-input">
            <InputGroupAddon align="inline-start">
              <motion.button
                ref={triggerRef}
                type="button"
                onClick={toggleExpanded}
                aria-expanded={expanded}
                aria-controls={inputId}
                aria-label={expanded ? config.closeLabel : config.label}
                title={expanded ? config.closeLabel : config.label}
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                transition={COMPOSER_SPRING}
                className="home-ai-icon-button text-foreground hover:bg-muted/60"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: expanded ? 1 : 1.1 }}
                  transition={transition}
                  className="flex items-center justify-center"
                >
                  <AIMascot
                    awake={expanded}
                    size="compact"
                    className="motion-reduce:animate-none motion-reduce:rounded-full motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none"
                  />
                </motion.span>
              </motion.button>
            </InputGroupAddon>
            <motion.div
              inert={!expanded}
              aria-hidden={!expanded}
              initial={false}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
              className="flex min-w-0 flex-1 items-end"
            >
              <div className="home-ai-textarea-wrap">
                <span aria-hidden="true" className="home-ai-textarea-mirror">{value + "\u200b"}</span>
                <InputGroupTextarea
                  ref={textareaRef}
                  id={inputId}
                  name="message"
                  rows={1}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={config.placeholder}
                  aria-label={config.inputLabel}
                  aria-describedby={hintId}
                  enterKeyHint="send"
                  autoComplete="off"
                  className="home-ai-textarea"
                />
              </div>
              <InputGroupAddon align="inline-end">
                <ProviderPicker
                  provider={provider}
                  open={pickerOpen}
                  onOpenChange={setPickerOpen}
                  onSelect={setProvider}
                  onReturnToInput={focusInput}
                />
                <motion.button
                  type="submit"
                  disabled={!value.trim()}
                  aria-label={`send to ${provider.name} (opens in a new tab)`}
                  whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  className="home-ai-icon-button text-primary-foreground disabled:cursor-default"
                >
                  <span className={cn(
                    "flex size-9 items-center justify-center rounded-full bg-primary transition-opacity duration-200",
                    !value.trim() && "opacity-30",
                  )}>
                    <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2} />
                  </span>
                </motion.button>
              </InputGroupAddon>
            </motion.div>
          </InputGroup>
        </div>
      </motion.form>
      <span id={hintId} className="sr-only">{config.handoffHint}. Enter to send, Shift+Enter for a new line.</span>
    </motion.div>
  );
}
