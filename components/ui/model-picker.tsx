"use client";

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
import { cn } from "@/lib/utils";
import {
  Brain,
  Check,
  ChevronDown,
  ImageIcon,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SVGProps,
} from "react";

export type IconProps = SVGProps<SVGSVGElement>;

/** Real Grok mark, same paths as `ask-ai`. No file lives under `public/ai/`. */
export function GrokIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" {...props}>
      <path d="M395.479 633.828 735.91 381.105c16.689-12.39 40.544-7.557 48.496 11.687 41.854 101.493 23.155 223.461-60.118 307.204-83.272 83.743-199.137 102.108-305.041 60.281l-115.691 53.866c165.934 114.059 367.431 85.852 493.345-40.861 99.875-100.439 130.807-237.345 101.884-360.806l.262.263c-41.942-181.369 10.311-253.865 117.353-402.107 2.53-3.515 5.07-7.03 7.6-10.632L883.144 141.651v-.439L395.392 633.916" />
      <path d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668c75.146-75.571 198.264-106.414 305.741-61.072l115.428-53.602c-20.797-15.114-47.448-31.371-78.03-42.794-138.234-57.206-303.731-28.735-416.101 84.182C147.234 337.081 113.244 504.215 171.613 646.833c43.603 106.59-27.874 181.985-99.875 258.083C46.224 931.893 20.622 958.87 0 987.429l325.139-292.09" />
    </svg>
  );
}

const fileLogos: Record<string, { src: string; invertInDark?: boolean }> = {
  openai: { src: "/ai/openai.svg", invertInDark: true },
  anthropic: { src: "/ai/claude.svg" },
  google: { src: "/ai/gemini.svg" },
};

export type ModelCapability = "reasoning" | "image";

export type ThinkingEffort = "none" | "low" | "medium" | "high" | "max";

export type ModelPickerModel = {
  id: string;
  name: string;
  description?: string;
  /** Defaults to true. False means the row is omitted from the list. */
  available?: boolean;
  /** Corner chips. Reasoning means the model can think. Image means it takes or makes images. */
  capabilities?: readonly ModelCapability[];
  /** Selectable thinking efforts, rendered in the footer track. Omit when the model has no thinking control. */
  thinking?: readonly ThinkingEffort[];
  defaultThinking?: ThinkingEffort;
};

export type ModelPickerProvider = {
  id: string;
  name: string;
  icon?: ReactNode;
  models: ModelPickerModel[];
};

export type ModelPickerProps = {
  providers: readonly ModelPickerProvider[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    modelId: string,
    providerId: string,
    thinking?: ThinkingEffort,
  ) => void;
  thinking?: ThinkingEffort;
  defaultThinking?: ThinkingEffort;
  /** Close the popover as soon as a model row is picked. Off by default so the thinking track stays reachable. */
  closeOnSelect?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  placeholder?: string;
  className?: string;
};

const CAPABILITY_LABEL: Record<ModelCapability, string> = {
  reasoning: "Reasoning",
  image: "Image",
};

const CAPABILITY_ICON: Record<ModelCapability, LucideIcon> = {
  reasoning: Brain,
  image: ImageIcon,
};

/** One accent per capability so the icons read apart inside the shared pill. Literal palette colors keep the file portable. */
const CAPABILITY_ACCENT: Record<ModelCapability, string> = {
  reasoning: "text-violet-500 dark:text-violet-400",
  image: "text-teal-500 dark:text-teal-400",
};

const THINKING_LABEL: Record<ThinkingEffort, string> = {
  none: "Off",
  low: "Low",
  medium: "Medium",
  high: "High",
  max: "Max",
};

const FULL_THINKING = ["low", "medium", "high", "max"] as const;
const FLASH_THINKING = ["none", "low", "medium"] as const;

/** Thin scrollbar in both engines. Literal fallbacks keep the file portable outside this site. */
const THIN_SCROLLBAR =
  "[scrollbar-color:var(--color-border,#d4d4d8)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-border,#d4d4d8)] [&::-webkit-scrollbar-track]:bg-transparent";

