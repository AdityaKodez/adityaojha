import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
import type { ComponentIcon } from "@/config/types";
import { cn } from "@/lib/utils";

interface ComponentIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export interface PaperCutIconProps extends ComponentIconProps {
  silhouette: string;
  accent?: string;
  tilt?: number;
  children: ReactNode;
}

export function PaperCutIcon({
  size = 64,
  color = "currentColor",
  accent = "var(--primary)",
  silhouette,
  tilt = -7,
  children,
  style,
  className,
  ...props
}: PaperCutIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      color={color}
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "[--cutout-paper:var(--background)] dark:[--cutout-paper:var(--foreground)] dark:[--cutout-ink:var(--background)]",
        className,
      )}
      style={{
        "--cutout-accent": accent,
        "--cutout-wash": `color-mix(in oklch, ${accent} 18%, var(--cutout-paper))`,
        ...style,
      } as CSSProperties}
      {...props}
    >
      <g transform={`rotate(${tilt} 32 32)`} color="var(--cutout-ink, currentColor)" stroke="currentColor">
        <path
          d={silhouette}
          transform="translate(1 2)"
          fill="var(--foreground)"
          stroke="var(--foreground)"
          strokeWidth="10"
          opacity="0.1"
        />
        <path d={silhouette} fill="var(--cutout-paper)" stroke="var(--cutout-paper)" strokeWidth="9" />
        <path d={silhouette} fill="var(--cutout-wash)" />
        {children}
      </g>
    </svg>
  );
}

function PrintDots({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="currentColor" stroke="none" opacity="0.35">
      <circle r="0.8" />
      <circle cx="4" r="0.8" />
      <circle cx="8" r="0.8" />
      <circle cx="2" cy="3.5" r="0.8" />
      <circle cx="6" cy="3.5" r="0.8" />
      <circle cy="7" r="0.8" />
      <circle cx="4" cy="7" r="0.8" />
      <circle cx="8" cy="7" r="0.8" />
    </g>
  );
}

function HomeIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-6} silhouette="M9 29 31 10 54 29 49 29 49 51 15 51 15 29Z">
      <path d="m9 29 22-19 23 19-6 2-17-14-16 14Z" fill="var(--cutout-accent)" />
      <path d="M27 51V35h10v16" fill="var(--cutout-paper)" />
      <path d="M41 32h4v7h-4Z" fill="currentColor" strokeWidth="1.5" />
      <PrintDots x={17} y={38} />
    </PaperCutIcon>
  );
}

function TestimonialIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" silhouette="M13 12 48 10Q54 11 53 18L51 41Q51 46 44 46H29L17 54 19 45H13Q8 45 9 38L10 18Q10 13 13 12Z">
      <path d="M20 22h9v9h-5q0 5-6 7M36 21h9v9h-5q0 5-6 7" fill="currentColor" strokeWidth="2" />
      <PrintDots x={35} y={37} />
    </PaperCutIcon>
  );
}

function ReactionsIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={8} silhouette="M52 32C53 44 44 53 32 53S10 45 10 32 19 11 31 11 51 19 52 32Z">
      <path d="M20 27q3-5 6 0" />
      <ellipse cx="40" cy="26" rx="2.5" ry="3.5" fill="currentColor" stroke="none" />
      <path d="M20 36q12 15 23-1" strokeWidth="3" />
      <path d="m48 8 1-4m7 11 4-1" strokeWidth="2.5" />
      <PrintDots x={14} y={31} />
    </PaperCutIcon>
  );
}

function TodoIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={5} silhouette="M24 12V8H40V13H47Q51 13 51 18L49 51Q49 54 44 54L16 52Q12 52 12 47L14 17Q14 12 19 12Z">
      <path d="M23 12v7h18v-7" fill="var(--cutout-accent)" />
      <path d="m20 29 3 3 6-7m-9 18 3 3 6-7M35 29h8M35 42h7" />
      <PrintDots x={35} y={47} />
    </PaperCutIcon>
  );
}

