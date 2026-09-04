"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * Decoration for the dead space either side of the centered column.
 *
 * A fixed, inert layer that hangs a dot field off each frame edge. Both bands
 * are anchored to `--frame-max-w`, so they track the column rather than the
 * viewport and stay aligned on routes that widen the frame.
 *
 * The grid is drawn twice per band — a muted base layer and an accent layer
 * revealed through a soft circle that follows the pointer, so the dots light up
 * under the cursor. Pointer coordinates are written straight to the accent
 * layer's style as CSS variables, which keeps the effect off React's render
 * path.
 *
 * Only shown from `xl` up: below that the gutter is narrower than the section
 * rail's reach and the bands would crowd it.
 */

/** 12rem of band, faded top and bottom so it never runs into the header. */
const BAND =
  "absolute inset-y-0 w-48 [mask-image:linear-gradient(to_bottom,transparent,black_6rem,black_calc(100%_-_6rem),transparent)]";

/** Fades the field out toward the viewport edge. Sits on the wrapper so the
 *  lit layer can spend its own mask on the pointer circle. */
const FIELD_FADE = {
  left: "[mask-image:linear-gradient(to_left,black,transparent_78%)]",
  right: "[mask-image:linear-gradient(to_right,black,transparent_78%)]",
};

export function FrameGutters() {
  const leftLit = useRef<HTMLDivElement>(null);
  const rightLit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No hover-capable pointer, nothing to light up.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // The bands are fixed, so their boxes only move on resize — measure once
    // and reuse instead of reading layout on every pointer sample.
    let boxes: { el: HTMLDivElement; left: number; top: number }[] = [];
    const measure = () => {
      boxes = [];
      for (const el of [leftLit.current, rightLit.current]) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        boxes.push({ el, left: rect.left, top: rect.top });
      }
    };

    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const paint = () => {
      frame = 0;
      for (const { el, left, top } of boxes) {
        el.style.setProperty("--gutter-x", `${clientX - left}px`);
        el.style.setProperty("--gutter-y", `${clientY - top}px`);
        el.style.setProperty("--gutter-lit", "1");
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame === 0) frame = requestAnimationFrame(paint);
    };

    const dim = () => {
      for (const { el } of boxes) el.style.setProperty("--gutter-lit", "0");
    };

    measure();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", measure);
    document.documentElement.addEventListener("pointerleave", dim);
    window.addEventListener("blur", dim);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", measure);
      document.documentElement.removeEventListener("pointerleave", dim);
      window.removeEventListener("blur", dim);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden select-none overflow-hidden xl:block"
    >
      <div className="relative mx-auto h-full w-full max-w-[var(--frame-max-w)]">
        <div className={cn(BAND, "right-full")}>
          <div className={cn("absolute inset-0", FIELD_FADE.left)}>
            <div className="frame-gutter-dots absolute inset-0" />
            <div
              ref={leftLit}
              className="frame-gutter-dots-lit absolute inset-0"
            />
          </div>
        </div>

        <div className={cn(BAND, "left-full")}>
          <div className={cn("absolute inset-0", FIELD_FADE.right)}>
            <div className="frame-gutter-dots absolute inset-0" />
            <div
              ref={rightLit}
              className="frame-gutter-dots-lit absolute inset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
