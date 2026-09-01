"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/**
 * A heat source on the map. Declared here rather than in `config/` so the
 * component stays self-contained — it ships through the shadcn registry as a
 * single file with no project-specific imports.
 */
export type WorldPoint = {
  name: string;
  lat: number;
  lng: number;
  /** Heat intensity, 0–1. Drives dot color and marker color. */
  value: number;
  /** Heat radius in geographic degrees. */
  radius?: number;
  /** Hover/focus detail for the point marker. Defaults to name + activity score. */
  tooltip?: string;
};

const DEFAULT_COLORS = [
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
];

// Natural Earth country geometry, sampled on a 120 × 60 equirectangular grid.
// Keeping the land mask as ranges lets the map remain dependency-free while the
// inactive dots follow coastlines instead of filling the SVG rectangle.
const LAND_RANGES: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [],
  [],
  [
    [31, 39],
    [44, 53],
  ],
  [
    [28, 35],
    [38, 54],
    [64, 66],
    [67, 68],
    [91, 93],
  ],
  [
    [19, 21],
    [23, 24],
    [26, 27],
    [28, 34],
    [37, 53],
    [82, 83],
    [94, 97],
  ],
  [
    [19, 21],
    [24, 25],
    [26, 31],
    [32, 34],
    [41, 53],
    [78, 79],
    [87, 100],
    [101, 102],
    [107, 108],
  ],
  [
    [6, 10],
    [22, 26],
    [28, 29],
    [30, 37],
    [42, 51],
    [68, 70],
    [82, 84],
    [85, 113],
  ],
  [
    [0, 1],
    [5, 33],
    [34, 35],
    [36, 39],
    [42, 49],
    [65, 74],
    [76, 84],
    [85, 120],
  ],
  [
    [6, 33],
    [34, 38],
    [43, 46],
    [53, 55],
    [64, 67],
    [68, 119],
  ],
  [
    [5, 29],
    [34, 36],
    [44, 46],
    [62, 66],
    [67, 112],
    [113, 114],
    [115, 118],
  ],
  [
    [8, 9],
    [14, 29],
    [34, 37],
    [38, 39],
    [58, 59],
    [62, 63],
    [64, 66],
    [68, 107],
    [113, 114],
  ],
  [
    [16, 31],
    [34, 40],
    [58, 59],
    [64, 65],
    [67, 105],
    [112, 114],
  ],
  [
    [17, 33],
    [34, 41],
    [57, 58],
    [59, 108],
    [112, 113],
  ],
  [
    [19, 38],
    [59, 108],
  ],
  [
    [19, 38],
    [59, 70],
    [71, 72],
    [73, 77],
    [78, 106],
    [107, 108],
  ],
  [
    [19, 37],
    [57, 58],
    [59, 62],
    [63, 69],
    [73, 76],
    [77, 105],
    [107, 108],
  ],
  [
    [19, 35],
    [57, 60],
    [65, 68],
    [70, 77],
    [78, 100],
    [101, 103],
  ],
  [
    [19, 35],
    [57, 60],
    [64, 65],
    [67, 68],
    [69, 77],
    [78, 101],
    [102, 103],
    [106, 107],
  ],
  [
    [20, 34],
    [58, 63],
    [72, 100],
    [104, 106],
  ],
  [
    [21, 33],
    [57, 65],
    [67, 69],
    [72, 101],
    [103, 104],
  ],
  [
    [23, 28],
    [32, 33],
    [56, 71],
    [72, 76],
    [77, 101],
  ],
  [
    [24, 28],
    [55, 77],
    [80, 100],
  ],
  [
    [25, 27],
    [33, 34],
    [55, 72],
    [73, 80],
    [83, 90],
    [91, 98],
  ],
  [
    [25, 28],
    [30, 31],
    [36, 37],
    [55, 72],
    [74, 79],
    [84, 88],
    [91, 95],
    [96, 97],
  ],
  [
    [27, 31],
    [54, 73],
    [74, 78],
    [84, 87],
    [91, 96],
    [100, 101],
  ],
  [
    [30, 32],
    [54, 76],
    [85, 87],
    [93, 96],
  ],
  [
    [31, 32],
    [35, 38],
    [39, 40],
    [55, 77],
    [85, 87],
    [95, 96],
  ],
  [
    [34, 40],
    [56, 77],
    [101, 102],
  ],
  [
    [34, 43],
    [57, 58],
    [62, 76],
    [92, 93],
    [98, 100],
  ],
  [
    [34, 43],
    [63, 75],
    [93, 95],
    [96, 99],
  ],
  [
    [33, 45],
    [63, 74],
    [94, 95],
    [97, 99],
    [100, 101],
    [104, 105],
  ],
  [
    [33, 47],
    [64, 73],
    [94, 95],
    [105, 108],
  ],
  [
    [33, 48],
    [64, 73],
    [96, 98],
    [106, 109],
  ],
  [
    [34, 48],
    [64, 73],
  ],
  [
    [35, 47],
    [64, 74],
    [76, 77],
    [103, 105],
    [107, 108],
  ],
  [
    [36, 47],
    [64, 73],
    [75, 77],
    [101, 106],
    [107, 109],
  ],
  [
    [37, 47],
    [64, 72],
    [75, 76],
    [100, 109],
  ],
  [
    [37, 46],
    [65, 72],
    [74, 76],
    [98, 110],
  ],
  [
    [36, 44],
    [65, 71],
    [98, 111],
  ],
  [
    [36, 44],
    [65, 71],
    [98, 111],
  ],
  [
    [36, 43],
    [66, 70],
    [99, 111],
  ],
  [
    [36, 42],
    [66, 67],
    [99, 100],
    [106, 110],
  ],
  [
    [35, 41],
    [107, 110],
    [118, 119],
  ],
  [
    [35, 39],
    [118, 119],
  ],
  [
    [36, 38],
    [117, 118],
  ],
  [
    [35, 38],
    [116, 117],
  ],
  [[35, 37]],
  [[35, 37]],
  [],
  [],
  [],
  [[39, 40]],
  [
    [37, 38],
    [76, 80],
    [87, 109],
  ],
  [
    [36, 39],
    [62, 63],
    [64, 67],
    [68, 83],
    [84, 114],
  ],
  [
    [19, 20],
    [26, 27],
    [28, 32],
    [33, 34],
    [36, 40],
    [55, 116],
  ],
  [
    [11, 37],
    [51, 115],
  ],
  [
    [6, 7],
    [10, 34],
    [43, 46],
    [50, 114],
  ],
  [
    [9, 40],
    [42, 115],
  ],
  [[10, 11]],
  [],
];
const ANTARCTICA_START_ROW = 50;