export function DottedWorldMapIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-12} silhouette="M50 29C50 40 42 48 31 48S11 40 11 29 20 9 31 9 50 18 50 29ZM27 48V54H40V49">
      <path d="M14 18q17 8 33 0M12 33q18 7 37 0M31 9c-14 11-12 29 0 39 12-11 14-28 0-39Z" strokeWidth="2" />
      <path d="M37 13 40 20 35 26 38 32 32 40 28 31 22 27 23 20Z" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <path d="M23 54h21" />
      <PrintDots x={16} y={25} />
    </PaperCutIcon>
  );
}

export function CopyCommandBlockIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} silhouette="M19 18V11Q19 8 23 8H49Q53 8 53 12V38Q53 42 48 42H45V49Q45 53 41 53H12Q8 53 8 49V23Q8 18 12 18Z">
      <path d="M19 18h22q4 0 4 5v19M10 27h33" />
      <path d="m17 34 5 5-5 5M29 45h7" />
      <path d="M27 13h18" strokeWidth="2" />
    </PaperCutIcon>
  );
}

export function GitHubMapIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-2)" tilt={6} silhouette="M14 14 49 12Q53 12 53 18L52 48Q52 53 47 53L14 51Q10 51 10 46V19Q10 14 14 14Z">
      <path d="M12 23h39M21 9v10M42 9v10" />
      <g fill="currentColor" stroke="none">
        <path d="M17 29h6v6h-6zM28 29h6v6h-6zM39 29h6v6h-6zM17 40h6v6h-6zM28 40h6v6h-6z" />
        <path d="M39 40h6v6h-6z" fill="var(--cutout-accent)" />
      </g>
    </PaperCutIcon>
  );
}

export function ProjectExplorerIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" silhouette="M9 21V14Q9 11 14 11H25L31 17H48Q52 17 52 22V27H55L49 49Q48 52 43 52H14Q9 52 9 47Z">
      <path d="M18 27V18H39L45 24V28" fill="var(--cutout-paper)" strokeWidth="2.5" />
      <path d="M39 18v7h6M25 24h7" strokeWidth="2" />
      <path d="M10 46 16 28H55L49 49Q48 52 43 52H14Q10 52 10 46Z" fill="var(--cutout-wash)" />
      <path d="M22 35h12" />
      <PrintDots x={34} y={40} />
    </PaperCutIcon>
  );
}

export function ProgressiveBlurIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-5} silhouette="M15 11H48L52 51 44 48 37 52 29 49 20 52 13 48Z">
      <path d="M22 20h20M21 28h21" />
      <path d="M21 36h21" strokeDasharray="1 5" />
      <g opacity="0.5"><PrintDots x={22} y={42} /><PrintDots x={34} y={42} /></g>
    </PaperCutIcon>
  );
}

export function InfiniteSliderIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-10} silhouette="M32 24C21 5 6 14 7 31S23 51 32 40C43 58 58 49 57 32S41 12 32 24Z">
      <path d="M32 24 42 39C48 46 53 39 51 32S45 23 39 31L26 42C18 49 12 40 13 31S19 21 25 29L32 40" />
      <path d="m16 10 4-3m26 46 3 4" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

export function CarouselIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={5} silhouette="M16 16 42 10 45 18 54 20 48 51 19 53 18 47 9 45 10 21Z">
      <path d="m16 17 30 1 1 35-28-1Z" fill="var(--cutout-paper)" />
      <path d="M21 24h20v19H21Z" strokeWidth="2" />
      <path d="m22 39 6-7 5 5 3-3 5 7" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <circle cx="35" cy="29" r="2" fill="currentColor" stroke="none" />
      <path d="M28 48h7" strokeWidth="2" />
    </PaperCutIcon>
  );
}

export function ModeTogglerIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={-8} silhouette="M32 8 37 15 46 12 47 21 55 25 50 33 55 41 46 45 45 54 36 51 29 57 24 49 15 50 15 41 7 36 13 29 10 20 20 19 23 10Z">
      <circle cx="32" cy="33" r="14" />
      <path d="M32 19a14 14 0 0 1 0 28Z" fill="currentColor" stroke="none" />
      <path d="M25 25q-7 8 0 16" strokeWidth="2" />
    </PaperCutIcon>
  );
}

function ThemeSwitcherIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={8} silhouette="M13 10H27V24L38 13 49 24 38 35H53V51H19Q13 51 13 45Z">
      <path d="M27 24v20q0 7-7 7M27 45l22-21M28 35h25" />
      <path d="M18 17h4v9h-4ZM37 23l4-4 4 5-4 4Z" fill="currentColor" strokeWidth="1.5" />
      <path d="M18 17h4v9h-4Z" fill="var(--chart-1)" stroke="none" />
      <circle cx="20" cy="44" r="2" fill="currentColor" stroke="none" />
      <PrintDots x={40} y={40} />
    </PaperCutIcon>
  );
}

export function StackPillsIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={-9} silhouette="M13 13H34Q41 13 41 21V23H49Q56 23 56 31T48 39H40V43Q40 51 32 51H14Q6 51 6 43T14 35H19V29H13Q6 29 6 21T13 13Z">
      <path d="M13 29h21q7 0 7-8M19 35h13q8 0 8 8M41 23h7q8 0 8 8t-8 8H40" />
      <path d="m15 18-3 3 3 3m15-6 3 3-3 3M23 40l-3 6M43 31h5" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

export function ContactChannelsIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-9} silhouette="M9 21 32 9 55 21 53 49Q53 53 48 53H14Q9 53 9 48Z">
      <path d="M17 27V14H46V29" fill="var(--cutout-paper)" />
      <path d="m10 24 21 14 23-15M10 49l16-14m10 1 17 14" />
      <path d="M35 24a4 4 0 1 0-4 4q4 0 4-6v3q0 5 5 1c4-8-11-14-16-6" strokeWidth="2" />
      <PrintDots x={16} y={42} />
    </PaperCutIcon>
  );
}

export function ProgressBarsIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={5} silhouette="M10 35H20V22H32V10H45V49H53V54H10Z">
      <path d="M20 35v14M32 22v27M10 49h35" />
      <path d="M36 16h5v28h-5Z" fill="var(--cutout-accent)" stroke="none" />
      <path d="m24 29 4-4m-4 12 4-4m-4 12 4-4" strokeWidth="2" />
      <path d="m9 23 6-6m-8 0h8v8" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

function GlyphCardIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={7} silhouette="M15 12 42 9Q46 9 48 14L55 39Q56 44 51 47L23 55Q18 56 16 51L8 24Q7 20 10 17Z">
      <path d="m15 12 7 29q1 3 5 2l28-7M22 43l1 12" />
      <path d="m22 33 3-16 12 12m-13-3 8-2" />
      <PrintDots x={34} y={42} />
    </PaperCutIcon>
  );
}

export function SectionRailIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={4} silhouette="M26 8H34V13H48L55 20 48 27H34V32H47V45H34V55H26V45H14L7 38 14 32H26V27H14V13H26Z">
      <path d="M15 13h33l7 7-7 7H15ZM47 32H14l-7 6 7 7H47Z" fill="var(--cutout-wash)" />
      <path d="M22 20h18M21 38h17M26 49h8" />
    </PaperCutIcon>
  );
}

export function CommandPaletteIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} silhouette="M17 10H44Q48 10 50 16L54 43Q54 49 49 51L19 54Q12 54 11 48L8 23Q8 18 12 14Z">
      <path d="m17 10-2 28q0 5 5 5l30-3M15 43l4 11" />
      <path d="M25 20v15a3 3 0 1 1-3-3h15a3 3 0 1 1-3 3V20a3 3 0 1 1 3 3H22a3 3 0 1 1 3-3" strokeWidth="2.5" />
      <PrintDots x={34} y={45} />
    </PaperCutIcon>
  );
}

export function ModelPickerIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={6} silhouette="M29 16V10H36V16H45Q51 16 51 23V28H56V40H50V47Q50 52 44 52H20Q14 52 14 46V40H8V28H14V23Q14 16 20 16Z">
      <path d="M21 25H44V37H21Z" fill="currentColor" />
      <path d="M27 29v4m11-4v4" stroke="var(--cutout-accent)" strokeWidth="3" />
      <path d="M27 44h11M14 28v12m37-12v12M29 8h7" />
      <PrintDots x={38} y={42} />
    </PaperCutIcon>
  );
}

