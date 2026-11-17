"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const followSpring = { stiffness: 900, damping: 50, mass: 0.3 } as const;
const popSpring = { type: "spring", duration: 0.3, bounce: 0.25 } as const;

type CursorMode = "pointer" | "focus";
type CursorTag = { label: string; note?: string };

function CursorArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={className}
      strokeWidth={1.5}
      strokeLinejoin="round"
    >
      <path d="M1.5 1.5v13.2l3.4-3.1 2.6 6 2.7-1.2-2.6-5.9h4.9z" />
    </svg>
  );
}

function readTag(target: EventTarget | null): CursorTag | null {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>("[data-cursor-label]");
  if (!item) return null;
  return { label: item.dataset.cursorLabel ?? "", note: item.dataset.cursorNote };
}

/**
 * A list that swaps the native mouse cursor for a blue pointer across its
 * whole strip, gaps included, so moving between items never flips the cursor
 * back. The name pill follows whichever `CursorTagItem` sits under the
 * pointer and hides over the gaps. Keyboard focus shows the same pill beside
 * the focused item. Touch and pen input are left alone.
 */
export function CursorTagList({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<CursorMode | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [note, setNote] = useState<string | undefined>(undefined);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, followSpring);
  const springY = useSpring(pointerY, followSpring);
  const x = reduceMotion ? pointerX : springX;
  const y = reduceMotion ? pointerY : springY;

  function showTag(tag: CursorTag | null) {
    setLabel(tag?.label ?? null);
    setNote(tag?.note);
  }

  function place(nextX: number, nextY: number, snap: boolean) {
    pointerX.set(nextX);
    pointerY.set(nextY);
    if (snap) {
      springX.jump(nextX);
      springY.jump(nextY);
    }
  }

  function track(event: PointerEvent<HTMLUListElement>, snap: boolean) {
    const rect = event.currentTarget.getBoundingClientRect();
    place(event.clientX - rect.left, event.clientY - rect.top, snap);
    showTag(readTag(event.target));
  }

  function handlePointerEnter(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;
    track(event, true);
    setMode("pointer");
  }

  function handlePointerMove(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;
    track(event, false);
  }

  function handlePointerLeave(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;
    setMode(null);
    showTag(null);
  }

  function handleFocus(event: FocusEvent<HTMLUListElement>) {
    if (!event.target.matches(":focus-visible")) return;
    const item = event.target.closest<HTMLElement>("[data-cursor-label]");
    if (!item) return;
    const list = event.currentTarget.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    place(
      rect.left - list.left + rect.width * 0.62,
      rect.top - list.top + rect.height * 0.62,
      true,
    );
    showTag(readTag(item));
    setMode("focus");
  }

  function handleBlur() {
    setMode(null);
    showTag(null);
  }

  return (
    <ul
      {...props}
      className={cn(
        "relative data-[cursor=pointer]:cursor-none [&[data-cursor=pointer]_*]:cursor-none",
        className,
      )}
      data-cursor={mode ?? undefined}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <AnimatePresence>
        {mode ? (
          <motion.li
            aria-hidden
            role="presentation"
            className="pointer-events-none absolute left-0 top-0 z-20 list-none"
            style={{ x, y }}
          >
            <motion.span
              className="relative -ml-px -mt-px block size-5 origin-top-left"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.5,
                transition: { duration: 0.12 },
              }}
              transition={popSpring}
            >
              <CursorArrow className="size-5 fill-primary stroke-background drop-shadow-sm" />
              <AnimatePresence>
                {label ? (
                  <motion.span
                    key={label}
                    className={cn(
                      "absolute left-3.5 top-4 flex origin-top-left flex-col gap-1 whitespace-nowrap bg-primary px-2.5 py-1 text-xs font-medium leading-none text-primary-foreground shadow-sm",
                      note ? "rounded-xl py-1.5" : "rounded-full",
                    )}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={popSpring}
                  >
                    {label}
                    {note ? (
                      <span className="text-[11px] font-normal opacity-75">
                        {note}
                      </span>
                    ) : null}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.span>
          </motion.li>
        ) : null}
      </AnimatePresence>
    </ul>
  );
}

/** A list item whose name appears in the pill of its parent `CursorTagList`. */
export function CursorTagItem({
  label,
  note,
  className,
  children,
}: {
  label: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li
      className={cn("relative shrink-0", className)}
      data-cursor-label={label}
      data-cursor-note={note}
    >
      {children}
    </li>
  );
}