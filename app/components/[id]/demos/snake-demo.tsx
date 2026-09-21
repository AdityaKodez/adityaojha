"use client";

import { Snake, type SnakeProps } from "@/components/ui/snake";

/**
 * The default 20x20 field. Steer with the arrow keys, WASD, or a swipe.
 *
 * The width is capped by the viewport height as well as by the 28rem ceiling:
 * the showcase pane scrolls anything past its own limit, and a square field
 * plus the score line would trip that on short viewports.
 *
 * Every prop is optional and falls back to the component's own default, so the
 * catalog cards and the detail page's props panel render the same demo.
 */
export function SnakeDemo(props: SnakeProps = {}) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[min(28rem,calc(62svh-6rem))]">
        <Snake {...props} />
      </div>
    </div>
  );
}
