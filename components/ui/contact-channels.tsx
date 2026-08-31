"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon, Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export type ContactChannelAction = "copy" | "external";

export interface ContactChannelItem {
  id: string;
  platform: string;
  handle?: string;
  href?: string;
  action?: ContactChannelAction;
  /** Text placed on the clipboard when `action` is `"copy"`. */
  copyValue?: string;
  /** Tooltip label. Falls back to `"copy"` / the platform name. */
  tooltip?: string;
  /** Single keyboard key that triggers the copy action. */
  shortcutKey?: string;
  icon?: ReactNode;
}

export interface ContactChannelsProps {
  items: ContactChannelItem[];
  /** Grid column count (collapses to one column on small screens). */
  columns?: 1 | 2 | 3;
  className?: string;
}

const COLUMN_CLASSES: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 max-sm:grid-cols-1",
  3: "grid-cols-3 max-sm:grid-cols-1",
};

/** Inline kbd, styled for use inside a tooltip. */
function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="pointer-events-none ml-1 inline-flex h-5 min-w-5 select-none items-center justify-center rounded-sm bg-background/20 px-1 font-sans text-xs font-medium text-background">
      {children}
    </kbd>
  );
}

export function ContactChannels({
  items,
  columns = 2,
  className,
}: ContactChannelsProps) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyItems = useMemo(
    () => items.filter((item) => item.action === "copy" && item.copyValue),
    [items],
  );

  const handleCopy = useCallback((item: ContactChannelItem) => {
    if (!item.copyValue) {
      return;
    }
    navigator.clipboard.writeText(item.copyValue);
    setCopied((prev) => ({ ...prev, [item.id]: true }));
    window.setTimeout(
      () => setCopied((prev) => ({ ...prev, [item.id]: false })),
      2000,
    );
  }, []);

  // Single-key copy shortcuts. Ignored while typing in editable targets.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const target = copyItems.find(
        (item) => item.shortcutKey?.toLowerCase() === e.key.toLowerCase(),
      );
      if (!target) {
        return;
      }

      e.preventDefault();
      handleCopy(target);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyItems, handleCopy]);

  return (
    <div
      className={cn(
        "grid w-full overflow-hidden border-t border-l border-dashed",
        COLUMN_CLASSES[columns],
        className,
      )}
    >
      {items.map((item, idx) => {
        const isCopyAction = item.action === "copy";
        const isCopied = Boolean(copied[item.id]);

        const cellContent = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.22,
              delay: idx * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex h-full items-center gap-3 overflow-hidden p-4 text-left transition-colors group-hover:bg-muted/10 group-focus-visible:bg-muted/10"
          >
            <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-45 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 transition-colors group-hover:ring-muted-foreground/10 group-focus-visible:ring-muted-foreground/10" />

            <div className="relative z-10 flex w-full items-center gap-3">
              {item.icon ? (
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-all group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 group-hover:text-foreground group-focus-visible:text-foreground">
                  {item.icon}
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                </div>
              ) : null}

              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium leading-none">
                  {item.platform}
                </span>
                {item.handle ? (
                  <span className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    {item.handle}
                  </span>
                ) : null}
              </div>

              {isCopyAction ? (
                <div className="ml-auto">
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground" />
                  )}
                </div>
              ) : (
                <ArrowRightIcon className="ml-auto size-3.5 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:-rotate-45 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:-rotate-45 group-focus-visible:text-primary" />
              )}
            </div>
          </motion.div>
        );

        if (isCopyAction) {
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  className="group block w-full border-b border-r border-dashed text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
                >
                  {cellContent}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isCopied ? "copied!" : item.tooltip ?? "copy"}
                  {item.shortcutKey ? <Kbd>{item.shortcutKey}</Kbd> : null}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <a
                href={item.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-b border-r border-dashed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
              >
                {cellContent}
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.tooltip ?? item.platform}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
