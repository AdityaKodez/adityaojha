import {
  PaperCutIcon,
  PrintDots,
  type PaperCutIconProps,
} from "@/components/showcase/component-icons";

type ActivityIconProps = Pick<PaperCutIconProps, "size" | "className">;

export function MusicActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-7}
      silhouette="M13 14H50Q54 14 54 18V49Q54 53 50 53H13Q9 53 9 49V18Q9 14 13 14Z"
    >
      <circle cx="29" cy="32" r="14" fill="var(--cutout-paper)" />
      <circle cx="29" cy="32" r="9" strokeWidth="1.5" />
      <circle cx="29" cy="32" r="4" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <path d="M47 21v13l-7 9m-2-2 4 3M16 47h8" strokeWidth="2.5" />
      <circle cx="47" cy="21" r="2" fill="currentColor" stroke="none" />
      <PrintDots x={43} y={46} />
    </PaperCutIcon>
  );
}

export function WatchingActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      accent="var(--chart-1)"
      tilt={5}
      silhouette="M28 19 19 9 28 19 39 8 28 19H49Q54 19 54 24V46Q54 51 49 51H14Q9 51 9 46V24Q9 19 14 19ZM18 52l-2 4m29-4 2 4"
    >
      <path d="M16 25H39V44H16Z" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="m25 30 8 5-8 5Z" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <circle cx="47" cy="28" r="2" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <path d="M45 36h4m-4 5h4M18 52l-2 4m29-4 2 4" strokeWidth="2" />
      <PrintDots x={18} y={37} />
    </PaperCutIcon>
  );
}

export function PlayingActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-8}
      silhouette="M21 21H43Q50 21 52 29L56 45Q58 54 50 53L40 45H24L14 53Q6 54 8 45L12 29Q14 21 21 21Z"
    >
      <path d="M21 28v12m-6-6h12" strokeWidth="3" />
      <circle cx="44" cy="30" r="3" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <circle cx="38" cy="37" r="3" fill="var(--cutout-paper)" strokeWidth="1.5" />
      <path d="M28 25h8" strokeWidth="1.5" />
      <PrintDots x={31} y={44} />
    </PaperCutIcon>
  );
}

export function StreamingActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      accent="var(--chart-1)"
      tilt={6}
      silhouette="M25 11H35Q39 11 39 16V27H45V33Q45 43 33 45V48H43V54H17V48H27V45Q15 43 15 33V27H21V16Q21 11 25 11ZM46 16q5 6 0 12m6-17q9 11 0 22"
    >
      <path d="M22 29h16v4q0 6-8 6t-8-6Z" fill="var(--cutout-accent)" strokeWidth="2" />
      <path d="M26 18h8m-8 6h8M15 29v4q0 12 15 12t15-12v-4" strokeWidth="2" />
      <path d="M46 16q5 6 0 12m6-17q9 11 0 22" strokeWidth="2" />
      <PrintDots x={25} y={31} />
    </PaperCutIcon>
  );
}

export function CodingActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-6}
      silhouette="M15 12H49Q53 12 53 16V43L58 51Q58 54 54 54H10Q6 54 6 51L11 43V16Q11 12 15 12Z"
    >
      <path d="M17 18h30v23H17Z" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="m23 25 5 5-5 5m11 0h7" strokeWidth="2.5" />
      <path d="M11 44h42l4 7H7Z" fill="var(--cutout-accent)" strokeWidth="2" />
      <path d="M27 48h10" strokeWidth="1.5" />
      <PrintDots x={36} y={20} />
    </PaperCutIcon>
  );
}

export function CompetingActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      accent="var(--chart-1)"
      tilt={7}
      silhouette="M20 11H44V17H54V25Q54 35 42 36 39 41 35 42V49H43V55H21V49H29V42Q24 41 21 36 10 35 10 25V17H20Z"
    >
      <path d="M20 18H15v7q0 6 6 6m23-13h5v7q0 6-6 6" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="M20 12h24v16q0 14-12 14T20 28Z" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="m32 19 3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1Z" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <path d="M22 50h20" strokeWidth="2" />
      <PrintDots x={24} y={46} />
    </PaperCutIcon>
  );
}

export function GenericActivityIcon(props: ActivityIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-8}
      silhouette="M37 9 42 23 55 29 43 37 39 52 29 41 15 43 21 29 15 16 30 19ZM13 48l-5 4m7-17-8 2M24 52l-3 5"
    >
      <path d="m37 9 1 20 17 0-17 6 1 17-8-17-16 8 12-15-12-12 18 8Z" fill="var(--cutout-accent)" strokeWidth="1.5" />
      <path d="m13 48-5 4m7-17-8 2M24 52l-3 5" strokeWidth="2" />
      <PrintDots x={40} y={29} />
    </PaperCutIcon>
  );
}
