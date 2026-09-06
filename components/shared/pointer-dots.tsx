"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * The frame-gutter dot field, scoped to a container instead of the page frame.
 * Same two-layer trick as `.frame-gutter-dots` / `.frame-gutter-dots-lit`: a
 * muted base grid and an accent grid revealed through a soft circle that
 * follows the pointer. Pointer coordinates are written straight to the accent
 * layer as CSS variables, off React's render path.
 */
export function PointerDots({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const lit = litRef.current;
    if (!container || !lit) return;

    // No hover-capable pointer, nothing to light up.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let left = 0;
    let top = 0;
    const measure = () => {
      const rect = lit.getBoundingClientRect();
      left = rect.left;
      top = rect.top;
    };

    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const paint = () => {
      frame = 0;
      lit.style.setProperty("--gutter-x", `${clientX - left}px`);
      lit.style.setProperty("--gutter-y", `${clientY - top}px`);
      lit.style.setProperty("--gutter-lit", "1");
    };

    const onPointerMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame === 0) frame = requestAnimationFrame(paint);
    };

    const dim = () => lit.style.setProperty("--gutter-lit", "0");

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
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]",
        className,
      )}
    >
      <div className="frame-gutter-dots absolute inset-0" />
      <div ref={litRef} className="frame-gutter-dots-lit absolute inset-0" />
    </div>
  );
}
