"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { Check, Copy, X } from "lucide-react";
import { type ReactNode, useId, useSyncExternalStore } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
} from "@/config/registry";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useCopy, type CopyStatus } from "@/lib/use-copy";
import { PM_ICONS } from "@/components/showcase/pm-icons";

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

export function writeManager(next: PackageManager) {
  window.localStorage.setItem(STORAGE_KEY, next);
  managerCache = next;
  managerListeners.forEach((listener) => listener());
}

export function usePackageManager(): PackageManager {
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

/** Shared chrome: dual-border frame, mono code line, copy affordance. */
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
    // Corner rounding is owned by the caller: a standalone block rounds all
    // four corners, while the tabbed install block keeps its top-left square
    // so the active tab can sit flush against it.
    <div className={cn("relative border bg-muted/10 p-0.5", className)}>
      <div className="group/copy relative overflow-hidden rounded-md border bg-muted/10">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-muted-foreground/5" />
        <div className="relative flex items-center gap-3 px-4 py-3">
          <code className="min-w-0 flex-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-pre font-mono text-[12.5px] leading-relaxed text-foreground">
            {children}
          </code>
          {actions}
        </div>
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
  location?: string;
};

/** A single copyable snippet — used for non-command content like JSON config. */
export function CopyBlock({
  value,
  display,
  className,
  copyLabel = "copy",
  location = "component_doc",
}: CopyBlockProps) {
  const { status, copy } = useCopy();

  const handleCopy = () => {
    void copy(value);
    if (value.includes("@akoder") || value.includes("registries")) {
      trackEvent("registry_setup_snippet_copied", {
        namespace: "@akoder",
        location,
      });
    }
  };

  return (
    <CodeShell
      className={cn("rounded-lg", className)}
      actions={
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
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
  componentId?: string;
  location?: string;
};

/**
 * Package-manager aware install block. The selected manager is persisted in
 * localStorage, so every install block on the site stays in sync.
 */
export function InstallCommand({
  commands,
  className,
  componentId,
  location = "component_doc",
}: InstallCommandProps) {
  const manager = usePackageManager();
  const { status, copy } = useCopy();
  const reducedMotion = useReducedMotion();
  // Per-instance id: several install blocks can share a page, and a shared
  // layoutId would make the pill fly between them.
  const pillId = useId();
  const pillTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };

  const command = commands[manager] ?? commands.npm;
  const parsedId =
    componentId ??
    command.match(/\/r\/([a-zA-Z0-9_-]+)\.json/)?.[1] ??
    command.split("@akoder/")[1]?.split(" ")[0] ??
    "unknown";
  const handleCopy = () => {
    void copy(command);
    trackEvent("registry_command_copied", {
      component_id: parsedId,
      package_manager: manager,
      command,
      location,
    });
  };


  const handleManagerChange = (pm: PackageManager) => {
    writeManager(pm);
    trackEvent("package_manager_changed", {
      selected_manager: pm,
      component_id: componentId,
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Package manager tabs — the active background slides between tabs. */}
      <div className="flex w-fit items-center gap-1 rounded-t-lg border bg-muted">
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
                "relative flex items-center gap-1.5 rounded-t-lg px-2 py-1 font-mono text-[10px] tracking-wider micro-transition",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`pm-tab-pill-${pillId}`}
                  initial={false}
                  transition={pillTransition}
                  className="absolute inset-0 rounded-t-lg bg-background"
                  aria-hidden="true"
                />
              )}
              <Icon className="relative z-10 size-3 shrink-0" />
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    key="label"
                    initial={
                      reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }
                    }
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                    }
                    className="relative z-10 origin-left whitespace-nowrap"
                  >
                    {pm}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <CodeShell
        className="rounded-tl-none rounded-b-lg rounded-r-lg"
        actions={
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
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