/** Hidden scrollbar for the narrow provider rail, where a visible track would eat the icons. */
const HIDDEN_SCROLLBAR =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export const defaultModelProviders: readonly ModelPickerProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      {
        id: "gpt-5.6-sol",
        name: "GPT-5.6 Sol",
        description: "Flagship depth for hard problems",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "medium",
      },
      {
        id: "gpt-5.6-terra",
        name: "GPT-5.6 Terra",
        description: "Balanced speed and reasoning",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "medium",
      },
      {
        id: "gpt-5.6-luna",
        name: "GPT-5.6 Luna",
        description: "Fast replies for light work",
        capabilities: ["image"],
        thinking: FLASH_THINKING,
        defaultThinking: "low",
      },
      {
        id: "gpt-5.5",
        name: "GPT-5.5",
        description: "Previous generation, still dependable",
        capabilities: ["reasoning", "image"],
        thinking: ["low", "medium", "high"],
        defaultThinking: "medium",
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      {
        id: "claude-opus-5",
        name: "Claude Opus 5",
        description: "Deepest reasoning, long context",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "high",
      },
      {
        id: "claude-sonnet-5",
        name: "Claude Sonnet 5",
        description: "Agentic coding and tool use",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "medium",
      },
      {
        id: "claude-haiku-4.5",
        name: "Claude Haiku 4.5",
        description: "Quick drafts at low cost",
        capabilities: ["image"],
      },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    models: [
      {
        id: "grok-4.6",
        name: "Grok 4.6",
        description: "Flagship with live search",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "high",
      },
      {
        id: "grok-4.20",
        name: "Grok 4.20",
        description: "Extended reasoning for tough prompts",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "high",
      },
      {
        id: "grok-4.5",
        name: "Grok 4.5",
        description: "Previous generation, broad knowledge",
        capabilities: ["reasoning", "image"],
        thinking: ["low", "medium", "high"],
        defaultThinking: "medium",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      {
        id: "gemini-3.8-flash",
        name: "Gemini 3.8 Flash",
        description: "Fast multimodal all rounder",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "medium",
      },
      {
        id: "gemini-3.1-pro",
        name: "Gemini 3.1 Pro",
        description: "Deep think for hard analysis",
        capabilities: ["reasoning", "image"],
        thinking: FULL_THINKING,
        defaultThinking: "high",
      },
      {
        id: "gemini-3.1-flash-image",
        name: "Gemini 3.1 Flash Image",
        description: "Image generation and editing",
        capabilities: ["image"],
      },
    ],
  },
];

function isAvailable(model: ModelPickerModel) {
  return model.available !== false;
}

function visibleModels(provider: ModelPickerProvider) {
  return provider.models.filter(isAvailable);
}

function visibleProviders(providers: readonly ModelPickerProvider[]) {
  return providers.filter((provider) => visibleModels(provider).length > 0);
}

/** Name, id, description, and provider name all count as a hit. */
function matchesQuery(
  model: ModelPickerModel,
  provider: ModelPickerProvider,
  query: string,
) {
  return [model.name, model.id, model.description ?? "", provider.name].some(
    (field) => field.toLowerCase().includes(query),
  );
}

function findModel(
  providers: readonly ModelPickerProvider[],
  modelId: string | undefined,
) {
  if (!modelId) return undefined;
  for (const provider of providers) {
    const model = provider.models.find((item) => item.id === modelId);
    if (model) return { provider, model };
  }
  return undefined;
}

