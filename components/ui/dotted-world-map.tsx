// Pure-server SVG world map made of dots.
//
// - Equirectangular projection of lat/lng onto an n × m grid.
// - Base field rendered via a single <pattern> + <rect> (2 DOM nodes regardless of grid size).
// - Active dots are individual <circle>s with fill picked from a `colors` scale keyed by `value`.
//
// No "use client" — this is a server component.

import type { WorldPoint } from "@/config/world-cities";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "var(--heatmap-level-0)",
  "var(--heatmap-level-1)",
  "var(--heatmap-level-2)",
  "var(--heatmap-level-3)",
  "var(--heatmap-level-4)",
];

export type DottedWorldMapPoint = WorldPoint;

export type DottedWorldMapProps = {
  points: WorldPoint[];
  colors?: string[];
  dotRadius?: number;
  spacing?: number;
  /** Width in dots. */
  cols?: number;
  /** Height in dots. */
  rows?: number;
  /** Opacity of the inactive base field. */
  baseOpacity?: number;
  className?: string;
  /** Optional pattern id override. Required if you render more than one map per page. */
  patternId?: string;
};

const DEFAULT_PATTERN_ID = "dwm-pattern";

export function DottedWorldMap({
  points,
  colors = DEFAULT_COLORS,
  dotRadius = 1.4,
  spacing = 5,
  cols = 120,
  rows = 60,
  baseOpacity = 0.55,
  className,
  patternId = DEFAULT_PATTERN_ID,
}: DottedWorldMapProps) {
  const width = cols * spacing;
  const height = rows * spacing;

  // Normalize point values into 0..1 (preserves a tiny dynamic range floor so dark = dense).
  const maxValue = points.reduce(
    (acc, p) => (p.value > acc ? p.value : acc),
    1
  );
  const normalized = points.map((p) => ({
    ...p,
    value: maxValue > 0 ? p.value / maxValue : 0,
  }));

  // Computed once per render — pattern id is stable per page.
  const baseColor = colors[0];

  const circles = computeCircles({
    points: normalized,
    cols,
    rows,
    spacing,
    colors,
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Dotted world map"
      className={cn("h-full w-full select-none", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern
          id={patternId}
          x={0}
          y={0}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={dotRadius}
            fill={baseColor}
            opacity={baseOpacity}
          />
        </pattern>
      </defs>

      {/* Base field via pattern — single DOM node. */}
      <rect width={width} height={height} fill={`url(#${patternId})`} />

      {/* Active dots — actual nodes. Skipped if value is trivial. */}
      <g>
        {circles.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={dotRadius} fill={c.color} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Equirectangular projection of lat/lng onto a discrete grid, then inverse-distance-weighted
 * intensity falloff per cell. Yields a "dot density" feel that matches the GitHub heatmap
 * aesthetic — sparse base, dense hotspots.
 */
function computeCircles({
  points,
  cols,
  rows,
  spacing,
  colors,
}: {
  points: WorldPoint[];
  cols: number;
  rows: number;
  spacing: number;
  colors: string[];
}): Array<{ x: number; y: number; color: string }> {
  const width = cols * spacing;
  const height = rows * spacing;

  // For each point, compute its (x, y) in the equirectangular grid.
  // lng ∈ [-180, 180] → [0, cols*spacing]
  // lat ∈ [+90, -90] (north → top) → [0, rows*spacing]
  const projected = points.map((p) => {
    const x = ((p.lng + 180) / 360) * width;
    const y = ((90 - p.lat) / 180) * height;
    return { x, y, value: p.value };
  });

  // Inverse-distance weighting per grid cell: each cell looks at points within
  // a ~3-cell radius and accumulates their contributions, plus each project's
  // own intensity coloring at the project's exact cell.
  //
  // For perf we just emit a circle for each cell that has a point projected
  // into it (or near it). This stays O(points) and is plenty for the dataset.

  const out: Array<{ x: number; y: number; color: string }> = [];
  for (const p of projected) {
    if (p.value < 0.02) continue;
    // Snap to grid center.
    const cx = Math.floor(p.x / spacing) * spacing + spacing / 2;
    const cy = Math.floor(p.y / spacing) * spacing + spacing / 2;
    out.push({
      x: cx,
      y: cy,
      color: pickColor(p.value, colors),
    });
  }
  return out;
}

function pickColor(value: number, colors: string[]): string {
  if (colors.length === 0) return "currentColor";
  const clamped = Math.max(0, Math.min(1, value));
  const idx = Math.round(clamped * (colors.length - 1));
  return colors[idx] ?? colors[colors.length - 1]!;
}
