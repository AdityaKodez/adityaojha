"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type MascotGaze = "up" | "down" | "left" | "right";

export function AIMascot({
  awake = false,
  gaze,
  size = "default",
  brand = false,
  className,
}: {
  awake?: boolean;
  /** Direction the eyes look while awake: point it at the popover. */
  gaze?: MascotGaze;
  size?: "default" | "compact";
  brand?: boolean;
  className?: string;
}) {
  const eyeShift = !awake
    ? "translate-x-px -translate-y-px"
    : gaze === "down"
      ? "translate-x-px translate-y-1"
      : gaze === "left"
        ? "-translate-x-1 -translate-y-px"
        : gaze === "right"
          ? "translate-x-1 -translate-y-px"
          : "translate-x-px -translate-y-1";

  return (
    <span
      aria-hidden="true"
      data-awake={awake}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground animate-[ai-mascot-blob_9s_ease-in-out_infinite] transition-transform duration-[440ms] ease-[cubic-bezier(.22,1.5,.5,1)]",
        brand
          ? "h-[22px] w-[22px] shadow-none"
          : size === "compact"
            ? "h-7 w-7 shadow-none"
            : "h-10 w-10 rotate-[-7deg] shadow-[inset_0_2px_1px_color-mix(in_srgb,var(--primary-foreground)_19%,transparent),inset_0_-3px_2px_color-mix(in_srgb,var(--foreground)_12%,transparent),0_3px_6px_color-mix(in_srgb,var(--primary)_14%,transparent)] data-[awake=true]:rotate-6 data-[awake=true]:scale-[1.05]",
        className
      )}
    >
      <span
        className={cn(
          "flex transition-transform duration-300",
          brand
            ? "gap-1"
            : size === "compact"
              ? "gap-[5px]"
              : cn("gap-2 transition-transform", eyeShift)
        )}
      >
        <span
          className={cn(
            "block animate-[ai-mascot-blink_6.5s_infinite] rounded-[5px] bg-current",
            brand ? "h-[5px] w-[2.5px]" : size === "compact" ? "h-[7px] w-[3px]" : "h-2.5 w-1"
          )}
        />
        <span
          className={cn(
            "block animate-[ai-mascot-blink_6.5s_infinite] rounded-[5px] bg-current",
            brand ? "h-[5px] w-[2.5px]" : size === "compact" ? "h-[7px] w-[3px]" : "h-2.5 w-1"
          )}
        />
      </span>
      <style>{`
        @keyframes ai-mascot-blob {
          0%, 100% { border-radius: 58% 42% 55% 45% / 52% 58% 42% 48%; }
          33% { border-radius: 45% 55% 48% 52% / 58% 44% 56% 42%; }
          66% { border-radius: 52% 48% 42% 58% / 45% 52% 48% 55%; }
        }
        @keyframes ai-mascot-blink {
          0%, 42%, 46%, 100% { transform: scaleY(1); }
          44% { transform: scaleY(.12); }
        }
      `}</style>
    </span>
  );
}

export type IconProps = React.SVGProps<SVGSVGElement>;

export function OpenAIIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 260" fill="currentColor" {...props}>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  );
}

export function ClaudeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 257" fill="currentColor" {...props}>
      <path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
    </svg>
  );
}