export function WorkflowStatusIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-8} silhouette="M24 10 32 13 40 9 45 16 53 19 51 28 55 36 48 42 45 52 35 50 27 55 21 48 12 46 13 36 8 29 15 22 16 13Z">
      <circle cx="32" cy="32" r="14" strokeWidth="2" />
      <path d="m23 32 6 6 12-13" strokeWidth="3" />
      <path d="m17 50-1 8 8-5m18-3 4 6 1-9" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

export function SnakeIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={-6} silhouette="M16 12Q28 12 28 22V29H40Q53 29 53 41T40 53H21Q10 53 10 43V38H20V42H40Q43 42 43 39H26Q16 39 16 29V23H11V17Q11 12 16 12Z">
      <circle cx="19" cy="19" r="2" fill="currentColor" stroke="none" />
      <path d="M10 25H6m2 0-2 3M34 34v4M26 46v5M44 33l-3 5M17 44l-6 2" strokeWidth="2.5" />
      <path d="M41 16q-5-6 0-8 3-1 4 2 4-3 6 0 3 5-4 10Z" fill="var(--chart-2)" strokeWidth="2" />
      <path d="m46 9 2-4" strokeWidth="2" />
    </PaperCutIcon>
  );
}

export function PromptBarIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-5} silhouette="M13 18H49Q55 18 55 24V43Q55 48 49 48H15L8 53V24Q8 18 13 18Z">
      <path d="m21 28-4 11M28 38h5" />
      <path d="M44 39V27m-5 5 5-5 5 5" />
      <path d="m16 10 1-5m7 7 3-4" strokeWidth="2.5" />
      <PrintDots x={28} y={23} />
    </PaperCutIcon>
  );
}

export function SparklesIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={8} silhouette="M29 10 35 25 51 30 36 37 30 54 23 39 8 33 23 26Z">
      <path d="m29 10 1 23 21-3-15 7-6 17V33L8 33l15-7Z" fill="currentColor" strokeWidth="1.5" />
      <path d="m47 8 1 5 5 2-5 2-1 5-2-5-4-2 4-2Z" fill="var(--chart-1)" strokeWidth="2" />
      <path d="m12 47-2 3m34-3 3 3" strokeWidth="2.5" />
    </PaperCutIcon>
  );
}

export function RolodexIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" tilt={-5} silhouette="M15 15H19V10H26V15H38V10H45V15H49Q53 15 53 20V44L57 52H8L12 44V20Q12 15 15 15Z">
      <path d="M12 26h41M12 44h41M19 11v10m7-10v10m12-10v10m7-10v10" />
      <path d="M19 32h15m-15 6h10" strokeWidth="2.5" />
      <PrintDots x={38} y={31} />
      <path d="M19 48h28" strokeWidth="2" />
    </PaperCutIcon>
  );
}

const componentIcons: Record<ComponentIcon, ComponentType<ComponentIconProps>> = {
  home: HomeIcon,
  testimonial: TestimonialIcon,
  reactions: ReactionsIcon,
  todo: TodoIcon,
  globe: DottedWorldMapIcon,
  terminal: CopyCommandBlockIcon,
  git: GitHubMapIcon,
  folder: ProjectExplorerIcon,
  blur: ProgressiveBlurIcon,
  slider: InfiniteSliderIcon,
  carousel: CarouselIcon,
  theme: ModeTogglerIcon,
  appearance: ThemeSwitcherIcon,
  pills: StackPillsIcon,
  channels: ContactChannelsIcon,
  rail: SectionRailIcon,
  bars: ProgressBarsIcon,
  stack: GlyphCardIcon,
  command: CommandPaletteIcon,
  sparkles: SparklesIcon,
  prompt: PromptBarIcon,
  models: ModelPickerIcon,
  status: WorkflowStatusIcon,
  snake: SnakeIcon,
  rolodex: RolodexIcon,
};

export function getComponentIcon(name: ComponentIcon) {
  return componentIcons[name];
}
