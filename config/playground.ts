import type {
  PlaygroundPalette,
  PlaygroundSchema,
  PlaygroundValues,
} from "./types";

/**
 * The heatmap's zero-contribution cell. Theme-aware, with the same literal
 * fallback the component itself uses so the panel never paints a bright ramp
 * colour into the empty cells.
 */
const HEATMAP_EMPTY_CELL = "var(--heatmap-level-0, oklch(0.92 0 0))";

/**
 * Colour ramps offered by the preview props panel. Fixed set, no custom picker
 * in v1: a component either maps a ramp onto its own props or gets no palette
 * control at all.
 *
 * `theme` is the site's own tokens rather than literals, so a component that
 * defaults to `var(--token)` colours can keep them.
 */
export const playgroundPalettes: PlaygroundPalette[] = [
  {
    id: "heat",
    label: "Heat",
    colors: ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"],
  },
  {
    id: "aurora",
    label: "Aurora",
    colors: ["#22d3ee", "#38bdf8", "#818cf8", "#a78bfa", "#e879f9"],
  },
  {
    id: "ember",
    label: "Ember",
    colors: ["#fbbf24", "#fb923c", "#f87171", "#e11d48", "#9f1239"],
  },
  {
    id: "midnight",
    label: "Midnight",
    colors: ["#1e293b", "#334155", "#64748b", "#94a3b8", "#e2e8f0"],
  },
  {
    id: "mono",
    label: "Mono",
    colors: ["#525252", "#737373", "#a3a3a3", "#d4d4d4", "#fafafa"],
  },
  // Index 0 is the empty cell here, so it stays a theme token rather than a
  // ramp colour; the four greens are the real GitHub contribution scale.
  {
    id: "github",
    label: "GitHub",
    colors: [
      HEATMAP_EMPTY_CELL,
      "#9be9a8",
      "#40c463",
      "#30a14e",
      "#216e39",
    ],
  },
  // Last rather than first: in dark mode the token ramp reads as a near-empty
  // swatch, so the vivid ramps lead and this stays the "match my theme" option.
  {
    id: "theme",
    label: "Theme",
    colors: [
      "var(--background)",
      "var(--muted)",
      "var(--muted-foreground)",
      "var(--border)",
      "var(--primary)",
    ],
  },
];

const FALLBACK_PALETTE = playgroundPalettes[0];

export function findPalette(id: string): PlaygroundPalette {
  return playgroundPalettes.find((palette) => palette.id === id) ?? FALLBACK_PALETTE;
}

/**
 * Control schemas, one entry per component that has a live props panel.
 * Components without an entry render the preview exactly as they did before.
 *
 * Slider defaults mirror what each demo passes, so the first paint is
 * unchanged, and the keys match the documented prop names so the copied
 * snippet reads like the props table.
 */