export function GeminiIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296 298" fill="none" {...props}>
      <mask
        id="gemini__a"
        width="296"
        height="298"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          fill="#3186FF"
          d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z"
        />
      </mask>
      <g
        mask="url(#gemini__a)"
        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <g filter="url(#gemini__b)">
          <ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159" />
        </g>
        <g filter="url(#gemini__c)">
          <ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5" />
        </g>
        <g filter="url(#gemini__d)">
          <ellipse cx="19.5" cy="148.5" fill="#F6C013" rx="68.5" ry="72.5" />
        </g>
        <g filter="url(#gemini__e)">
          <path
            fill="#FA4340"
            d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z"
          />
        </g>
        <g filter="url(#gemini__f)">
          <path
            fill="#FA4340"
            d="M190.5-12.5C168.5 59.5 62 111.333 19 112L140.5-89l50 76.5Z"
          />
        </g>
        <g filter="url(#gemini__g)">
          <path
            fill="#14BB69"
            d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z"
          />
        </g>
        <g filter="url(#gemini__h)">
          <path
            fill="#14BB69"
            d="M196.5 320.5C174.5 248.5 68 196.667 25 196l121.5 201 50-76.5Z"
          />
        </g>
      </g>
      <path
        className="fill-current transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
        d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z"
      />
      <defs>
        <filter
          id="gemini__b"
          width="464"
          height="390"
          x="-69"
          y="-46"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="18" />
        </filter>
        <filter
          id="gemini__c"
          width="265"
          height="273"
          x="-99"
          y="6"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
        <filter
          id="gemini__d"
          width="265"
          height="273"
          x="-113"
          y="12"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
        <filter
          id="gemini__e"
          width="299.5"
          height="329"
          x="-41.5"
          y="-130"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
        <filter
          id="gemini__f"
          width="299.5"
          height="329"
          x="-45"
          y="-153"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
        <filter
          id="gemini__g"
          width="299.5"
          height="329"
          x="-41"
          y="91"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
        <filter
          id="gemini__h"
          width="299.5"
          height="329"
          x="-39"
          y="132"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
        </filter>
      </defs>
    </svg>
  );
}

export function PerplexityIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99" />
      <path d="M13.73 31.396H9.44V16.573h29.12v14.823h-4.29" />
      <path d="M24 16.573L34.27 27.01v14.407L24 31.073" />
    </svg>
  );
}

export const aiProviderIcons = {
  chatgpt: OpenAIIcon,
  claude: ClaudeIcon,
  gemini: GeminiIcon,
  perplexity: PerplexityIcon,
} as const;

export type AIProvider = {
  id: string;
  name: string;
  url: string;
  promptParam?: string;
  brandColor: string;
};

export const defaultAIProviders: readonly AIProvider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    promptParam: "q",
    brandColor: "var(--foreground)",
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/new",
    promptParam: "q",
    brandColor: "#D97757",
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/app",
    brandColor: "#82C8E5",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai/search",
    promptParam: "q",
    brandColor: "#20B8CD",
  },
];

export function getProviderUrl(provider: AIProvider, prompt: string) {
  const url = new URL(provider.url);
  if (url.protocol !== "https:") {
    throw new Error("AI provider URLs must use HTTPS.");
  }
  if (provider.promptParam) {
    url.searchParams.set(provider.promptParam, prompt);
  }
  return url.toString();
}

