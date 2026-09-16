"use client";

import { clsx, type ClassValue } from "clsx";
import {
  Brain,
  Check,
  ChevronDown,
  ImageIcon,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Popover as PopoverPrimitive,
  Tooltip as TooltipPrimitive,
} from "radix-ui";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex w-72 origin-[var(--radix-popover-content-transform-origin)] flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  hideArrow = false,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content> & {
  hideArrow?: boolean;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-[var(--radix-tooltip-content-transform-origin)] items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {!hideArrow && (
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export type IconProps = SVGProps<SVGSVGElement>;

export function OpenAIIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 260" fill="currentColor" {...props}>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  );
}

export function ClaudeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 257" fill="#D97757" {...props}>
      <path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
    </svg>
  );
}

export function GeminiIcon(props: IconProps) {
  const rawId = useId();
  const id = useMemo(() => rawId.replace(/:/g, ""), [rawId]);
  return (
    <svg viewBox="0 0 296 298" xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <mask id={`${id}-mask`} width="296" height="298" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
        <path fill="#3186FF" d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
      </mask>
      <g mask={`url(#${id}-mask)`}>
        <g filter={`url(#${id}-b)`}><ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159" /></g>
        <g filter={`url(#${id}-c)`}><ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5" /></g>
        <g filter={`url(#${id}-d)`}><ellipse cx="19.5" cy="148.5" fill="#F6C013" rx="68.5" ry="72.5" /></g>
        <g filter={`url(#${id}-e)`}><path fill="#FA4340" d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z" /></g>
        <g filter={`url(#${id}-f)`}><path fill="#FA4340" d="M190.5-12.5C168.5 59.5 62 111.333 19 112L140.5-89l50 76.5Z" /></g>
        <g filter={`url(#${id}-g)`}><path fill="#14BB69" d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z" /></g>
        <g filter={`url(#${id}-h)`}><path fill="#14BB69" d="M196.5 320.5C174.5 248.5 68 196.667 25 196l121.5 201 50-76.5Z" /></g>
      </g>
      <defs>
        <filter id={`${id}-b`} width="464" height="390" x="-69" y="-46" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="18" /></filter>
        <filter id={`${id}-c`} width="265" height="273" x="-99" y="6" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
        <filter id={`${id}-d`} width="265" height="273" x="-113" y="12" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
        <filter id={`${id}-e`} width="299.5" height="329" x="-41.5" y="-130" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
        <filter id={`${id}-f`} width="299.5" height="329" x="-45" y="-153" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
        <filter id={`${id}-g`} width="299.5" height="329" x="-41" y="91" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
        <filter id={`${id}-h`} width="299.5" height="329" x="-39" y="132" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" /></filter>
      </defs>
    </svg>
  );
}

/** Real Grok mark, same paths as `ask-ai`. */
export function GrokIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" {...props}>
      <path d="M395.479 633.828 735.91 381.105c16.689-12.39 40.544-7.557 48.496 11.687 41.854 101.493 23.155 223.461-60.118 307.204-83.272 83.743-199.137 102.108-305.041 60.281l-115.691 53.866c165.934 114.059 367.431 85.852 493.345-40.861 99.875-100.439 130.807-237.345 101.884-360.806l.262.263c-41.942-181.369 10.311-253.865 117.353-402.107 2.53-3.515 5.07-7.03 7.6-10.632L883.144 141.651v-.439L395.392 633.916" />
      <path d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668c75.146-75.571 198.264-106.414 305.741-61.072l115.428-53.602c-20.797-15.114-47.448-31.371-78.03-42.794-138.234-57.206-303.731-28.735-416.101 84.182C147.234 337.081 113.244 504.215 171.613 646.833c43.603 106.59-27.874 181.985-99.875 258.083C46.224 931.893 20.622 958.87 0 987.429l325.139-292.09" />
    </svg>
  );
}

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
  if (provider.id === "openai") {
    return <OpenAIIcon aria-hidden="true" className={cn("size-4", className)} />;
  }
  if (provider.id === "anthropic") {
    return <ClaudeIcon aria-hidden="true" className={cn("size-4", className)} />;
  }
  if (provider.id === "google") {
    return <GeminiIcon aria-hidden="true" className={cn("size-4", className)} />;
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
