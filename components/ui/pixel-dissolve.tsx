/* Pixelated bottom fade: a background-colored checkerboard dither whose
   density steps up toward the screen edge, so content scrolling under the
   footer dissolves into pixels instead of only blurring away. Token driven,
   follows light/dark. Pairs with ProgressiveBlur in the fixed bottom band. */

/* Five discrete alpha bands (bottom to top). Band height stays a multiple of
   the 4px checker cell so the dither steps align to whole pixel rows. */
const DISSOLVE_MASK =
  "linear-gradient(to top, black 0% 20%, rgba(0,0,0,0.8) 20% 40%, rgba(0,0,0,0.6) 40% 60%, rgba(0,0,0,0.4) 60% 80%, rgba(0,0,0,0.2) 80% 100%)";

export function PixelDissolve({ height = "40px" }: { height?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
      style={{
        height,
        // 8px tile of 4px quadrant squares: one repeating-conic quadrant pair
        // per tile produces the 2x2 checkerboard. muted keeps the squares
        // visible against both the dark and light background.
        backgroundImage:
          "repeating-conic-gradient(var(--muted) 0% 25%, transparent 0% 50%)",
        backgroundSize: "8px 8px",
        WebkitMaskImage: DISSOLVE_MASK,
        maskImage: DISSOLVE_MASK,
      }}
    />
  );
}
