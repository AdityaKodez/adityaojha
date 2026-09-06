"use client";

import { Command as CommandPrimitive } from "cmdk";
import { ArrowLeft, ArrowUp, ChevronRight, CornerDownLeft, Search, X, ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Kbd } from "./kbd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface CommandPaletteItem {
  /** Unique id — also the key used to persist recents. */
  id: string;
  /** Row label. Search matches this plus `keywords`. */
  label: string;
  /** Optional leading icon (a sized lucide element works well). */
  icon?: React.ReactNode;
  /** Right-aligned display-only shortcut hint, e.g. "⌘D". */
  shortcut?: string;
  /** Small right-aligned tag, e.g. "new" or "external". */
  badge?: string;
  /** Extra search terms beyond the label. */
  keywords?: string[];
  /** Id of a page (from `pages`) to drill into instead of running an action. */
  page?: string;
  /** Called when the item is picked. The palette closes after non-page items. */
  onSelect?: () => void;
}

export interface CommandPaletteGroup {
  label: string;
  items: CommandPaletteItem[];
}

export interface CommandPalettePage {
  /** Referenced by `CommandPaletteItem.page`. */
  id: string;
  /** Shown as the group heading while the page is open. */
  label: string;
  /** Overrides the search placeholder while the page is open. */
  placeholder?: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  /** Top-level groups, rendered in order when no page is open. */
  groups?: CommandPaletteGroup[];
  /** Drill-down pages reachable from items with a matching `page` id. */
  pages?: CommandPalettePage[];
  /** Controlled open state. Omit to let the palette manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Global hotkey key combined with ⌘/Ctrl. `false` disables the listener. */
  hotkey?: string | false;
  placeholder?: string;
  emptyLabel?: string;
  /** Remember recently picked items (localStorage) and offer them on top. */
  recents?: boolean;
  storageKey?: string;
  maxRecents?: number;
  /** Prevent the palette from opening on small viewports (< 640px). */
  disableOnMobile?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants + helpers                                                       */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DEFAULT_PLACEHOLDER = "Type a command or search…";
const DEFAULT_EMPTY = "No matching commands";
const DEFAULT_STORAGE_KEY = "command-palette:recents";

function readRecents(storageKey: string, max: number): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is string => typeof entry === "string")
      .slice(0, max);
  } catch {
    return [];
  }
}

