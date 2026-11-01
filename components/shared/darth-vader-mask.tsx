import { useId, type SVGProps } from "react";
import { cn } from "@/lib/utils";

export function DarthVaderMask({ className, ...props }: SVGProps<SVGSVGElement>) {
  const id = useId();
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={cn("size-full overflow-visible", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-helmet`} x1="22" y1="38" x2="174" y2="176" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--vader-shell)" />
          <stop offset="0.19" stopColor="var(--vader-ink)" />
          <stop offset="0.5" stopColor="var(--vader-black)" />
          <stop offset="0.78" stopColor="var(--vader-ink)" />
          <stop offset="1" stopColor="var(--vader-shell)" />
        </linearGradient>
        <radialGradient id={`${id}-dome`} cx="0.43" cy="0.08" r="0.84">
          <stop stopColor="var(--vader-shell)" />
          <stop offset="0.27" stopColor="var(--vader-ink)" />
          <stop offset="0.7" stopColor="var(--vader-black)" />
          <stop offset="1" stopColor="var(--vader-shell)" />
        </radialGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0.28">
          <stop stopColor="var(--vader-ink)" />
          <stop offset="0.25" stopColor="var(--vader-shell)" />
          <stop offset="0.44" stopColor="var(--vader-silver)" />
          <stop offset="0.54" stopColor="var(--vader-shine)" />
          <stop offset="0.68" stopColor="var(--vader-shell)" />
          <stop offset="1" stopColor="var(--vader-ink)" />
        </linearGradient>
        <linearGradient id={`${id}-cheek`} x1="0" y1="0.2" x2="1" y2="0.65">
          <stop stopColor="var(--vader-ink)" />
          <stop offset="0.17" stopColor="var(--vader-silver)" />
          <stop offset="0.33" stopColor="var(--vader-shell)" />
          <stop offset="0.6" stopColor="var(--vader-ink)" />
          <stop offset="1" stopColor="var(--vader-black)" />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx="0.55" cy="0.28" r="0.8">
          <stop stopColor="var(--vader-shell)" />
          <stop offset="0.35" stopColor="var(--vader-ink)" />
          <stop offset="0.8" stopColor="var(--vader-black)" />
        </radialGradient>
        <radialGradient id={`${id}-chin`} cx="0.48" cy="0.85" r="0.8">
          <stop stopColor="var(--vader-silver)" />
          <stop offset="0.28" stopColor="var(--vader-shell)" />
          <stop offset="0.65" stopColor="var(--vader-ink)" />
          <stop offset="1" stopColor="var(--vader-black)" />
        </radialGradient>
        <radialGradient id={`${id}-bolt`} cx="0.35" cy="0.28" r="0.7">
          <stop stopColor="var(--vader-shine)" />
          <stop offset="0.4" stopColor="var(--vader-silver)" />
          <stop offset="0.7" stopColor="var(--vader-shell)" />
          <stop offset="1" stopColor="var(--vader-black)" />
        </radialGradient>
        <pattern id={`${id}-mesh`} width="5" height="3.6" patternUnits="userSpaceOnUse">
          <path d="m0 0 2.5 1.8L5 0M0 3.6l2.5-1.8L5 3.6" stroke="var(--vader-silver)" strokeOpacity="0.45" strokeWidth="0.6" />
        </pattern>
        <g id={`${id}-left-face`}>
          {/* The flared shell, brow ridge, and recessed eyepiece. */}
          <path d="M29 87C24 112 10 163 4 181Q22 187 45 186L54 152 47 113Z" fill={paint("helmet")} />
          <path d="M30 95C23 124 13 164 8 180M35 106C29 131 23 159 22 178" stroke="var(--vader-silver)" strokeOpacity="0.22" strokeWidth="1.4" />
          <path d="M30 90Q42 70 62 70C78 70 89 77 96 85L93 97C86 85 74 79 63 79 48 79 40 85 35 97Z" fill={paint("metal")} />
          <path d="M33 98C34 83 47 75 62 75 79 75 91 82 93 94L91 110C83 118 64 120 49 114 37 110 33 106 33 98Z" fill="var(--vader-black)" stroke="var(--vader-shell)" strokeWidth="1.6" />
          <path d="M39 98C40 86 49 81 63 81 77 81 86 87 87 98L85 108C76 113 59 114 48 109 41 107 38 103 39 98Z" fill={paint("lens")} stroke="var(--vader-ink)" strokeWidth="1.1" />
          <path d="M49 90q3-4 7-3c-3 7-4 14-1 23l-5-1c-3-6-3-13-1-19Z" fill="var(--vader-shine)" opacity="0.8" />
          <path d="M43 85Q64 72 84 89M40 108Q54 118 77 113" stroke="var(--vader-silver)" strokeWidth="0.9" opacity="0.45" />
          {/* Faceted cheek, the deep outer recess, and respirator rails. */}
          <path d="M36 117Q54 123 83 117L91 132 65 157 48 163Z" fill="var(--vader-black)" />
          <path d="m51 125 34-7-7 17-17 17Z" fill={paint("cheek")} stroke="var(--vader-shell)" strokeWidth="0.9" />
          <path d="m52 125 7 24 7-8 14-19" stroke="var(--vader-shine)" strokeOpacity="0.65" strokeWidth="1.1" />
          <path d="m61 152 24-23-11 25-13 9-8-6Z" fill={paint("helmet")} stroke="var(--vader-shell)" strokeWidth="0.8" />
          <path d="m63 155 17-16M65 160l10-7" stroke="var(--vader-silver)" strokeWidth="0.8" opacity="0.7" />
          <path d="m89 131-24 32-8-2 29-32Z" fill="var(--vader-black)" stroke="var(--vader-silver)" strokeWidth="0.8" />
          <path d="m89 137-20 25M84 140l-3 6m-1-2-3 7m-1-1-3 7" stroke="var(--vader-silver)" strokeWidth="0.9" opacity="0.6" />
          <path d="M31 124q-5 26 12 47l9-9-12-35Z" fill={paint("helmet")} />
          <path d="M39 143q-1 12 7 19" stroke="var(--vader-silver)" strokeWidth="1.2" opacity="0.4" />
        </g>
      </defs>

      {/* One continuous helmet silhouette keeps its shape at header size. */}
      <path d="M99 3C57 3 36 29 29 72L24 104 2 181Q0 185 9 186L42 189C45 207 69 218 100 219S155 207 158 189L191 186Q200 185 198 181L176 104 171 72C164 29 143 3 101 3Z" fill={paint("helmet")} stroke="var(--vader-silver)" strokeOpacity="0.65" strokeWidth="1.1" />
      <path d="M29 90C29 32 56 8 96 5H104C144 8 171 32 171 90L147 73C131 68 116 73 108 81H92C84 73 69 68 53 73Z" fill={paint("dome")} />
      <path d="M31 81C35 38 55 16 88 12M112 12c33 4 52 26 57 69" stroke="var(--vader-silver)" strokeWidth="2.2" opacity="0.45" />
      <path d="M47 40Q62 19 86 15M113 15q12 1 22 7" stroke="var(--vader-shine)" strokeWidth="1.5" opacity="0.7" />
      <path d="M90 7Q100 3 110 7L108 32l-16 1Z" fill={paint("metal")} />
      <path d="M94 11h12l-1 18H95Z" fill="var(--vader-black)" />
      <path d="M94 32h12l2 39-8 9-8-9Z" fill="var(--vader-ink)" />
      <path d="m93 15-1 17m16-17 1 17" stroke="var(--vader-shine)" strokeWidth="0.8" opacity="0.6" />
      <path d="m67 61 11 11-15-3ZM133 61l-11 11 15-3Z" fill={paint("metal")} opacity="0.45" />

      <use href={`#${id}-left-face`} />
      <use href={`#${id}-left-face`} transform="translate(200 0) scale(-1 1)" />

      {/* Ribbed nose bridge and the bright central breathing assembly. */}
      <path d="m92 83 8 3 8-3 3 27-11 13-11-13Z" fill={paint("metal")} stroke="var(--vader-shell)" strokeWidth="1" />
      <path d="m95 89 5-2 5 2m-11 6 6-2 6 2m-12 5 6-2 6 2m-13 6 7-3 7 3" stroke="var(--vader-black)" strokeWidth="2.5" />
      <path d="m96 90 4-1 4 1m-9 6 5-1 5 1m-11 6 6-2 6 2" stroke="var(--vader-shine)" strokeWidth="0.65" opacity="0.65" />
      <path d="M88 128c0-12 3-23 12-23s12 11 12 23l-4 9H92Z" fill="var(--vader-black)" stroke="var(--vader-shell)" strokeWidth="1.2" />
      <path d="M92 129c0-11 2-18 8-18s8 7 8 18l-2 4H94Z" fill={paint("metal")} stroke="var(--vader-silver)" strokeWidth="0.9" />
      <path d="M99 114c-3 1-4 6-3 14" stroke="var(--vader-shine)" strokeWidth="1.8" opacity="0.85" />

      {/* Triangular mouth grille, with individual recessed vertical slots. */}
      <path d="m92 136-27 30h70l-27-30Z" fill="var(--vader-black)" stroke="var(--vader-shell)" strokeWidth="1.1" />
      <path d="m93 138-6 24m12-25-2 25m7-25 3 25m0-23 8 23m-27-17-7 17m32-15 10 15" stroke="var(--vader-shell)" strokeWidth="2" />
      <path d="M85 151h30m-33 5h36m-38 5h41" stroke="var(--vader-silver)" strokeWidth="0.7" opacity="0.25" />
      <path d="m91 137-21 26m39-26 21 26M65 167h70" stroke="var(--vader-silver)" strokeWidth="1.1" opacity="0.7" />

      {/* Rounded chin armor, mesh intake, and the two silver tusk fittings. */}
      <path d="M58 164Q100 173 142 164l12 20c1 21-22 34-54 34s-55-13-54-34Z" fill={paint("chin")} stroke="var(--vader-shell)" strokeWidth="1.1" />
      <path d="M65 170q35 4 70 0M49 183q1-8 7-12m89 12q-1-8-7-12M65 209q35 13 70 0" stroke="var(--vader-silver)" strokeWidth="1.8" opacity="0.4" />
      <path d="M75 174h50q2 0 0 3l-23 14q-2 1-4 0l-23-14q-2-3 0-3Z" fill="var(--vader-black)" stroke="var(--vader-shell)" strokeWidth="1.1" />
      <path d="M76 175h48l-24 15Z" fill={paint("mesh")} />
      <path d="M92 213q8 2 16 0" stroke="var(--vader-shine)" strokeWidth="1.6" opacity="0.45" />
      <g fill={paint("bolt")} stroke="var(--vader-silver)" strokeWidth="0.9">
        <circle cx="63" cy="164" r="4.8" />
        <circle cx="137" cy="164" r="4.8" />
      </g>
      <path d="m60 165 2-4 3 1m69 3 2-4 3 1" stroke="var(--vader-shine)" strokeWidth="1.1" />
    </svg>
  );
}
