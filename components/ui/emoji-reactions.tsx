"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { IconType } from "react-icons";
import { RiEmotionHappyLine, RiEmotionLaughFill, RiFireFill, RiHeartFill, RiThumbUpFill, RiVipCrownFill } from "react-icons/ri";

import { cn } from "@/lib/utils";

export interface EmojiReaction {
  /** Unique, stable identifier for this reaction. */
  id: string;
  icon: IconType;
  /** Accessible name, such as "Love". */
  label: string;
}

export interface EmojiReactionsProps {
  reactions?: EmojiReaction[];
  /** Controlled selection. Null means no reaction. Pair with onValueChange. */
  value?: string | null;
  /** Initial selection for an uncontrolled picker. */
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Extra classes on the compact trigger. */
  className?: string;
}

const DEFAULT_REACTIONS: EmojiReaction[] = [
  { id: "love", icon: RiHeartFill, label: "Love" },
  { id: "laugh", icon: RiEmotionLaughFill, label: "Laugh" },
  { id: "fire", icon: RiFireFill, label: "Fire" },
  { id: "crown", icon: RiVipCrownFill, label: "Crown" },
  { id: "like", icon: RiThumbUpFill, label: "Like" },
];

/** A compact icon reaction picker that animates the selection on its trigger. */
export function EmojiReactions({
  reactions = DEFAULT_REACTIONS,
  value,
  defaultValue = null,
  onValueChange,
  disabled = false,
  className,
}: EmojiReactionsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [keyboardSelection, setKeyboardSelection] = useState(false);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const instanceId = useId();
  const selectedId = value === undefined ? internalValue : value;
  const ids = new Set<string>();

  for (const reaction of reactions) {
    if (!reaction.id.trim() || ids.has(reaction.id) || typeof reaction.icon !== "function" || !reaction.label.trim()) {
      throw new Error("EmojiReactions requires unique, non-empty ids, icon components, and non-empty labels.");
    }
    ids.add(reaction.id);
  }
  if (selectedId !== null && !ids.has(selectedId)) {
    throw new Error(`EmojiReactions value "${selectedId}" does not match a reaction id.`);
  }

  const selected = reactions.find((reaction) => reaction.id === selectedId);
  const SelectedIcon = selected?.icon ?? RiEmotionHappyLine;
  const unavailable = disabled || reactions.length === 0 || (value !== undefined && !onValueChange);
  // Disabling an open picker closes it without reopening when enabled again.
  if (unavailable && open) setOpen(false);
  const isOpen = open && !unavailable;
  const tabbableId = focusedId && ids.has(focusedId) ? focusedId : selectedId ?? reactions[0]?.id;
  const still = reduceMotion || keyboardSelection;
  const selectionTransition = still
    ? { duration: reduceMotion ? 0.1 : 0 }
    : { type: "spring" as const, duration: 0.28, bounce: 0.25 };

  function selectReaction(id: string, keyboard: boolean) {
    if (unavailable || id === selectedId) return;
    setKeyboardSelection(keyboard);
    if (value === undefined) setInternalValue(id);
    onValueChange?.(id);
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "Tab":
        event.preventDefault();
        setOpen(false);
        return;
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % reactions.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + reactions.length) % reactions.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = reactions.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <motion.button
          type="button"
          disabled={unavailable}
          aria-label={selected ? `Change reaction, ${selected.label} selected` : "Add reaction"}
          whileTap={reduceMotion || unavailable ? undefined : { scale: 0.97 }}
          className={cn(
            "relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background p-2.5 text-muted-foreground shadow-xs ring-1 ring-inset ring-border outline-none transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
            selected && "text-primary",
            className,
          )}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={selectedId ?? "empty"}
              aria-hidden="true"
              initial={{ opacity: 0, y: still ? 0 : 6, scale: still ? 1 : 0.95, rotate: still ? 0 : -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, transition: { duration: still ? 0 : 0.08 } }}
              transition={{ ...selectionTransition, opacity: { duration: still && !reduceMotion ? 0 : 0.1 } }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl leading-none"
            >
              <SelectedIcon className="size-5" />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <PopoverPrimitive.Content
              key="picker"
              forceMount
              asChild
              side="bottom"
              align="end"
              sideOffset={8}
              collisionPadding={12}
              aria-label="Choose a reaction"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                const index = Math.max(0, reactions.findIndex((reaction) => reaction.id === selectedId));
                buttons.current[index]?.focus();
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : -6, scale: reduceMotion ? 1 : 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -4, scale: reduceMotion ? 1 : 0.95, transition: { duration: reduceMotion ? 0.1 : 0.12 } }}
                transition={{ duration: reduceMotion ? 0.1 : 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="z-50 max-w-[min(20rem,var(--radix-popover-content-available-width))] origin-(--radix-popover-content-transform-origin) outline-none data-[state=closed]:pointer-events-none"
              >
                <div role="toolbar" aria-label="Reactions" className="flex flex-wrap justify-center gap-1 rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-inset ring-border">
                  {reactions.map((reaction, index) => {
                    const Icon = reaction.icon;
                    return (
                    <motion.button
                      key={reaction.id}
                      ref={(button) => { buttons.current[index] = button; }}
                      type="button"
                      aria-label={reaction.label}
                      aria-pressed={selectedId === reaction.id}
                      tabIndex={reaction.id === tabbableId ? 0 : -1}
                      onFocus={() => setFocusedId(reaction.id)}
                      onKeyDown={(event) => moveFocus(event, index)}
                      onClick={(event) => selectReaction(reaction.id, event.detail === 0)}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      className={cn(
                        "relative flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        selectedId === reaction.id && "text-primary hover:text-primary",
                      )}
                    >
                      {selectedId === reaction.id && (
                        <motion.span
                          layoutId={`${instanceId}-reaction`}
                          initial={false}
                          transition={selectionTransition}
                          className="pointer-events-none absolute inset-0 rounded-full bg-primary/10"
                        />
                      )}
                      <Icon aria-hidden="true" className="relative size-5" />
                    </motion.button>
                    );
                  })}
                </div>
                <PopoverPrimitive.Arrow width={10} height={5} className="fill-popover" />
                <span role="status" className="sr-only">{selected ? `${selected.label} selected` : "No reaction selected"}</span>
              </motion.div>
            </PopoverPrimitive.Content>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
