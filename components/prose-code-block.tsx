"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Wraps a markdown-rendered <pre> with a copy button. The <pre> arrives via
 * `children` (see markdown-components.tsx), so this only adds the wrapper —
 * no second <pre>. Reads the text from the inner <code> via a ref so it never
 * needs to touch the raw markdown string.
 */
export function ProseCodeBlock({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<number | undefined>(undefined);

  const handleCopy = useCallback(() => {
    const text = wrapperRef.current?.querySelector("code")?.innerText ?? "";
    if (!text || typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.clearTimeout(resetRef.current);
        resetRef.current = window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, []);

  return (
    <div ref={wrapperRef} className="relative group/prose-code">
      {children}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="copy code"
            className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground opacity-0 group-hover/prose-code:opacity-100 transition-opacity hover:bg-muted/40 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "copied!" : "copy"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}