function ProviderGlyph({
  provider,
  className,
}: {
  provider: ModelPickerProvider;
  className?: string;
}) {
  if (provider.icon) {
    return (
      <span className={cn("inline-flex size-4 items-center justify-center [&>svg]:size-full", className)}>
        {provider.icon}
      </span>
    );
  }
  const file = fileLogos[provider.id];
  if (file) {
    return (
      <Image
        src={file.src}
        alt=""
        width={16}
        height={16}
        aria-hidden="true"
        className={cn("size-4", file.invertInDark && "dark:invert", className)}
      />
    );
  }
  if (provider.id === "xai") {
    return <GrokIcon aria-hidden="true" className={cn("size-4", className)} />;
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-4 items-center justify-center text-[11px] font-medium leading-none",
        className,
      )}
    >
      {provider.name.charAt(0)}
    </span>
  );
}

function CapabilityChips({
  capabilities,
}: {
  capabilities?: readonly ModelCapability[];
}) {
  if (!capabilities?.length) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 ring-1 ring-inset ring-border/70">
      {capabilities.map((capability, index) => {
        const Icon = CAPABILITY_ICON[capability];
        const label = CAPABILITY_LABEL[capability];
        return (
          <Fragment key={capability}>
            {index > 0 ? (
              <span aria-hidden="true" className="h-3 w-px shrink-0 bg-border/70" />
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  aria-label={label}
                  className={cn(
                    "inline-flex size-4 items-center justify-center opacity-90 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 motion-reduce:transition-none",
                    CAPABILITY_ACCENT[capability],
                  )}
                >
                  <Icon aria-hidden="true" className="size-3" strokeWidth={2} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          </Fragment>
        );
      })}
    </span>
  );
}

/** Stepped bars that fill up to the current effort, each in its own accent. Decorative. */
function EffortMeter({
  levels,
  filled,
  className,
}: {
  levels: readonly ThinkingEffort[];
  filled: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("flex items-end gap-0.5", className)}>
      {levels.map((effort, index) => (
        <span
          key={effort}
          style={{ height: `${5 + index * 2.5}px` }}
          className={cn(
            "w-0.75 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            index < filled ? "bg-foreground" : "bg-border",
          )}
        />
      ))}
    </span>
  );
}