function writeRecents(storageKey: string, ids: string[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch {
    // Ignore localStorage access issues
  }
}

/** Shared kbd chip style for the static hints (esc key, footer legend). */
const kbdClass =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-popover px-1 font-sans text-[11px] font-medium text-muted-foreground";

/** Group heading typography — one source for the root list and drill pages. */
const groupHeadingClass =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";

/* -------------------------------------------------------------------------- */
/*  Row                                                                       */
/* -------------------------------------------------------------------------- */

const PaletteRow = React.memo(function PaletteRow({
  item,
  scope,
  onRun,
}: {
  item: CommandPaletteItem;
  scope: string;
  onRun: (item: CommandPaletteItem) => void;
}) {
  return (
    <CommandPrimitive.Item
      value={`${scope}:${item.id}`}
      keywords={[item.label, ...(item.keywords ?? [])]}
      onSelect={() => onRun(item)}
      className="group/row flex h-9 cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 text-sm outline-none transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
    >
      {item.icon && (
        <span className="flex size-4 shrink-0 items-center justify-center opacity-70 [&_svg]:size-4">
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 font-pixel text-[11px] text-muted-foreground">
          {item.badge}
        </span>
      )}
      {item.shortcut && (
        <Kbd>{item.shortcut}</Kbd>
      )}
      {item.page && (
        <ChevronRight
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-data-[selected=true]/row:opacity-100"
        />
      )}
    </CommandPrimitive.Item>
  );
});

/* -------------------------------------------------------------------------- */
/*  Command palette                                                           */
/* -------------------------------------------------------------------------- */

export function CommandPalette({
  groups = [],
  pages = [],
  open: openProp,
  onOpenChange,
  hotkey = "k",
  placeholder = DEFAULT_PLACEHOLDER,
  emptyLabel = DEFAULT_EMPTY,
  recents = false,
  storageKey = DEFAULT_STORAGE_KEY,
  maxRecents = 3,
  disableOnMobile = false,
  className,
}: CommandPaletteProps) {
  const prefersReducedMotion = useReducedMotion();

  /* -- small-viewport gate (disableOnMobile) ------------------------------- */
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => {
      isMobileRef.current = mql.matches;
      setIsMobile(mql.matches);
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  /* -- open state (controlled or internal) -------------------------------- */
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const openRef = useRef(false);
  const open = isControlled ? openProp : internalOpen;

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next && disableOnMobile && isMobileRef.current) return;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, disableOnMobile],
  );

  const toggleOpen = useCallback(() => {
    setOpen(!openRef.current);
  }, [setOpen]);

  /* -- page stack + search ------------------------------------------------ */
  const [stack, setStack] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const dirRef = useRef<1 | -1>(1);
  /** true = the next list mount appears instantly (open), false = it slides (page change). */
  const skipListAnimRef = useRef(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const pagesById = useMemo(() => {
    const map = new Map<string, CommandPalettePage>();
    for (const page of pages) map.set(page.id, page);
    return map;
  }, [pages]);

  const currentPage = stack.length
    ? pagesById.get(stack[stack.length - 1])
    : undefined;
  const commandKey = currentPage?.id ?? "root";

  /** Every terminal item, for resolving recents. */
  const itemsById = useMemo(() => {
    const map = new Map<string, CommandPaletteItem>();
    for (const group of groups) {
      for (const item of group.items) {
        if (!item.page) map.set(item.id, item);
      }
    }
    for (const page of pages) {
      for (const item of page.items) {
        if (!item.page) map.set(item.id, item);
      }
    }
    return map;
  }, [groups, pages]);

  /* -- recents ------------------------------------------------------------ */
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const recordRecent = useCallback(
    (id: string) => {
      if (!recents) return;
      setRecentIds((prev) => {
        const next = [id, ...prev.filter((entry) => entry !== id)].slice(
          0,
          Math.max(1, maxRecents),
        );
        writeRecents(storageKey, next);
        return next;
      });
    },
    [recents, maxRecents, storageKey],
  );

  /* -- global hotkey (⌘K / Ctrl+K) ---------------------------------------- */
  useEffect(() => {
    if (!hotkey) return;
    const key = typeof hotkey === "string" ? hotkey.toLowerCase() : "";
    if (!key) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (
        event.key.toLowerCase() === key &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleOpen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkey, toggleOpen]);

  /* -- reset the stack + refresh recents on every open --------------------- */
  useEffect(() => {
    if (!open) return;
    dirRef.current = 1;
    setStack([]);
    setQuery("");
    if (recents) setRecentIds(readRecents(storageKey, maxRecents));
  }, [open, recents, storageKey, maxRecents]);

  /* -- keep focus in the input across page changes ------------------------- */
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [commandKey]);

  /* -- re-arm the list slide after page changes ---------------------------- */
  useEffect(() => {
    skipListAnimRef.current = true;
  }, [commandKey]);

  /* -- keep the active row visible while arrowing through long lists ------- */
  const handleActiveChange = useCallback(() => {
    requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      const selected = list.querySelector<HTMLElement>(
        '[cmdk-item][data-selected="true"]',
      );
      if (!selected) return;

      const listRect = list.getBoundingClientRect();
      const itemRect = selected.getBoundingClientRect();

      if (itemRect.bottom > listRect.bottom) {
        list.scrollTop += itemRect.bottom - listRect.bottom + 4;
      } else if (itemRect.top < listRect.top) {
        list.scrollTop -= listRect.top - itemRect.top + 4;
      }
    });
  }, []);

  /* -- item selection ------------------------------------------------------ */
  const goBack = useCallback(() => {
    dirRef.current = -1;
    skipListAnimRef.current = false;
    setStack((prev) => prev.slice(0, -1));
    setQuery("");
  }, []);

  const runItem = useCallback(
    (item: CommandPaletteItem) => {
      if (item.page && pagesById.has(item.page)) {
        dirRef.current = 1;
        skipListAnimRef.current = false;
        setStack((prev) => [...prev, item.page as string]);
        setQuery("");
        return;
      }
      item.onSelect?.();
      recordRecent(item.id);
      setOpen(false);
    },
    [pagesById, recordRecent, setOpen],
  );

  /* -- filtering: multi-token substring match over label + keywords --------- */
  const filter = useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const cleanSearch = search.trim().toLowerCase();
      if (!cleanSearch) return 1;
      const tokens = cleanSearch.split(/\s+/);
      const haystack = (keywords ?? []).join(" ").toLowerCase();
      return tokens.every((token) => haystack.includes(token)) ? 1 : 0;
    },
    [],
  );

  const showRecents =
    recents && !currentPage && query.trim() === "" && recentIds.length > 0;
  const recentItems = showRecents
    ? recentIds
        .map((id) => itemsById.get(id))
        .filter((item): item is CommandPaletteItem => item !== undefined)
    : [];

  const topGroups = currentPage
    ? [
        {
          label: currentPage.label,
          items: currentPage.items,
        },
      ]
    : groups;

  const rowScope = currentPage ? `page:${currentPage.id}` : "root";
  const mobileBlocked = disableOnMobile && isMobile;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && !mobileBlocked && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.12,
                  ease: EASE,
                }}
                className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              forceMount
              asChild
              onPointerDownOutside={() => setOpen(false)}
              onEscapeKeyDown={(event) => {
                // first escape clears the search, second backs out of page, third closes
                if (query) {
                  event.preventDefault();
                  setQuery("");
                } else if (currentPage) {
                  event.preventDefault();
                  goBack();
                }
              }}
            >
              {/* full-viewport positioner — centers the panel; pointer events pass
                  through so clicks outside the panel still reach the overlay */}
              <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4 max-sm:place-items-end max-sm:p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 2 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.15,
                  ease: EASE,
                }}
                className={cn(
                  "pointer-events-auto flex max-h-[min(56vh,432px)] w-full max-w-[27.5rem] flex-col overflow-hidden rounded-xl bg-muted text-foreground shadow-xl ring-1 ring-inset ring-border",
                  "max-sm:rounded-b-none max-sm:rounded-t-xl",
                  className,
                )}
              >
                <DialogPrimitive.Title className="sr-only">
                  Command palette
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  Search actions and navigate
                </DialogPrimitive.Description>

                {/* the command root is the flex column the height cap flows
                    through — without it the list never constrains and the
                    footer gets clipped instead of the list scrolling */}
                <CommandPrimitive
                  key={commandKey}
                  loop
                  filter={filter}
                  onValueChange={handleActiveChange}
                  className="flex min-h-0 flex-col"
                >
                {/* header — part of the muted container, no rule */}
                <div className="flex shrink-0 items-center gap-2 px-3.5">
                  {currentPage ? (
                    <button
                      type="button"
                      onClick={goBack}
                      aria-label="Back to all commands"
                      className="-ml-1.5 flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                  ) : (
                    <Search
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground/60"
                    />
                  )}
                  <CommandPrimitive.Input
                    ref={inputRef}
                    value={query}
                    onValueChange={setQuery}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !query && currentPage) {
                        event.preventDefault();
                        goBack();
                      }
                    }}
                    placeholder={currentPage?.placeholder ?? placeholder}
                    className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : (
                    <span
                      aria-hidden
                      className={cn(kbdClass, "shrink-0 text-[10px]")}
                    >
                      Esc
                    </span>
                  )}
                </div>

                {/* list — an inset card so the content reads apart from the chrome;
                    the panel caps its height and this list scrolls, scrollbar hidden
                    (inline scrollbar-width beats the site's unlayered `*` rule) */}
                <CommandPrimitive.List
                  ref={listRef}
                  style={{ scrollbarWidth: "none" }}
                  className="mx-1.5 mb-1.5 mt-1 min-h-0 flex-initial overflow-y-auto overscroll-contain rounded-lg bg-card p-1.5 ring-1 ring-inset ring-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <motion.div
                    key={commandKey}
                    initial={
                      // eslint-disable-next-line react-hooks/refs
                      skipListAnimRef.current
                        ? false
                        : // eslint-disable-next-line react-hooks/refs
                          { opacity: 0, x: 6 * dirRef.current }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.16,
                      ease: EASE,
                    }}
                  >
                    {recentItems.length > 0 && (
                      <CommandPrimitive.Group
                        heading="Recent"
                        className={groupHeadingClass}
                      >
                        {recentItems.map((item) => (
                          <PaletteRow
                            key={`recent:${item.id}`}
                            item={item}
                            scope="recent"
                            onRun={runItem}
                          />
                        ))}
                      </CommandPrimitive.Group>
                    )}

                    {topGroups.map((group, groupIndex) => (
                      <CommandPrimitive.Group
                        key={`${rowScope}:${group.label}:${groupIndex}`}
                        heading={group.label}
                        className={groupHeadingClass}
                      >
                        {group.items.map((item) => (
                          <PaletteRow
                            key={item.id}
                            item={item}
                            scope={rowScope}
                            onRun={runItem}
                          />
                        ))}
                      </CommandPrimitive.Group>
                    ))}

                    <CommandPrimitive.Empty className="py-8 text-center text-sm text-muted-foreground">
                      {query.trim() ? (
                        <>
                          No results for{" "}
                          <span className="font-medium text-foreground">“{query.trim()}”</span>
                        </>
                      ) : (
                        emptyLabel
                      )}
                    </CommandPrimitive.Empty>
                  </motion.div>
                </CommandPrimitive.List>

                {/* footer — part of the muted container, no rule */}
                <div className="flex shrink-0 items-center gap-4 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className={cn(kbdClass, "h-4 px-1 [&_svg]:size-2.5")}>
                      <ArrowUp aria-hidden />
                    </span>
                    <span className={cn(kbdClass, "h-4 px-1 [&_svg]:size-2.5")}>
                      <ArrowDown aria-hidden />
                    </span>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={cn(kbdClass, "h-4 px-1 [&_svg]:size-2.5")}>
                      <CornerDownLeft aria-hidden />
                    </span>
                    Select
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className={cn(kbdClass, "h-4 px-1 text-[10px]")}>
                      Esc
                    </span>
                    Close
                  </span>
                </div>
                </CommandPrimitive>
              </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
