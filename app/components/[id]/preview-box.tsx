"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Check, Code2, Expand } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Tab = "preview" | "code";

export type PreviewBoxProps = {
  preview: ReactNode;
  /** Pre-rendered syntax-highlighted HTML for the Code tab. */
  codeHtml: string;
  /** Raw source string for clipboard copy. */
  rawCode: string;
  /** Optional title shown above the box (only used for accessibility). */
  ariaLabel?: string;
};

export function PreviewBox({
  preview,
  codeHtml,
  rawCode,
  ariaLabel,
}: PreviewBoxProps) {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [rawCode]);

  const handleExpand = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen?.();
    }
  }, []);

  // Esc to leave fullscreen
  useEffect(() => {
    const onChange = () => {
      // no-op; browser handles UI automatically
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-label={ariaLabel}
      className={cn(
        "group/preview relative mx-6 my-4 overflow-hidden rounded-md border border-dashed bg-muted/10"
      )}
    >
      {/* Blueprint overlay */}
      <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />
      {/* Hairline ring */}
      <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-muted-foreground/5" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between border-b border-dashed bg-background/60 px-3 py-2 backdrop-blur-sm">
        {/* Tabs */}
        <div className="inline-flex rounded-sm border border-dashed p-0.5">
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={cn(
                "rounded-sm px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
                activeTab === tab
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleExpand}
                aria-label="Toggle fullscreen preview"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                <Expand className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy source to clipboard"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Code2 className="h-3.5 w-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy source"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Body */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[420px] items-center justify-center px-6 py-8"
            >
              {preview}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-x-auto"
            >
              <div
                className="text-[12.5px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
