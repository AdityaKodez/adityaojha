/* ------------------------------------------------------------------ */
/* Garden palette — olive stems with colored blooms that read well on  */
/* the theme-aware secondary surface in both light and dark mode.      */
/* ------------------------------------------------------------------ */

const STEM = "text-[#98a265]";
const BLOOM_PINK = "text-[#e06c9f]";
const BLOOM_RED = "text-[#d9502b]";
const BLOOM_BLUE = "text-[#82a9cc]";
const BLOOM_CREAM = "text-[#cfc98d]";

type Tone = "bloom" | "stem";

type PlantLine = { t: string; tone: Tone };

/* ASCII plant shapes, one inner array per visual line. */
const KINDS = {
  tulip: [
    [{ t: " ,,,", tone: "bloom" }],
    [{ t: "{({})}", tone: "bloom" }],
    [{ t: " -Y-", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: "^^^^^", tone: "stem" }],
  ],
  tulipTall: [
    [{ t: " ,,,", tone: "bloom" }],
    [{ t: "{({})}", tone: "bloom" }],
    [{ t: " -Y-", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: "^^^^^", tone: "stem" }],
  ],
  pot: [
    [{ t: "UUUUU", tone: "bloom" }],
    [{ t: "(___)", tone: "bloom" }],
    [{ t: "\\-Y-/", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
    [{ t: "^^^^^", tone: "stem" }],
  ],
  smallPot: [
    [{ t: "UUU", tone: "bloom" }],
    [{ t: "(_)", tone: "bloom" }],
    [{ t: " \\|", tone: "stem" }],
    [{ t: "^^^^^", tone: "stem" }],
  ],
  star: [
    [{ t: "(*)", tone: "bloom" }],
    [{ t: ">/", tone: "stem" }],
  ],
  bud: [
    [{ t: "(o)", tone: "bloom" }],
    [{ t: "\\|/", tone: "stem" }],
  ],
  sprout: [[{ t: "\\ |/", tone: "stem" }]],
  dotSprout: [
    [{ t: " .", tone: "bloom" }],
    [{ t: "\\|", tone: "stem" }],
  ],
  dotSproutHill: [
    [{ t: " .", tone: "bloom" }],
    [{ t: "\\|", tone: "stem" }],
    [{ t: "^^^", tone: "stem" }],
  ],
  dots: [[{ t: "..", tone: "bloom" }]],
  hillDot: [
    [{ t: " .", tone: "bloom" }],
    [{ t: "^^^", tone: "stem" }],
  ],
  tinyBloom: [
    [{ t: "UUU", tone: "bloom" }],
    [{ t: " Y", tone: "stem" }],
    [{ t: "^^^^^", tone: "stem" }],
  ],
  fallen: [
    [{ t: "\\( | ,-", tone: "stem" }],
    [{ t: " \\|/", tone: "stem" }],
  ],
  at: [
    [{ t: "@", tone: "bloom" }],
    [{ t: "\\|/", tone: "stem" }],
    [{ t: "^^^", tone: "stem" }],
  ],
} satisfies Record<string, PlantLine[][]>;

type Plant = {
  kind: keyof typeof KINDS;
  left: number; // % of garden width
  top: number; // % of garden height
  bloom?: string; // tailwind text color for the bloom lines
};

/* Hardcoded scatter (no randomness) so SSR and client always match. */
const PLANTS: Plant[] = [
  { kind: "star", left: 4, top: 14, bloom: BLOOM_CREAM },
  { kind: "dotSprout", left: 10, top: 52, bloom: BLOOM_PINK },
  { kind: "sprout", left: 4, top: 70 },
  { kind: "bud", left: 14, top: 70, bloom: BLOOM_RED },
  { kind: "tulip", left: 9, top: 82, bloom: BLOOM_PINK },
  { kind: "pot", left: 20, top: 40, bloom: BLOOM_BLUE },
  { kind: "dots", left: 29, top: 8, bloom: BLOOM_PINK },
  { kind: "tulipTall", left: 34, top: 10, bloom: BLOOM_PINK },
  { kind: "dotSprout", left: 29, top: 55, bloom: BLOOM_RED },
  { kind: "smallPot", left: 23, top: 66, bloom: BLOOM_PINK },
  { kind: "sprout", left: 30, top: 84 },
  { kind: "fallen", left: 22, top: 90 },
  { kind: "hillDot", left: 40, top: 4, bloom: BLOOM_PINK },
  { kind: "sprout", left: 46, top: 42 },
  { kind: "tulipTall", left: 53, top: 42, bloom: BLOOM_RED },
  { kind: "dotSproutHill", left: 47, top: 62, bloom: BLOOM_PINK },
  { kind: "dots", left: 36, top: 68, bloom: BLOOM_PINK },
  { kind: "tinyBloom", left: 41, top: 82, bloom: BLOOM_BLUE },
  { kind: "sprout", left: 45, top: 94 },
  { kind: "tulip", left: 62, top: 50, bloom: BLOOM_PINK },
  { kind: "pot", left: 71, top: 36, bloom: BLOOM_BLUE },
  { kind: "sprout", left: 72, top: 66 },
  { kind: "star", left: 55, top: 74, bloom: BLOOM_CREAM },
  { kind: "at", left: 56, top: 88, bloom: BLOOM_PINK },
  { kind: "fallen", left: 67, top: 82 },
  { kind: "sprout", left: 72, top: 93 },
  { kind: "dots", left: 84, top: 50, bloom: BLOOM_PINK },
  { kind: "star", left: 90, top: 38, bloom: BLOOM_CREAM },
  { kind: "sprout", left: 93, top: 55 },
  { kind: "smallPot", left: 94, top: 68, bloom: BLOOM_PINK },
  { kind: "bud", left: 83, top: 62, bloom: BLOOM_RED },
  { kind: "star", left: 86, top: 78, bloom: BLOOM_CREAM },
  { kind: "bud", left: 79, top: 86, bloom: BLOOM_RED },
  { kind: "tulip", left: 89, top: 86, bloom: BLOOM_PINK },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-dashed bg-muted/20">
      <div className="px-6 pb-6 pt-8 md:px-8">
        <p className="max-w-md font-serif text-xl italic leading-snug text-foreground md:text-2xl">
          The soul becomes dyed with the color of its thoughts.
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/80">
          — MARCUS AURELIUS
        </p>
        <p className="mt-5 font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
          Made with &lt;3 and lots of coffee.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="group/garden relative h-[310px] cursor-default select-none overflow-hidden md:h-[390px]"
      >
        {PLANTS.map((plant, index) => (
          <pre
            key={`${plant.kind}-${plant.left}-${plant.top}`}
            style={{
              left: `${plant.left}%`,
              top: `${plant.top}%`,
              transitionDelay: `${(index % 10) * 45}ms`,
            }}
            className="absolute font-mono text-[9px] leading-[1.3] transition-transform duration-500 ease-out group-hover/garden:-translate-y-1.5 motion-reduce:transition-none md:text-[10px]"
          >
            {KINDS[plant.kind].map((line, lineIndex) => (
              <span
                key={lineIndex}
                className={line[0].tone === "bloom" ? plant.bloom ?? STEM : STEM}
              >
                {line[0].t}
                {"\n"}
              </span>
            ))}
          </pre>
        ))}
      </div>
    </footer>
  );
}
