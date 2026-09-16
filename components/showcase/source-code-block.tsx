"use client";

import { Check, ChevronDown, Copy, X } from "lucide-react";
import { useId, useState } from "react";
import { SiReact } from "react-icons/si";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trackEvent } from "@/lib/analytics";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

export type SourceCodeFile = {
  /** Destination path in a consumer project, shown as the block header. */
  path: string;
  /** Pre-rendered Shiki markup. */
  html: string;
  /** Raw source for clipboard copy. */
  raw: string;
};

export type SourceCodeBlockProps = {
  files: SourceCodeFile[];
  /** Component identifier for analytics attribution. */
  componentId?: string;
  className?: string;
};

function fileName(filePath: string) {
  return filePath.split("/").pop() ?? filePath;
}

function isReactFile(filePath: string) {
  return /\.(jsx|tsx)$/i.test(filePath);
}

function ReactFileIcon({ filePath }: { filePath: string }) {
  if (!isReactFile(filePath)) return null;

  return (
    <SiReact
      aria-hidden="true"
      className="size-3 shrink-0 text-[#61dafb]"
    />
  );
}

/**
 * The full source of a registry item, ready to paste.
 *
 * Long files are clipped to a readable height and faded out at the bottom
 * rather than pushing the rest of the page down. Every file ships in the
 * markup, so expanding is a class change, not a fetch.
 */
export function SourceCodeBlock({
  files,
  componentId = "unknown",
  className,
}: SourceCodeBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { status, copy } = useCopy();
  const regionId = useId();

  const active = files[activeIndex];
  if (!active) return null;

  const lineCount = active.raw.trimEnd().split("\n").length;
  const isLong = lineCount > 24;

  const selectFile = (index: number) => {
    setActiveIndex(index);
    setExpanded(false);
  };

  const handleCopy = () => {
    void copy(active.raw);
    trackEvent("component_source_copied", {
      component_id: componentId,
      file: active.path,
    });
  };

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      trackEvent("component_source_expanded", {
        component_id: componentId,
        file: active.path,
      });
    }
  };

  return (
    <div className={cn("relative", className)}>
      {files.length > 1 && (
        <div className="flex w-fit flex-wrap items-center gap-1 rounded-t-lg border bg-background">
          {files.map((file, index) => (
            <button
              key={file.path}
              type="button"
              onClick={() => selectFile(index)}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative flex items-center gap-1.5 rounded-t-lg px-2 py-1 text-[10px] tracking-wider micro-transition",
                index === activeIndex
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ReactFileIcon filePath={file.path} />
              {fileName(file.path)}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "relative border p-0.5 bg-muted/30",
          files.length > 1 ? "rounded-tl-none rounded-b-lg rounded-r-lg" : "rounded-lg",
        )}
      >
        <div className="relative overflow-hidden rounded-md border bg-muted/30">



          {/* Header — destination path and copy affordance. */}
          <div className="relative flex items-center gap-3 px-3 py-2 sm:px-4 mb-1">
            <span className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <ReactFileIcon filePath={active.path} />
              <span className="truncate">{active.path}</span>
            </span>
            <span className="shrink-0 text-[8px] text-muted-foreground/60">
              {lineCount} lines
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy file to clipboard"
                  className="flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {status === "copied" ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : status === "error" ? (
                    <X className="size-3.5 text-destructive" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {status === "copied"
                    ? "Copied!"
                    : status === "error"
                      ? "Copy failed"
                      : "Copy file"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Source. Collapsed height keeps a long file from swallowing the page;
              expanded it scrolls rather than growing without a bound. */}
          <div className="relative rounded-t-lg bg-background">
            <div
              id={regionId}
              className={cn(
                "no-scrollbar overflow-x-auto px-3 pb-3 pt-2 font-mono text-[12.5px] leading-relaxed sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                isLong && !expanded && "max-h-72 overflow-y-hidden",
                isLong && expanded && "max-h-[36rem] overflow-y-auto",
              )}
              dangerouslySetInnerHTML={{ __html: active.html }}
            />

            {isLong && !expanded && (
              <>
                {/* Gradient wash plus a masked blur, so the clipped edge reads as
                    "there is more" instead of a hard cut. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/85 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black,transparent)]"
                />
              </>
            )}
          </div>

          {isLong && (
            <div className="relative flex justify-center border-dashed bg-background">
              <button
                type="button"
                onClick={toggle}
                aria-expanded={expanded}
                aria-controls={regionId}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-wider text-muted-foreground micro-transition hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {expanded ? "Show less" : `Show all`}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3 transition-transform duration-200 motion-reduce:transition-none",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
