"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy, Terminal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
  getAddCommands,
} from "@/config/registry";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useCopy } from "@/lib/use-copy";
import { usePackageManager, writeManager } from "@/components/copy-block";
import { PM_ICONS } from "@/components/pm-icons";

const ROTATION_INTERVAL_MS = 2400;

export type RotatingInstallCommandProps = {
  /** Component ids to cycle through, in display order. */
  ids: string[];
  /** Interval between rotations in ms. */
  intervalMs?: number;
  className?: string;
};

/**
 * Showcase copy of an install command that cycles through registry component
 * ids on its own. Same chrome as `InstallCommand` — same tabs, same copy
 * affordance, same monospace treatment — only the trailing id rotates.
 *
 * Pauses on hover/focus so users can read or copy without the value jumping.
 * Respects `prefers-reduced-motion` by dropping the per-swap transition while
 * keeping the rotation cycle itself intact.
 */
export function RotatingInstallCommand({
  ids,
  intervalMs = ROTATION_INTERVAL_MS,
  className,
}: RotatingInstallCommandProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const manager = usePackageManager();
  const { status, copy } = useCopy();
  const reduced = useReducedMotion();

  const safeIds = useMemo(() => (ids.length > 0 ? ids : [""]), [ids]);
  const currentId = safeIds[index % safeIds.length];
  const commands = useMemo(() => getAddCommands(currentId), [currentId]);
  const command = commands[manager] ?? commands.npm;

  useEffect(() => {
    if (paused || safeIds.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeIds.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, safeIds.length, intervalMs]);

  if (safeIds.length === 0) return null;

  const handleManagerChange = (pm: PackageManager) => {
    writeManager(pm);
    trackEvent("package_manager_changed", {
      selected_manager: pm,
      component_id: currentId,
    });
  };

  const handleCopy = () => {
    void copy(command);
    trackEvent("registry_command_copied", {
      component_id: currentId,
      package_manager: manager,
      command,
      location: "rotating_install_bar",
    });
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >

      {/* Package manager tabs — same shape as InstallCommand. */}
      <div className="mb-2 flex items-center gap-1">
        {PACKAGE_MANAGERS.map((pm) => {
          const Icon = PM_ICONS[pm];
          const isActive = manager === pm;
          return (
            <button
              key={pm}
              type="button"
              onClick={() => handleManagerChange(pm)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[10px] tracking-wider micro-transition",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isActive && Icon && (
                  <motion.span
                    key={pm}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center"
                  >
                    <Icon className="size-3 shrink-0" />
                  </motion.span>
                )}
              </AnimatePresence>
              {pm}
            </button>
          );
        })}
      </div>

      <div className="group/copy relative overflow-hidden rounded-md border bg-muted/10">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-muted-foreground/5" />
        <div className="relative flex items-center gap-3 px-4 py-3">
          <span className="flex select-none items-center gap-1.5 font-mono text-[12.5px] text-muted-foreground/60">
            <Terminal className="size-3.5" />
            <span>$</span>
          </span>
          <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.code
                // Tabs changing also re-keys the swap so manual selection animates.
                key={`${currentId}:${manager}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="block whitespace-pre font-mono text-[12.5px] leading-relaxed text-foreground"
              >
                {command}
              </motion.code>
            </AnimatePresence>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="copy command"
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
                  ? "copied!"
                  : status === "error"
                    ? "copy failed"
                    : "copy command"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
