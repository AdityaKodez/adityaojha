"use client";

import { Snake } from "@/components/ui/snake";

/**
 * The default 20x20 field. Steer with the arrow keys, WASD, or a swipe.
 *
 * The width is capped by the viewport height as well as by the 28rem ceiling:
 * the showcase pane scrolls anything past its own limit, and a square field
 * plus the score line would trip that on short viewports.
 */
export function SnakeDemo() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[min(28rem,calc(62svh-6rem))]">
        <Snake />
      </div>
    </div>
  );
}
