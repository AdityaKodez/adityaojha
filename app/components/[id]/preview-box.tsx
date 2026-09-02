"use client";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Check, Copy } from "lucide-react";
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

const TABS = ["preview", "code"] as const;

const TAB_LABELS: Record<Tab, string> = {
  preview: "preview",
  code: "code",
};

export type PreviewBoxProps = {
  preview: ReactNode;
  /** Pre-rendered syntax-highlighted HTML for the Code tab. */
  codeHtml: string;
  /** Raw source string for clipboard copy. */
  rawCode: string;
  /** Optional title shown above the box (only used for accessibility). */
  ariaLabel?: string;
  /** Component identifier for analytics attribution. */
  componentId?: string;
};

export function PreviewBox({
  preview,
  codeHtml,
  rawCode,
  ariaLabel,
  componentId = "unknown",
}: PreviewBoxProps) {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  // The highlighted markup is large and only useful on demand, so it isn't
  // parsed until the Code tab is first opened. It stays mounted after that:
  // re-parsing it on every toggle would reintroduce the cost we just avoided.
  const [codeMounted, setCodeMounted] = useState(false);
  const copyResetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyResetTimer.current), []);

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    if (tab === "code") setCodeMounted(true);
    trackEvent("component_tab_switched", {
      component_id: componentId,
      tab,
    });
  }, [componentId]);

  const handleCopy = useCallback(() => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(rawCode)
      .then(() => {
        setCopied(true);
        trackEvent("component_demo_source_copied", {
          component_id: componentId,
        });
        window.clearTimeout(copyResetTimer.current);
        copyResetTimer.current = window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Rejected on insecure origins or when permission is denied. Fall back
        // to the idle icon instead of leaving an unhandled rejection behind.
        setCopied(false);
      });
  }, [rawCode, componentId]);

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "preview-box relative mx-3 my-4 overflow-hidden rounded-md border bg-muted/10 sm:mx-6",
      )}
    >
      {/* Blueprint overlay — decorative only, so its paint is fully isolated
          from the box contents. */}
      <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40 contain:strict" />
      {/* Hairline ring */}
      <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-muted-foreground/5" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between gap-2 border-b bg-background/60 px-2 py-2 sm:px-3">
        {/* Tabs */}
        <div className="inline-flex rounded-sm border p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              aria-pressed={activeTab === tab}
              className={cn(
                "rounded-sm px-3 py-1 text-xs font-pixel tracking-wider transition-colors",
                activeTab === tab
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="copy source to clipboard"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "copied!" : "copy source"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Body — one grid cell holds both panes, so the height is resolved once
          from the preview and is identical on either tab. */}
      <div className="preview-body relative">
        <div
          data-active={activeTab === "preview"}
          className="preview-pane flex px-4 py-6 sm:px-6 sm:py-8"
        >
          {/* m-auto centers small demos in both axes, but degrades to
              top-aligned when the content overflows — flexbox centering
              would clip the top of scrollable previews. */}
          <div className="m-auto flex w-full justify-center">{preview}</div>
        </div>

        <div
          data-active={activeTab === "code"}
          className="preview-pane preview-pane--code"
        >
          {codeMounted ? (
            <div
              className="px-3 py-3 font-mono text-[12.5px] leading-relaxed sm:px-4"
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
