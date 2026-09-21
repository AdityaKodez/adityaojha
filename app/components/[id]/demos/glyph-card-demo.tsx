"use client";

import { GlyphCard, type GlyphCardProps } from "@/components/ui/glyph-card";

/**
 * A monogram authored in the lower-right quadrant of the 24x24 grid. It relies
 * on `glyphOffset` to recenter rather than being redrawn on the grid.
 */
const MONOGRAM_GLYPH = "M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z";

/**
 * The monogram on its own. The props are the ones the detail page's panel
 * drives, and each default below is what the catalog and the home teaser
 * render. With `href` omitted the card is static, exactly as before.
 */
export function GlyphCardDemo({
  accent = "var(--primary)",
  glyphSize = 62,
  href,
}: Partial<GlyphCardProps> = {}) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-xs">
        <GlyphCard
          eyebrow="Monogram"
          title="Aditya"
          subtitle="An off-center mark, recentered"
          href={href}
          glyph={MONOGRAM_GLYPH}
          glyphOffset={[-4, -4]}
          glyphSize={glyphSize}
          accent={accent}
        />
      </div>
    </div>
  );
}
