"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, X } from "lucide-react";
import { type ReactNode, useSyncExternalStore } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
} from "@/config/registry";
import { cn } from "@/lib/utils";
import { useCopy, type CopyStatus } from "@/lib/use-copy";
import { PM_ICONS } from "@/components/pm-icons";

const STORAGE_KEY = "akoder:package-manager";
const DEFAULT_MANAGER: PackageManager = "npm";

/**
 * Package-manager preference shared by every install block on the site.
 *
 * Backed by `useSyncExternalStore` rather than an effect + `setState`: it reads
 * localStorage during the first client render (no post-mount flash, no
 * hydration mismatch) and keeps sibling blocks in sync when one changes.
 */
const managerListeners = new Set<() => void>();
let managerCache: PackageManager | null = null;

function readManager(): PackageManager {
  if (typeof window === "undefined") return DEFAULT_MANAGER;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && (PACKAGE_MANAGERS as readonly string[]).includes(stored)
    ? (stored as PackageManager)
    : DEFAULT_MANAGER;
}

function getManagerSnapshot(): PackageManager {
  if (managerCache === null) managerCache = readManager();
  return managerCache;
}

function getServerManagerSnapshot(): PackageManager {
  return DEFAULT_MANAGER;
}

function subscribeToManager(onStoreChange: () => void) {
  managerListeners.add(onStoreChange);
  // `storage` only fires in other tabs; it keeps cross-tab blocks consistent.
  const onStorage = () => {
    managerCache = null;
    managerListeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    managerListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeManager(next: PackageManager) {
  window.localStorage.setItem(STORAGE_KEY, next);
  managerCache = next;
  managerListeners.forEach((listener) => listener());
}

function usePackageManager(): PackageManager {
  return useSyncExternalStore(
    subscribeToManager,
    getManagerSnapshot,
    getServerManagerSnapshot,
  );
}

type CopyIconProps = { status: CopyStatus };

function CopyIcon({ status }: CopyIconProps) {
  if (status === "copied") {
    return <Check className="size-3.5 text-green-500" />;
  }
  if (status === "error") {
    return <X className="size-3.5 text-destructive" />;
  }
  return <Copy className="size-3.5" />;
}

/** Shared chrome: dashed hairline box, mono code line, copy affordance. */
function CodeShell({
  children,
  actions,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/copy relative overflow-hidden rounded-md border bg-muted/10",
        className,
      )}
    >
      <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-muted-foreground/5" />
      <div className="relative flex items-center gap-3 px-4 py-3">
        <code className="min-w-0 flex-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-pre font-mono text-[12.5px] leading-relaxed text-foreground">
          {children}
        </code>
        {actions}
      </div>
    </div>
  );
}

export type CopyBlockProps = {
  /** Exact string written to the clipboard. */
  value: string;
  /** Optional fragment rendered inside the code line (defaults to `value`). */
  display?: ReactNode;
  className?: string;
  copyLabel?: string;
};

/** A single copyable snippet — used for non-command content like JSON config. */
export function CopyBlock({
  value,
  display,
  className,
  copyLabel = "copy",
}: CopyBlockProps) {
  const { status, copy } = useCopy();

  return (
    <CodeShell
      className={className}
      actions={
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => void copy(value)}
              aria-label={copyLabel}
              className="flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <CopyIcon status={status} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {status === "copied"
                ? "copied!"
                : status === "error"
                  ? "copy failed"
                  : copyLabel}
            </p>
          </TooltipContent>
        </Tooltip>
      }
    >
      {display ?? value}
    </CodeShell>
  );
}

export type InstallCommandProps = {
  /** One command per package manager. Keys drive the tab order. */
  commands: Record<PackageManager, string>;
  className?: string;
};

/**
 * Package-manager aware install block. The selected manager is persisted in
 * localStorage, so every install block on the site stays in sync.
 */
export function InstallCommand({ commands, className }: InstallCommandProps) {
  const manager = usePackageManager();
  const { status, copy } = useCopy();

  const command = commands[manager] ?? commands.npm;

  return (
    <div className={cn("relative", className)}>
      {/* Package manager tabs */}
      <div className="mb-2 flex items-center gap-1">
        {PACKAGE_MANAGERS.map((pm) => {
          const Icon = PM_ICONS[pm];
          const isActive = manager === pm;
          return (
            <button
              key={pm}
              type="button"
              onClick={() => writeManager(pm)}
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

      <CodeShell
        actions={
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => void copy(command)}
                aria-label="copy install command"
                className="flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <CopyIcon status={status} />
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
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={manager}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            <span className="select-none pr-2 text-muted-foreground">$</span>
            {command}
          </motion.span>
        </AnimatePresence>
      </CodeShell>
    </div>
  );
}