export type AskAIProps = {
  prompt: string;
  title?: string;
  description?: string;
  label?: string;
  /** Optional tooltip text shown on hover. When blobOnly is true, defaults to label or "ask an ai". */
  tooltip?: string;
  /** Render only the mascot blob in a circular trigger without the label text. */
  blobOnly?: boolean;
  providers?: readonly AIProvider[];
  size?: "default" | "compact";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export function AskAI({
  prompt,
  title = "Ask an AI about me",
  description = "A fresh perspective, from your favorite assistant.",
  label = "Ask an AI",
  tooltip,
  blobOnly = false,
  providers = defaultAIProviders,
  size = "default",
  side = "top",
  align = "start",
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  style,
}: AskAIProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fallbackPrompt, setFallbackPrompt] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = open ?? internalOpen;

  useEffect(() => () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
  }, []);

  function changeOpen(next: boolean) {
    setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setFallbackPrompt(false);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setFallbackPrompt(false);
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setFallbackPrompt(true);
    }
  }

  const tooltipText = tooltip ?? (blobOnly ? label : undefined);

  const triggerButton = (
    <PopoverTrigger
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center text-foreground transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        blobOnly
          ? cn(
              "rounded-full bg-background/80 backdrop-blur-md ring-1 ring-inset ring-border/60 shadow-sm hover:bg-muted/50 hover:shadow-md",
              size === "compact" ? "size-11" : "size-14"
            )
          : cn(
              "h-14 gap-4 rounded-full bg-muted/30 ps-5 pe-3 text-base font-medium tracking-tight data-[size=compact]:h-11 data-[size=compact]:gap-3 data-[size=compact]:rounded-[13px] data-[size=compact]:ps-3.5 data-[size=compact]:pe-[9px] data-[size=compact]:text-sm"
            ),
        className
      )}
      data-size={size}
      style={style}
      aria-label={blobOnly ? tooltipText || label : undefined}
    >
      {!blobOnly && <span>{label}</span>}
      <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
        <AIMascot
          awake={isOpen}
          gaze={side === "top" ? "up" : side === "bottom" ? "down" : side}
          size={size}
        />
      </span>
    </PopoverTrigger>
  );

  return (
    <TooltipProvider delayDuration={250}>
      <Popover open={isOpen} onOpenChange={changeOpen}>
        {tooltipText ? (
          <Tooltip
            open={isOpen ? false : tooltipOpen}
            onOpenChange={(next) => setTooltipOpen(isOpen ? false : next)}
          >
            <TooltipTrigger asChild>
              {triggerButton}
            </TooltipTrigger>
            <TooltipContent side={side === "top" ? "left" : "top"} className="text-xs">
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        ) : (
          triggerButton
        )}
        <PopoverContent
          side={side}
          align={align}
          sideOffset={16}
          autoFocus={false}
          className="w-[330px] sm:w-96 max-w-[calc(100vw-24px)] gap-0 rounded-[20px] sm:rounded-[25px] bg-background p-4 sm:px-5 sm:pt-5 sm:pb-4 text-foreground shadow-xl ring-1 ring-inset ring-border/50"
        >
          <PopoverTitle className="text-sm sm:text-base font-medium tracking-tight">
            {title}
          </PopoverTitle>
          <PopoverDescription className="mt-1 sm:mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {description}
          </PopoverDescription>
          <div className="mt-3.5 sm:mt-[23px] flex gap-1 sm:gap-1.5" aria-label="Choose your AI assistant">
            {providers.map((provider) => {
              const Icon = aiProviderIcons[provider.id as keyof typeof aiProviderIcons];
              return (
                <Tooltip key={provider.id}>
                  <TooltipTrigger asChild>
                    <a
                      href={getProviderUrl(provider, prompt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ "--brand": provider.brandColor } as CSSProperties}
                      className="group bg-muted hover:bg-background relative flex h-16 sm:h-[77px] min-w-0 flex-1 items-center justify-center rounded-[12px] sm:rounded-[15px] bg-card text-foreground/50 duration-200 ease-out hover:-translate-y-1 hover:text-[var(--brand)] focus-visible:-translate-y-1 focus-visible:bg-primary/[0.08] focus-visible:text-[var(--brand)] focus-visible:shadow-[0_6px_10px_-5px_color-mix(in_srgb,var(--primary)_18%,transparent)] focus-visible:outline-none first:rounded-[16px_12px_12px_16px] sm:first:rounded-[21px_15px_15px_21px] last:rounded-[12px_16px_16px_12px] sm:last:rounded-[15px_21px_21px_15px]"
                      aria-label={`Ask ${provider.name} (opens in a new tab)${!provider.promptParam ? "; copies prompt to paste" : ""}`}
                      onClick={() => {
                        if (!provider.promptParam) void copyPrompt();
                      }}
                    >
                      {Icon ? (
                        <Icon
                          aria-hidden="true"
                          className="size-[22px] sm:size-[27px] transition-transform duration-200 group-hover:-translate-y-1 sm:group-hover:-translate-y-[7px] group-hover:scale-[.92] group-focus-visible:-translate-y-1 sm:group-focus-visible:-translate-y-[7px] group-focus-visible:scale-[.92]"
                        />
                      ) : null}
                      <span className="absolute bottom-1.5 sm:bottom-2 translate-y-1 text-[9px] sm:text-[10px] opacity-0 transition-[opacity,transform] duration-[180ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        {provider.name}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="absolute right-1 sm:right-[7px] top-1 sm:top-[7px] size-2.5 sm:size-[11px] text-primary opacity-0 transition-opacity duration-[180ms] group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    {provider.promptParam ? `open ${provider.name}` : `copy prompt & open ${provider.name}`}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-2.5 sm:mt-3 flex min-h-9 sm:min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-3 sm:[&_svg]:size-3.5"
            onClick={() => void copyPrompt()}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            <span>{copied ? "copied!" : "copy the prompt instead"}</span>
          </button>

          {fallbackPrompt && (
            <textarea
              className="mt-2.5 sm:mt-3 w-full rounded-lg border border-border bg-background p-2 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              aria-label="Select and copy this prompt"
              readOnly
              value={prompt}
              onFocus={(event) => event.currentTarget.select()}
              rows={3}
            />
          )}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
