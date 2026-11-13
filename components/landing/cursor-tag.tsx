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

/**
 * A list item that swaps the native mouse cursor for a blue pointer with a
 * name pill while a fine pointer hovers it. Keyboard focus shows the same
 * pill beside the item. Touch and pen input are left alone, and the child
 * keeps its own accessible name.
 */
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
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<CursorMode | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, followSpring);
  const springY = useSpring(pointerY, followSpring);
  const x = reduceMotion ? pointerX : springX;
  const y = reduceMotion ? pointerY : springY;

  function track(event: PointerEvent<HTMLLIElement>, snap: boolean) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - rect.left;
    const nextY = event.clientY - rect.top;
    pointerX.set(nextX);
    pointerY.set(nextY);
    if (snap) {
      springX.jump(nextX);
      springY.jump(nextY);
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;
    track(event, true);
    setMode("pointer");
  }

  function handlePointerMove(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;
    track(event, false);
  }

  function handlePointerLeave(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;
    setMode(null);
  }

  function handleFocus(event: FocusEvent<HTMLLIElement>) {
    if (!event.target.matches(":focus-visible")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(rect.width * 0.62);
    pointerY.set(rect.height * 0.62);
    springX.jump(rect.width * 0.62);
    springY.jump(rect.height * 0.62);
    setMode("focus");
  }

  return (
    <li
      className={cn(
        "relative shrink-0 data-[cursor=pointer]:cursor-none [&[data-cursor=pointer]_*]:cursor-none",
        className,
      )}
      data-cursor={mode ?? undefined}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={() => setMode(null)}
    >
      {children}
      <AnimatePresence>
        {mode ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20"
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
              <span
                className={cn(
                  "absolute left-3.5 top-4 flex flex-col gap-1 whitespace-nowrap bg-primary px-2.5 py-1 text-xs font-medium leading-none text-primary-foreground shadow-sm",
                  note ? "rounded-xl py-1.5" : "rounded-full",
                )}
              >
                {label}
                {note ? (
                  <span className="text-[11px] font-normal opacity-75">{note}</span>
                ) : null}
              </span>
            </motion.span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