const PLAYGROUNDS: Record<string, PlaygroundSchema> = {
  "ask-ai": {
    componentName: "AskAI",
    controls: [
      {
        kind: "segmented",
        key: "trigger",
        label: "Trigger",
        options: [
          { value: "pill", label: "Pill" },
          { value: "blob", label: "Blob only" },
        ],
        default: "pill",
      },
      {
        kind: "segmented",
        key: "size",
        label: "Size",
        options: [
          { value: "default", label: "Default" },
          { value: "compact", label: "Compact" },
        ],
        default: "default",
      },
      {
        kind: "segmented",
        key: "side",
        label: "Popover",
        options: [
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ],
        default: "top",
      },
    ],
    // The demo owns the copy; the snippet shows the controls only.
    resolve: (values) => ({
      size: values.size,
      blobOnly: values.trigger === "blob",
      side: values.side,
    }),
  },

  "dotted-world-map": {
    componentName: "DottedWorldMap",
    controls: [
      { kind: "palette", key: "palette", default: "heat" },
      {
        kind: "slider",
        key: "dotRadius",
        label: "Dot radius",
        min: 1,
        max: 4,
        step: 0.1,
        default: 2,
      },
      {
        kind: "slider",
        key: "spacing",
        label: "Spacing",
        min: 4,
        max: 10,
        step: 1,
        default: 6,
        format: (value) => String(value),
      },
      {
        kind: "slider",
        key: "baseOpacity",
        label: "Base opacity",
        min: 0.05,
        max: 1,
        step: 0.05,
        default: 0.92,
      },
      {
        kind: "toggle",
        key: "showMarkers",
        label: "Markers",
        description: "Marker and tooltip per point",
        default: true,
      },
      {
        kind: "toggle",
        key: "showLegend",
        label: "Legend",
        description: "Colour scale under the map",
        default: true,
      },
    ],
    // The demo owns the point data, so the snippet shows the styling props only.
    omitFromSnippet: ["baseColor"],
    resolve: (values, palette) => ({
      colors: palette.colors,
      baseColor: palette.colors[0],
      dotRadius: values.dotRadius,
      spacing: values.spacing,
      baseOpacity: values.baseOpacity,
      showMarkers: values.showMarkers,
      showLegend: values.showLegend,
    }),
  },

  "github-map": {
    componentName: "GitHubCalendar",
    controls: [{ kind: "palette", key: "palette", default: "github" }],
    resolve: (values, palette) => ({
      colors: [
        // Level 0 is the empty cell, so it stays the theme token; the ramp
        // supplies the four contribution levels.
        HEATMAP_EMPTY_CELL,
        ...palette.colors.slice(1),
      ],
    }),
  },

  snake: {
    componentName: "Snake",
    controls: [
      { kind: "palette", key: "palette", default: "theme" },
      {
        kind: "slider",
        key: "speed",
        label: "Speed",
        min: 40,
        max: 160,
        step: 10,
        default: 80,
        format: (value) => `${value}ms`,
      },
      {
        kind: "slider",
        key: "gridSize",
        label: "Grid",
        min: 8,
        max: 32,
        step: 2,
        default: 20,
        format: (value) => `${value}²`,
      },
    ],
    resolve: (values, palette) => ({
      fieldColor: palette.colors[0],
      dotColor: palette.colors[2],
      snakeColor: palette.colors[4],
      speed: values.speed,
      gridSize: values.gridSize,
    }),
  },

  "workflow-status": {
    componentName: "WorkflowStatusBadge",
    controls: [
      {
        kind: "segmented",
        key: "size",
        label: "Size",
        options: [
          { value: "default", label: "Default" },
          { value: "sm", label: "Small" },
        ],
        default: "sm",
      },
      {
        kind: "toggle",
        key: "iconOnly",
        label: "Icon only",
        description: "Drops the label, keeps it in the a11y tree",
        default: false,
      },
    ],
    // The badge takes a required `status`; the snippet shows the controls only.
    resolve: (values) => ({ size: values.size, iconOnly: values.iconOnly }),
  },

  "copy-command-block": {
    componentName: "CopyCommandBlock",
    controls: [
      {
        kind: "toggle",
        key: "showTabs",
        label: "Package manager tabs",
        description: "Switcher for npm, pnpm, yarn, and bun",
        default: true,
      },
      {
        kind: "toggle",
        key: "showPrompt",
        label: "Prompt",
        description: "$ before the command",
        default: true,
      },
    ],
    // The demo owns the package-manager commands; the panel drives its chrome.
    resolve: (values) => ({
      showTabs: values.showTabs,
      showPrompt: values.showPrompt,
    }),
  },

  "glyph-card": {
    componentName: "GlyphCard",
    controls: [
      { kind: "palette", key: "accent", label: "Accent", default: "theme" },
      {
        kind: "slider",
        key: "glyphSize",
        label: "Glyph size",
        min: 40,
        max: 110,
        step: 2,
        default: 62,
        format: (value) => String(value),
      },
      {
        kind: "toggle",
        key: "href",
        label: "Link card",
        description: "Wrap the card in an anchor",
        default: false,
      },
    ],
    // Accent uses the strongest stop in the selected ramp. The theme ramp ends
    // in `var(--primary)`, preserving the default preview.
    // The key is the documented prop name, so the copied snippet reads like
    // the props table: off drops href, on resolves to a real URL.
    resolve: (values, palette) => ({
      accent: palette.colors.at(-1) ?? "var(--primary)",
      glyphSize: values.glyphSize,
      href: values.href ? "https://akoder.xyz" : undefined,
    }),
  },

  "infinite-slider": {
    componentName: "InfiniteSlider",
    controls: [
      {
        kind: "slider",
        key: "speed",
        label: "Speed",
        min: 20,
        max: 160,
        step: 10,
        default: 60,
        format: (value) => String(value),
      },
      {
        kind: "slider",
        key: "gap",
        label: "Gap",
        min: 4,
        max: 40,
        step: 2,
        default: 16,
        format: (value) => `${value}px`,
      },
      {
        kind: "toggle",
        key: "reverse",
        label: "Reverse",
        description: "Flip the travel direction",
        default: false,
      },
    ],
    // The demo owns the stack items and the hover slowdown.
    resolve: (values) => ({
      speed: values.speed,
      gap: values.gap,
      reverse: values.reverse,
    }),
  },

  "progress-bars": {
    componentName: "ProgressBars",
    controls: [
      {
        kind: "segmented",
        key: "orientation",
        label: "Orientation",
        options: [
          { value: "vertical", label: "Vertical" },
          { value: "horizontal", label: "Horizontal" },
        ],
        default: "vertical",
      },
      {
        kind: "slider",
        key: "max",
        label: "Max",
        min: 20,
        max: 200,
        step: 10,
        default: 100,
        format: (value) => String(value),
      },
      {
        kind: "slider",
        key: "height",
        label: "Height",
        min: 120,
        max: 360,
        step: 20,
        default: 240,
        format: (value) => `${value}px`,
      },
      {
        kind: "toggle",
        key: "showScale",
        label: "Scale",
        description: "Axis and guide lines",
        default: true,
      },
      {
        kind: "toggle",
        key: "showValues",
        label: "Values",
        description: "Percentage under each bar",
        default: true,
      },
      {
        kind: "toggle",
        key: "showTooltip",
        label: "Tooltips",
        description: "Detail line on hover and focus",
        default: true,
      },
    ],
    // The demo owns the items and renders both fill textures, so the panel
    // drives the chart props the two variants share.
    resolve: (values) => ({
      orientation: values.orientation,
      max: values.max,
      height: values.height,
      showScale: values.showScale,
      showValues: values.showValues,
      showTooltip: values.showTooltip,
    }),
  },

  "progressive-blur": {
    componentName: "ProgressiveBlur",
    controls: [
      {
        kind: "segmented",
        key: "position",
        label: "Edge",
        options: [
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
          { value: "both", label: "Both" },
        ],
        default: "bottom",
      },
      {
        kind: "slider",
        key: "height",
        label: "Height",
        min: 10,
        max: 70,
        step: 5,
        default: 45,
        format: (value) => `${value}%`,
      },
    ],
    // The component takes the height as a CSS length string.
    resolve: (values) => ({
      position: values.position,
      height: `${values.height}%`,
    }),
  },

  "project-explorer": {
    componentName: "ProjectExplorer",
    controls: [
      {
        kind: "segmented",
        key: "defaultOpen",
        label: "Open",
        options: [
          { value: "latest", label: "Latest year" },
          { value: "all", label: "All years" },
        ],
        default: "latest",
      },
      {
        kind: "toggle",
        key: "showHoverPreview",
        label: "Hover preview",
        description: "Floating image card on hover",
        default: true,
      },
    ],
    // The demo owns the project data; the heading stays hidden in the preview.
    resolve: (values) => ({
      defaultOpen: values.defaultOpen,
      showHoverPreview: values.showHoverPreview,
    }),
  },

  "interactive-skill-cloud": {
    componentName: "InteractiveSkillCloud",
    controls: [
      {
        kind: "slider",
        key: "height",
        label: "Height",
        min: 240,
        max: 640,
        step: 20,
        default: 420,
        format: (value) => `${value}px`,
      },
      {
        kind: "segmented",
        key: "gravity",
        label: "Gravity",
        options: [
          { value: "1", label: "Pile" },
          { value: "0", label: "Float" },
        ],
        default: "1",
      },
    ],
    // Gravity is a number on the component: 1 piles the pills, 0 floats them.
    resolve: (values) => ({
      height: values.height,
      gravity: Number(values.gravity),
    }),
  },

  "contact-channels": {
    componentName: "ContactChannels",
    controls: [
      {
        kind: "segmented",
        key: "columns",
        label: "Columns",
        options: [
          { value: "1", label: "One" },
          { value: "2", label: "Two" },
          { value: "3", label: "Three" },
        ],
        default: "2",
      },
    ],
    // Columns is a 1 | 2 | 3 union on the component.
    resolve: (values) => ({
      columns: Number(values.columns),
    }),
  },

  "stack-rolodex": {
    componentName: "StackRolodex",
    controls: [
      {
        kind: "slider",
        key: "interval",
        label: "Interval",
        min: 800,
        max: 4000,
        step: 100,
        default: 2000,
        format: (value) => `${(value / 1000).toFixed(1)}s`,
      },
      {
        kind: "slider",
        key: "step",
        label: "Spacing",
        min: 36,
        max: 80,
        step: 2,
        default: 50,
        format: (value) => `${value}px`,
      },
    ],
    resolve: (values) => ({
      interval: values.interval,
      step: values.step,
    }),
  },
};