/** Segmented track with a sliding indicator. One control for the whole popover. */
function ThinkingTrack({
  levels,
  value,
  onChange,
}: {
  levels: readonly ThinkingEffort[];
  value?: ThinkingEffort;
  onChange: (effort: ThinkingEffort) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = value && levels.includes(value) ? value : levels[0];
  const activeIndex = Math.max(0, levels.indexOf(current));

  function move(index: number) {
    const next = (index + levels.length) % levels.length;
    onChange(levels[next]);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(levels.length - 1);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Thinking effort"
      className="relative flex min-w-0 flex-1 items-center rounded-full bg-muted/60 p-1 ring-1 ring-inset ring-border/60"
    >
      <span
        aria-hidden="true"
        style={{
          width: `calc((100% - 0.5rem) / ${levels.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-popover ring-1 ring-inset ring-border/70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      />
      {levels.map((effort, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={effort}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            ref={(node) => {
              refs.current[index] = node;
            }}
            onClick={() => onChange(effort)}
            onKeyDown={onKeyDown}
            className={cn(
              "relative z-10 min-w-0 flex-1 cursor-pointer touch-manipulation rounded-full px-1.5 py-1.5 text-center text-[11px] font-medium leading-none text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none",
              active && "text-foreground",
            )}
          >
            {THINKING_LABEL[effort]}
          </button>
        );
      })}
    </div>
  );
}

export function ModelPicker({
  providers,
  value,
  defaultValue,
  onValueChange,
  thinking,
  defaultThinking,
  closeOnSelect = false,
  open,
  defaultOpen = false,
  onOpenChange,
  side = "top",
  align = "start",
  placeholder = "Select a model",
  className,
}: ModelPickerProps) {
  const listId = useId();
  const rails = useMemo(() => visibleProviders(providers), [providers]);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedId = value ?? internalValue;
  const isOpen = open ?? internalOpen;
  const selected = findModel(providers, selectedId);
  const [internalThinking, setInternalThinking] = useState<ThinkingEffort | undefined>(
    defaultThinking ?? selected?.model.defaultThinking,
  );
  const selectedThinking = thinking ?? internalThinking;

  const selectedProviderId = selected?.provider.id;

  const [activeProviderId, setActiveProviderId] = useState(
    () => findModel(providers, selectedId)?.provider.id ?? rails[0]?.id ?? "",
  );

  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const searching = search.length > 0;

  const activeProvider =
    rails.find((provider) => provider.id === activeProviderId) ?? rails[0];
  /** Search spans every provider. Without a query the list stays scoped to the active rail. */
  const rows = useMemo(() => {
    if (searching) {
      return rails.flatMap((provider) =>
        visibleModels(provider)
          .filter((model) => matchesQuery(model, provider, search))
          .map((model) => ({ provider, model })),
      );
    }
    if (!activeProvider) return [];
    return visibleModels(activeProvider).map((model) => ({
      provider: activeProvider,
      model,
    }));
  }, [activeProvider, rails, search, searching]);

  const activeModelIndex = Math.max(
    0,
    rows.findIndex((row) => row.model.id === selectedId),
  );

  const providerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const modelRefs = useRef<Array<HTMLElement | null>>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  /**
   * Centre the selected provider in the rail when the panel opens. Past roughly a
   * dozen providers the rail scrolls, and the selected one can sit below the fold,
   * so the panel would otherwise open with no visible active tab.
   *
   * Keyed on the selected provider rather than the active tab so clicking through
   * the rail never yanks the scroll position out from under the pointer. The
   * double frame is needed because the popover is portalled: on the first commit
   * the rail has no height yet and any scroll would clamp to zero.
   */
  useEffect(() => {
    if (!isOpen || searching) return;
    const index = rails.findIndex(
      (provider) => provider.id === selectedProviderId,
    );
    if (index < 0) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const button = providerRefs.current[index];
        const rail = railRef.current;
        if (!button || !rail) return;
        if (rail.scrollHeight <= rail.clientHeight) return;
        const offset =
          button.offsetTop - (rail.clientHeight - button.offsetHeight) / 2;
        rail.scrollTop = Math.max(0, offset);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [isOpen, rails, searching, selectedProviderId]);

  const changeOpen = useCallback(
    (next: boolean) => {
      setInternalOpen(next);
      onOpenChange?.(next);
      setQuery("");
      if (next) {
        const owner = findModel(providers, selectedId)?.provider.id;
        if (owner) setActiveProviderId(owner);
      }
    },
    [onOpenChange, providers, selectedId],
  );

  const selectModel = useCallback(
    (modelId: string, providerId: string) => {
      const found = findModel(providers, modelId)?.model;
      const effort = found?.defaultThinking ?? found?.thinking?.[0];
      setInternalValue(modelId);
      setInternalThinking(effort);
      onValueChange?.(modelId, providerId, effort);
      if (closeOnSelect) changeOpen(false);
    },
    [changeOpen, closeOnSelect, onValueChange, providers],
  );

  const selectThinking = useCallback(
    (effort: ThinkingEffort) => {
      setInternalThinking(effort);
      if (selected) {
        onValueChange?.(selected.model.id, selected.provider.id, effort);
      }
    },
    [onValueChange, selected],
  );

  function focusProvider(index: number) {
    const next = (index + rails.length) % rails.length;
    providerRefs.current[next]?.focus();
  }

  function focusModel(index: number) {
    if (rows.length === 0) return;
    const next = (index + rows.length) % rows.length;
    modelRefs.current[next]?.focus();
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusModel(0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const first = rows[0];
      if (first) selectModel(first.model.id, first.provider.id);
    } else if (event.key === "Escape" && query) {
      event.preventDefault();
      event.stopPropagation();
      setQuery("");
    }
  }

  function onRailKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusProvider(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusProvider(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusProvider(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusProvider(rails.length - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusModel(0);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusModel(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusModel(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusModel(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusModel(rows.length - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const railIndex = rails.findIndex((provider) => provider.id === activeProvider?.id);
      providerRefs.current[railIndex]?.focus();
    }
  }

  const thinkingLevels = selected?.model.thinking;
  const effortIndex = thinkingLevels && selectedThinking
    ? thinkingLevels.indexOf(selectedThinking)
    : -1;
  const filledSteps =
    !thinkingLevels || selectedThinking === "none" || effortIndex < 0
      ? 0
      : effortIndex + 1;
  const thinkingLabel =
    thinkingLevels && selectedThinking && selectedThinking !== "none"
      ? THINKING_LABEL[selectedThinking]
      : null;
  const triggerLabel = selected?.model.name ?? placeholder;

  return (
    <TooltipProvider delayDuration={250}>
      <Popover open={isOpen} onOpenChange={changeOpen} >
        <PopoverTrigger
          type="button"
          aria-label={triggerLabel}
          aria-haspopup="listbox"
          className={cn(
            "inline-flex h-11 max-w-full cursor-pointer touch-manipulation items-center gap-2 rounded-full bg-background px-3 text-sm font-medium tracking-tight text-foreground ring-1 ring-inset ring-border/80 transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted/70 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted/70 motion-reduce:transition-none motion-reduce:active:scale-100 sm:px-4",
            className,
          )}
        >
          {selected ? (
            <span className="inline-flex size-6 shrink-0 items-center justify-center text-foreground sm:size-7">
              <ProviderGlyph provider={selected.provider} />
            </span>
          ) : null}
          <span className="min-w-0 truncate" translate="no">
            {triggerLabel}
          </span>
          {thinkingLabel ? (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
              <EffortMeter levels={thinkingLevels ?? []} filled={filledSteps} />
              
            </span>
          ) : null}
          <ChevronDown
            aria-hidden="true"
            className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-[open=true]:rotate-180"
            data-open={isOpen}
          />
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={10}
          // Pinned to `side`. Collision flipping is what made the panel open above the
          // trigger at one scroll position and below it at the next.
          avoidCollisions={false}
          className="max-h-[calc(100dvh-2rem)] w-[min(26rem,calc(100vw-1.5rem))] gap-0 overflow-hidden overscroll-contain rounded-xl p-0"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() => {
              searchRef.current?.focus();
            });
          }}
        >
          {rails.length === 0 || !activeProvider ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">No models available</p>
          ) : (
            <div className="flex min-w-0 flex-col">
             
              <div className="flex min-h-52 bg-muted">
                {/*
                  The rail scroller is taken out of flow so a long provider list cannot
                  inflate the row. Left in flow it grows to its natural height and drags
                  the panel off screen instead of scrolling, because `overflow-y-auto`
                  needs a bounded height and a stretched flex item never gets one here.
                  Out of flow, the row height comes from the model column and the rail
                  scrolls inside it at any provider count.
                */}
                <div className="relative w-12 shrink-0 bg-muted sm:w-14">
                <div
                  role="tablist"
                  aria-label="Providers"
                  aria-orientation="vertical"
                  ref={railRef}
                  className={cn(
                    "absolute inset-0 flex flex-col gap-1.5 overflow-y-auto overscroll-contain p-1.5",
                    HIDDEN_SCROLLBAR,
                  )}
                >
                  {rails.map((provider, index) => {
                    const selectedRail = provider.id === activeProvider.id;
                    return (
                      <Tooltip key={provider.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            role="tab"
                            id={`${listId}-tab-${provider.id}`}
                            aria-label={provider.name}
                            aria-selected={selectedRail}
                            aria-controls={listId}
                            tabIndex={selectedRail ? 0 : -1}
                            ref={(node) => {
                              providerRefs.current[index] = node;
                            }}
                            onClick={() => {
                              setQuery("");
                              setActiveProviderId(provider.id);
                            }}
                            onKeyDown={(event) => onRailKeyDown(event, index)}
                            className={cn(
                              "inline-flex size-9 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl text-muted-foreground transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-popover/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none sm:size-11",
                              selectedRail &&
                                !searching &&
                                "bg-popover text-foreground ring-1 ring-inset ring-border/60",
                            )}
                          >
                            <ProviderGlyph provider={provider} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs" translate="no">
                          {provider.name}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                </div>
        <div className="flex min-w-0 flex-1 flex-col">
  <div className="flex shrink-0 items-center gap-2 bg-muted px-3 py-2">
                <Search
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search models"
                  aria-label="Search models"
                  aria-controls={listId}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-6 w-full min-w-0 bg-transparent text-sm tracking-tight text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                    className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-popover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
                  >
                    <X aria-hidden="true" className="size-3" strokeWidth={2} />
                  </button>
                ) : null}
              </div>
        
                <div
                  key={searching ? "search" : activeProvider.id}
                  className="flex min-w-0 flex-1 flex-col rounded-tl-lg bg-popover p-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
                >
                  <p
                    className="px-2.5 pb-1.5 pt-1 font-mono text-[11px] text-muted-foreground"
                    translate="no"
                  >
                    {searching
                      ? `${rows.length} ${rows.length === 1 ? "result" : "results"}`
                      : activeProvider.name}
                  </p>
                  <div
                    role="listbox"
                    id={listId}
                    aria-label={searching ? "Search results" : `${activeProvider.name} models`}
                    className={cn(
                      "-mr-1 flex max-h-[min(16rem,42dvh)] min-w-0 flex-col gap-0.5 overflow-y-auto overscroll-contain pr-1",
                      THIN_SCROLLBAR,
                    )}
                  >
                    {rows.length === 0 ? (
                      <p
                        role="presentation"
                        className="px-2.5 py-6 text-center text-[11px] text-muted-foreground"
                      >
                        {`No models match "${query.trim()}"`}
                      </p>
                    ) : null}
                    {rows.map(({ provider, model }, index) => {
                      const isSelected = model.id === selectedId;
                      return (
                        <div
                          key={model.id}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={index === activeModelIndex ? 0 : -1}
                          ref={(node) => {
                            modelRefs.current[index] = node;
                          }}
                          onClick={() => selectModel(model.id, provider.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              selectModel(model.id, provider.id);
                              return;
                            }
                            onListKeyDown(event, index);
                          }}
                          className={cn(
                            "flex min-h-11 w-full min-w-0 cursor-pointer touch-manipulation items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-[background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                            isSelected && "bg-muted",
                          )}
                        >
                          {searching ? (
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-border/60">
                              <ProviderGlyph provider={provider} />
                            </span>
                          ) : null}
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="flex w-full min-w-0 items-center gap-1.5">
                              <span
                                className="min-w-0 truncate text-sm font-medium tracking-tight"
                                translate="no"
                              >
                                {model.name}
                              </span>
                              {isSelected ? (
                                <Check aria-hidden="true" className="size-3.5 shrink-0 text-foreground" />
                              ) : null}
                            </span>
                            {model.description ? (
                              <span className="w-full truncate text-[11px] leading-snug text-muted-foreground">
                                {model.description}
                              </span>
                            ) : null}
                          </span>
                          <CapabilityChips capabilities={model.capabilities} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2 bg-popover p-2 sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:py-2">
                <span className="flex shrink-0 items-center gap-2 px-1 sm:px-0">
                  <EffortMeter
                    levels={thinkingLevels ?? FULL_THINKING}
                    filled={filledSteps}
                  />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Thinking
                  </span>
                </span>
                {thinkingLevels?.length ? (
                  <ThinkingTrack
                    levels={thinkingLevels}
                    value={selectedThinking}
                    onChange={selectThinking}
                  />
                ) : (
                  <span className="px-1 text-[11px] text-muted-foreground sm:px-0">
                    {selected
                      ? "Not available for this model"
                      : "Select a model to set the effort"}
                  </span>
                )}
              </div>
              </div>
</div>
              
            </div>
          )}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