export type DottedWorldMapPoint = WorldPoint;

export type DottedWorldMapProps = {
  /** Heat sources. Higher values make nearby land dots warmer. */
  points: WorldPoint[];
  colors?: string[];
  /** Color of low-intensity land dots. Defaults to the first color in the scale. */
  baseColor?: string;
  dotRadius?: number;
  spacing?: number;
  /** Width in dots. */
  cols?: number;
  /** Height in dots. */
  rows?: number;
  /** Opacity of all land dots. */
  baseOpacity?: number;
  /** Render an interactive marker with tooltip for every point. */
  showMarkers?: boolean;
  /** Show a GitHub-style color legend below the map. */
  showLegend?: boolean;
  /** Labels at the low/high ends of the legend. */
  legendLabels?: { low?: string; high?: string };
  className?: string;
};

export function DottedWorldMap({
  points,
  colors = DEFAULT_COLORS,
  baseColor,
  dotRadius = 1.7,
  spacing = 6,
  cols = 120,
  rows = 60,
  baseOpacity = 0.2,
  showMarkers = true,
  showLegend = true,
  legendLabels,
  className,
}: DottedWorldMapProps) {
  const width = cols * spacing;
  const height = rows * spacing;
  const colorScale = colors.length > 0 ? colors : DEFAULT_COLORS;
  const lowColor = baseColor ?? colorScale[0] ?? "currentColor";

  const heatPaths = useMemo(
    () =>
      computeHeatPaths({
        cols,
        rows,
        spacing,
        dotRadius,
        points,
        colorCount: colorScale.length,
      }),
    [cols, rows, spacing, dotRadius, points, colorScale.length],
  );

  const markers = useMemo(
    () =>
      showMarkers
        ? points
            .filter((point) => point.value >= 0.02)
            .map((point) => {
              const x = ((point.lng + 180) / 360) * width;
              const y = ((90 - point.lat) / 180) * height;
              const clamped = Math.min(1, Math.max(0, point.value));
              const colorIndex = Math.min(
                colorScale.length - 1,
                Math.round(clamped * (colorScale.length - 1)),
              );
              const markerColor = colorScale[colorIndex] ?? lowColor;
              const label =
                point.tooltip ??
                `${point.name} · activity ${Math.round(clamped * 100)}/100`;
              return { point, x, y, markerColor, label };
            })
        : [],
    [showMarkers, points, width, height, colorScale, lowColor],
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="world heatmap"
        className={cn("h-full w-full select-none", className)}
        preserveAspectRatio="xMidYMid meet"
      >
        {heatPaths.map((path, index) => (
          <path
            key={colorScale[index] ?? index}
            d={path}
            fill={index === 0 ? lowColor : (colorScale[index] ?? lowColor)}
            opacity={baseOpacity}
            aria-hidden="true"
          />
        ))}
        {markers.map(({ point, x, y, markerColor, label }) => (
          <Tooltip key={point.name}>
            <TooltipTrigger asChild>
              <g
                tabIndex={0}
                aria-label={label}
                className="cursor-pointer outline-none"
              >
                {/* Invisible hit target for reliable hover/focus. */}
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(dotRadius * 3.2, 6)}
                  fill="transparent"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={dotRadius * 2.6}
                  fill={markerColor}
                  opacity={0.25}
                  aria-hidden="true"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={dotRadius * 1.4}
                  fill={markerColor}
                  aria-hidden="true"
                />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </svg>
      {showLegend ? (
        <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
          <span>{legendLabels?.low ?? "less"}</span>
          {colorScale.map((color, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="h-2 w-2 rounded-[2px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>{legendLabels?.high ?? "more"}</span>
        </div>
      ) : null}
    </div>
  );
}

function computeHeatPaths({
  cols,
  rows,
  spacing,
  dotRadius,
  points,
  colorCount,
}: {
  cols: number;
  rows: number;
  spacing: number;
  dotRadius: number;
  points: WorldPoint[];
  colorCount: number;
}): string[] {
  const dots = Array.from({ length: colorCount }, () => [] as string[]);

  for (let row = 0; row < rows; row++) {
    const sourceRowIndex = Math.floor(
      ((row + 0.5) / rows) * LAND_RANGES.length,
    );
    if (sourceRowIndex >= ANTARCTICA_START_ROW) continue;

    const sourceRow = LAND_RANGES[sourceRowIndex] ?? [];
    for (let col = 0; col < cols; col++) {
      const sourceCol = Math.floor(((col + 0.5) / cols) * 120);
      if (
        !sourceRow.some(([start, end]) => sourceCol >= start && sourceCol < end)
      )
        continue;

      const x = col * spacing + spacing / 2;
      const y = row * spacing + spacing / 2;
      const lat = 90 - ((row + 0.5) / rows) * 180;
      const lng = -180 + ((col + 0.5) / cols) * 360;
      const intensity = calculateHeatIntensity(lat, lng, points);
      const colorIndex = Math.min(
        colorCount - 1,
        Math.round(intensity * (colorCount - 1)),
      );
      dots[colorIndex]?.push(
        `M${x - dotRadius},${y}a${dotRadius},${dotRadius} 0 1,0 ${dotRadius * 2},0a${dotRadius},${dotRadius} 0 1,0 -${dotRadius * 2},0`,
      );
    }
  }

  return dots.map((group) => group.join(""));
}

function calculateHeatIntensity(
  lat: number,
  lng: number,
  points: WorldPoint[],
): number {
  return Math.min(
    1,
    points.reduce((total, point) => {
      const lngDistance = Math.abs(lng - point.lng);
      const wrappedLngDistance = Math.min(lngDistance, 360 - lngDistance);
      const x = wrappedLngDistance * Math.cos((lat * Math.PI) / 180);
      const y = lat - point.lat;
      const radius = point.radius ?? 18;
      return total + point.value * Math.exp(-(x * x + y * y) / (2 * radius * radius));
    }, 0),
  );
}