export function getPlayground(id: string): PlaygroundSchema | undefined {
  return PLAYGROUNDS[id];
}

/** Starting values for a schema, one entry per control. */
export function getPlaygroundDefaults(schema: PlaygroundSchema): PlaygroundValues {
  return Object.fromEntries(
    schema.controls.map((control) => [control.key, control.default]),
  );
}

/** Resolved props for a schema, with the palette lookup folded in. */
export function resolvePlaygroundProps(
  schema: PlaygroundSchema,
  values: PlaygroundValues,
): Record<string, unknown> {
  const paletteId = schema.controls.find((control) => control.kind === "palette");
  return schema.resolve(
    values,
    findPalette(paletteId ? String(values[paletteId.key]) : FALLBACK_PALETTE.id),
  );
}

function formatSnippetValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `{[${value.map((item) => `"${String(item)}"`).join(", ")}]}`;
  }
  if (typeof value === "string") return `"${value}"`;
  return `{${String(value)}}`;
}

/**
 * Renders the current values as a JSX props fragment, e.g.
 * `<Snake speed={80} gridSize={20} />`. Props the demo owns are skipped.
 */
export function buildPlaygroundSnippet(
  schema: PlaygroundSchema,
  values: PlaygroundValues,
): string {
  const resolved = resolvePlaygroundProps(schema, values);
  const omitted = new Set(schema.omitFromSnippet ?? []);
  const lines = Object.entries(resolved)
    .filter(([key, value]) => value !== undefined && !omitted.has(key))
    .map(([key, value]) => `  ${key}=${formatSnippetValue(value)},`);

  return `<${schema.componentName}\n${lines.join("\n")}\n/>`;
}

/** Whether the current values are still the schema defaults. */
export function isPlaygroundDefault(
  schema: PlaygroundSchema,
  values: PlaygroundValues,
): boolean {
  const defaults = getPlaygroundDefaults(schema);
  return schema.controls.every(
    (control) => values[control.key] === defaults[control.key],
  );
}
