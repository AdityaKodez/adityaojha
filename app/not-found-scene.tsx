"use client";

import { useEffect, useRef } from "react";
import styles from "./not-found-scene.module.css";

type Point = readonly [number, number];
type TrackSample = { x: number; y: number; distance: number };
type Tree = { x: number; y: number; r: number; tone: number; swirl: boolean };

const SCENE_SIZE = 480;
const CAR_BOX = 30;
const LANE_OFFSET = 5;
const CAR_SPEED = 34;
const LOOP_PAUSE = 1.6;

const MAIN_ROAD: Point[] = [
  [268, -24],
  [262, 20],
  [222, 52],
  [210, 96],
  [198, 140],
  [206, 176],
  [232, 214],
  [258, 252],
  [282, 286],
  [286, 330],
  [290, 374],
  [270, 410],
  [246, 446],
  [232, 468],
  [226, 488],
  [224, 504],
];

const BRANCH_ROADS = [
  "M286 336C310 334 336 333 372 337",
  "M250 440C220 432 190 430 150 432C100 434 40 438 -20 436",
];
const DRIVEWAY = "M206 154C196 154 186 153 172 152";
const RIVER =
  "M520 210C468 204 420 214 398 246C376 278 378 312 392 348C406 384 432 412 434 450C435 470 430 490 426 510";
const FIELD_BAND = "M228 70C300 88 390 108 520 130";
const HEDGES = [
  "M84 -20C86 10 86 30 84 42",
  "M-20 40C40 42 110 48 146 64C170 76 186 88 204 98",
  "M-20 192C60 190 140 190 224 198",
  "M92 192C90 260 92 360 90 440",
  "M120 438C118 460 118 480 120 500",
  "M332 92C326 130 322 180 322 216",
  "M236 220C280 214 330 214 380 240",
  "M274 404C310 396 360 400 404 424",
  "M410 318C440 314 470 312 520 316",
];

const FOREST: Point[] = [
  [-30, 50],
  [40, 50],
  [104, 57],
  [138, 70],
  [162, 86],
  [176, 104],
  [178, 168],
  [166, 182],
  [120, 187],
  [40, 187],
  [-30, 187],
];
const CLEARING = { x: 160, y: 152, rx: 21, ry: 25 };

const BUSHES: [number, number, number][] = [
  [94, 196, 5],
  [101, 204, 3.8],
  [91, 318, 4.4],
  [93, 328, 3.4],
  [322, 217, 5],
  [331, 211, 3.8],
  [334, 95, 4.4],
  [305, 349, 4],
  [313, 352, 3.2],
  [242, 80, 4],
  [278, 406, 4.6],
  [413, 321, 4.2],
  [421, 317, 3.2],
  [121, 445, 4],
  [127, 453, 3],
  [184, 174, 4.4],
  [188, 165, 3.4],
];

const BIRDS: Point[] = [
  [28, 18],
  [52, 27],
  [130, 22],
  [300, 28],
  [352, 42],
  [410, 64],
  [276, 140],
  [300, 172],
  [382, 152],
  [40, 240],
  [58, 300],
  [32, 380],
  [130, 232],
  [200, 362],
  [142, 400],
  [312, 282],
  [332, 252],
  [330, 372],
  [352, 452],
  [456, 282],
  [450, 402],
  [40, 466],
  [180, 462],
  [204, 252],
];

function pathFromPoints(points: Point[]) {
  const [start, ...curves] = points;
  let path = `M${start[0]} ${start[1]}`;
  for (let index = 0; index < curves.length; index += 3) {
    path += `C${curves[index].join(" ")} ${curves[index + 1].join(" ")} ${curves[index + 2].join(" ")}`;
  }
  return path;
}

function polygonPath(points: Point[]) {
  return `M${points.map((point) => point.join(" ")).join("L")}Z`;
}

function cubicPoint(start: Point, first: Point, second: Point, end: Point, t: number) {
  const inverse = 1 - t;
  const a = inverse * inverse * inverse;
  const b = 3 * inverse * inverse * t;
  const c = 3 * inverse * t * t;
  const d = t * t * t;
  return [
    a * start[0] + b * first[0] + c * second[0] + d * end[0],
    a * start[1] + b * first[1] + c * second[1] + d * end[1],
  ] as const;
}

function sampleTrack(points: Point[], steps = 64) {
  const samples: TrackSample[] = [];
  let distance = 0;
  for (let index = 0; index + 3 < points.length; index += 3) {
    for (let step = index === 0 ? 0 : 1; step <= steps; step++) {
      const [x, y] = cubicPoint(
        points[index],
        points[index + 1],
        points[index + 2],
        points[index + 3],
        step / steps,
      );
      const previous = samples[samples.length - 1];
      if (previous) distance += Math.hypot(x - previous.x, y - previous.y);
      samples.push({ x, y, distance });
    }
  }
  return samples;
}

const TRACK = sampleTrack(MAIN_ROAD);
const TRACK_LENGTH = TRACK[TRACK.length - 1].distance;

function sampleIndex(distance: number) {
  let low = 0;
  let high = TRACK.length - 1;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (TRACK[middle].distance < distance) low = middle + 1;
    else high = middle;
  }
  return Math.max(1, low);
}

function headingAt(distance: number) {
  const index = sampleIndex(Math.min(TRACK_LENGTH, Math.max(0, distance)));
  const before = TRACK[Math.max(0, index - 2)];
  const after = TRACK[Math.min(TRACK.length - 1, index + 1)];
  return Math.atan2(after.y - before.y, after.x - before.x);
}

function carPose(distance: number) {
  const clamped = Math.min(TRACK_LENGTH, Math.max(0, distance));
  const index = sampleIndex(clamped);
  const previous = TRACK[index - 1];
  const next = TRACK[index];
  const span = next.distance - previous.distance || 1;
  const progress = (clamped - previous.distance) / span;
  const angle = headingAt(clamped);
  // India drives on the left, which is the driver's left of the heading.
  const x = previous.x + (next.x - previous.x) * progress + Math.sin(angle) * LANE_OFFSET;
  const y = previous.y + (next.y - previous.y) * progress - Math.cos(angle) * LANE_OFFSET;
  return { x, y, angle };
}

function sceneTransforms(distance: number) {
  const { x, y, angle } = carPose(distance);
  const half = CAR_BOX / 2;
  const left = (((x - half) / CAR_BOX) * 100).toFixed(2);
  const top = (((y - half) / CAR_BOX) * 100).toFixed(2);
  const tagX = ((x / SCENE_SIZE) * 100).toFixed(2);
  const tagY = ((y / SCENE_SIZE) * 100).toFixed(2);
  return {
    car: `translate(${left}%, ${top}%) rotate(${((angle * 180) / Math.PI).toFixed(2)}deg)`,
    tag: `translate(${tagX}%, ${tagY}%)`,
  };
}

function turnAt(distance: number) {
  let turn = Math.abs(headingAt(distance + 12) - headingAt(distance - 12));
  if (turn > Math.PI) turn = Math.PI * 2 - turn;
  return turn;
}

function findDistance(targetY: number) {
  let best = TRACK[0];
  for (const sample of TRACK) {
    if (Math.abs(sample.y - targetY) < Math.abs(best.y - targetY)) best = sample;
  }
  return best.distance;
}

const RESTING_DISTANCE = findDistance(312);
const RESTING_POSE = sceneTransforms(RESTING_DISTANCE);

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function insidePolygon(x: number, y: number, polygon: Point[]) {
  let inside = false;
  for (let index = 0, last = polygon.length - 1; index < polygon.length; last = index++) {
    const [xi, yi] = polygon[index];
    const [xj, yj] = polygon[last];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const round = (value: number) => Math.round(value * 10) / 10;

function plantForest() {
  const random = seededRandom(17);
  const trees: Tree[] = [];
  for (let row = 0; row < 14; row++) {
    for (let column = 0; column < 19; column++) {
      const x = -22 + column * 11.5 + (row % 2) * 5.8 + (random() - 0.5) * 7;
      const y = 50 + row * 10.5 + (random() - 0.5) * 7;
      const r = 6.6 + random() * 5.6;
      const roll = random();
      const tone = roll < 0.24 ? 1 : roll < 0.48 ? 2 : roll < 0.68 ? 3 : roll < 0.8 ? 4 : roll < 0.92 ? 5 : 6;
      const swirl = random() > 0.45;
      const clearing =
        ((x - CLEARING.x) / CLEARING.rx) ** 2 + ((y - CLEARING.y) / CLEARING.ry) ** 2 < 1;
      if (!clearing && insidePolygon(x, y, FOREST)) {
        trees.push({ x: round(x), y: round(y), r: round(r), tone, swirl });
      }
    }
  }
  // Light comes from the upper right, so lower-left canopies are drawn first
  // and each shadow lands on the neighbours below it.
  return trees.sort((a, b) => b.y - b.x * 0.5 - (a.y - a.x * 0.5));
}

const TREES = plantForest();
const HIGHLIGHT: Record<number, string> = {
  1: "leaf-2",
  2: "leaf-3",
  3: "leaf-4",
  4: "leaf-light",
  5: "leaf-6",
  6: "leaf-4",
};

const tone = (name: string) => `var(--meadow-${name})`;

function Canopy({ tree }: { tree: Tree }) {
  const { x, y, r, swirl } = tree;
  return (
    <g>
      <circle cx={x - 2.4} cy={y + 3.2} r={r + 0.6} fill={tone("forest-deep")} opacity={0.75} />
      <circle cx={x} cy={y} r={r} fill={tone(`leaf-${tree.tone}`)} />
      <circle
        cx={round(x + r * 0.2)}
        cy={round(y - r * 0.22)}
        r={round(r * 0.64)}
        fill={tone(HIGHLIGHT[tree.tone])}
        opacity={tree.tone === 4 ? 0.35 : 0.7}
      />
      {swirl && (
        <path
          d={`M${round(x - r * 0.34)} ${round(y + r * 0.08)}a${round(r * 0.42)} ${round(r * 0.42)} 0 0 1 ${round(r * 0.6)} ${round(-r * 0.36)}`}
          fill="none"
          stroke={tone("leaf-light")}
          strokeWidth={0.7}
          strokeLinecap="round"
          opacity={0.4}
        />
      )}
    </g>
  );
}

const ROAD_PATH = pathFromPoints(MAIN_ROAD);

type NetworkWidths = { road: number; branch: number; river: number; band: number; hedge: number };

function Network({ widths }: { widths: NetworkWidths }) {
  return (
    <>
      <path d={RIVER} strokeWidth={widths.river} />
      <path d={FIELD_BAND} strokeWidth={widths.band} />
      {HEDGES.map((hedge) => (
        <path key={hedge} d={hedge} strokeWidth={widths.hedge} />
      ))}
      {BRANCH_ROADS.map((road) => (
        <path key={road} d={road} strokeWidth={widths.branch} />
      ))}
      <path d={ROAD_PATH} strokeWidth={widths.road} />
    </>
  );
}

function Road({ path, width }: { path: string; width: number }) {
  return (
    <>
      <path d={path} stroke={tone("road")} strokeWidth={width} />
      <path d={path} stroke={tone("road-track")} strokeWidth={width * 0.62} />
      <path d={path} stroke={tone("road")} strokeWidth={width * 0.34} />
    </>
  );
}

function Scenery() {
  return (
    <g id="nf-art">
      <rect width="480" height="480" fill={tone("field")} filter="url(#nf-grain)" />

      <g fill="none" stroke={tone("hedge")} strokeLinecap="round" filter="url(#nf-goo)">
        <Network widths={{ road: 46, branch: 40, river: 76, band: 21, hedge: 13 }} />
      </g>
      <g fill="none" stroke={tone("grass")} strokeLinecap="round" filter="url(#nf-goo)">
        <Network widths={{ road: 40, branch: 34, river: 70, band: 15, hedge: 8 }} />
      </g>

      <g fill="none" strokeLinecap="round" filter="url(#nf-rough)">
        {BRANCH_ROADS.map((road) => (
          <Road key={road} path={road} width={20} />
        ))}
        <path d={DRIVEWAY} stroke={tone("road")} strokeWidth={9} />
        <Road path={ROAD_PATH} width={22} />
      </g>

      <g fill="none" strokeLinecap="round">
        <path d={RIVER} stroke={tone("sand")} strokeWidth={54} filter="url(#nf-rough)" />
        <path d={RIVER} stroke={tone("water-deep")} strokeWidth={46} />
        <path d={RIVER} stroke={tone("water")} strokeWidth={32} filter="url(#nf-soft)" />
        <g mask="url(#nf-water)" stroke={tone("water-light")} strokeWidth={1.3} opacity={0.75}>
          <path d={RIVER} strokeDasharray="22 34 8 40" transform="translate(-8 -6)" />
          <path d={RIVER} strokeDasharray="14 46 26 30" strokeDashoffset={30} />
          <path d={RIVER} strokeDasharray="30 38 10 52" transform="translate(9 6)" />
        </g>
      </g>

      <g>
        <path d={polygonPath(FOREST)} fill={tone("forest-deep")} filter="url(#nf-goo)" />
        <ellipse cx={162} cy={154} rx={19} ry={23} fill={tone("grass")} filter="url(#nf-rough)" />
        <path
          d="M164 140C172 138 180 141 184 147L186 160C178 165 168 166 160 163Z"
          fill={tone("road")}
          opacity={0.9}
          filter="url(#nf-rough)"
        />
        {TREES.map((tree) => (
          <Canopy key={`${tree.x}-${tree.y}`} tree={tree} />
        ))}
      </g>

      <g transform="translate(159 151) rotate(-7)">
        <rect x={-14.5} y={-13} width={22} height={34} rx={1.5} fill={tone("forest-deep")} opacity={0.4} />
        <rect x={-15} y={-2} width={7} height={11} rx={0.8} fill={tone("wall")} />
        <rect x={-9} y={-16} width={9} height={32} rx={0.8} fill={tone("roof-shade")} />
        <rect x={0} y={-16} width={9} height={32} rx={0.8} fill={tone("roof")} />
        <path d="M0 -15.6V15.6" stroke={tone("wall")} strokeWidth={0.6} opacity={0.55} />
      </g>

      <g>
        <ellipse
          cx={155}
          cy={309}
          rx={24}
          ry={21}
          fill={tone("field-shadow")}
          opacity={0.6}
          filter="url(#nf-soft)"
        />
        {Array.from({ length: 9 }, (_, index) => {
          const angle = (index / 9) * Math.PI * 2;
          return (
            <circle
              key={index}
              cx={round(164 + Math.cos(angle) * 16.5)}
              cy={round(300 + Math.sin(angle) * 16.5)}
              r={6.8}
              fill={tone("leaf-3")}
            />
          );
        })}
        <circle cx={164} cy={300} r={20} fill={tone("leaf-3")} />
        <circle cx={160} cy={305} r={15} fill={tone("leaf-2")} opacity={0.35} />
        <circle cx={168.5} cy={295} r={13} fill={tone("leaf-4")} opacity={0.85} />
        <g
          fill="none"
          stroke={tone("leaf-light")}
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={0.55}
        >
          <path d="M158 297a7 7 0 0 1 10 -5" />
          <path d="M167 307a6 6 0 0 0 8 -6" />
          <path d="M152 305a5 5 0 0 0 5 5" />
          <path d="M170 288a4 4 0 0 1 5 3" />
        </g>
      </g>

      <g>
        {BUSHES.map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x - 1.6} cy={y + 2} r={r + 0.4} fill={tone("forest-deep")} opacity={0.4} />
            <circle cx={x} cy={y} r={r} fill={tone(r > 4 ? "leaf-3" : "leaf-4")} />
            <circle
              cx={round(x + r * 0.25)}
              cy={round(y - r * 0.28)}
              r={round(r * 0.5)}
              fill={tone("leaf-light")}
              opacity={0.35}
            />
          </g>
        ))}
      </g>

      <g
        fill="none"
        stroke={tone("bird")}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {BIRDS.map(([x, y], index) => (
          <path
            key={`${x}-${y}`}
            d="M-2.2 -1.2 0 1 2.6 -1.8"
            transform={`translate(${x} ${y}) rotate(${((index * 37) % 30) - 15})`}
          />
        ))}
      </g>
    </g>
  );
}

function SceneFilters() {
  return (
    <defs>
      <filter id="nf-grain" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={3} seed={4} result="mottle" />
        <feColorMatrix
          in="mottle"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 -1.35"
          result="shadeMask"
        />
        <feColorMatrix
          in="mottle"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 -1.45"
          result="glowMask"
        />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={11} result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 0 0 0 -5.1"
          result="speckMask"
        />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 0 0 -5.3"
          result="glintMask"
        />
        <feFlood style={{ floodColor: tone("field-shade") }} floodOpacity={0.7} />
        <feComposite in2="shadeMask" operator="in" result="shade" />
        <feFlood style={{ floodColor: tone("field-glow") }} floodOpacity={0.55} />
        <feComposite in2="glowMask" operator="in" result="glow" />
        <feFlood style={{ floodColor: tone("field-speck") }} floodOpacity={0.8} />
        <feComposite in2="speckMask" operator="in" result="speck" />
        <feFlood style={{ floodColor: tone("field-glow") }} floodOpacity={0.8} />
        <feComposite in2="glintMask" operator="in" result="glint" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="shade" />
          <feMergeNode in="glow" />
          <feMergeNode in="speck" />
          <feMergeNode in="glint" />
        </feMerge>
      </filter>
      <filter id="nf-goo" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 14 -6"
          result="goo"
        />
        <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves={2} seed={2} result="noise" />
        <feDisplacementMap in="goo" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="nf-rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={8} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="nf-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <mask id="nf-water" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480">
        <path d={RIVER} fill="none" stroke="white" strokeWidth={42} />
      </mask>
    </defs>
  );
}

function Car() {
  return (
    <>
      <defs>
        <linearGradient id="nf-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: tone("beam") }} stopOpacity={0.9} />
          <stop offset="1" style={{ stopColor: tone("beam") }} stopOpacity={0} />
        </linearGradient>
        <filter id="nf-car-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <path className={styles.beam} d="M10 -4.6 30 -11V11L10 4.6Z" fill="url(#nf-beam)" />
      <rect
        x={-12}
        y={-6}
        width={24}
        height={12}
        rx={3.8}
        fill={tone("forest-deep")}
        opacity={0.35}
        filter="url(#nf-car-shadow)"
      />
      <rect x={-11} y={-5} width={22} height={10} rx={3} fill={tone("car")} />
      <rect x={-11} y={1.6} width={22} height={3.4} rx={1.6} fill={tone("car-shade")} opacity={0.7} />
      <rect
        x={-6.8}
        y={-3.9}
        width={11}
        height={7.8}
        rx={1.6}
        fill={tone("car")}
        stroke={tone("car-shade")}
        strokeWidth={0.4}
      />
      <path d="M4.6 -3.9Q7.8 -3.5 8 0Q7.8 3.5 4.6 3.9Z" fill={tone("glass")} />
      <path d="M-8.4 -3.4Q-9.6 0 -8.4 3.4L-7.2 3.2Q-7.9 0 -7.2 -3.2Z" fill={tone("glass")} />
      <rect x={3.6} y={-6} width={1.6} height={1.2} rx={0.4} fill={tone("car-shade")} />
      <rect x={3.6} y={4.8} width={1.6} height={1.2} rx={0.4} fill={tone("car-shade")} />
      <circle cx={10.3} cy={-3.2} r={0.9} fill={tone("beam")} />
      <circle cx={10.3} cy={3.2} r={0.9} fill={tone("beam")} />
      <rect x={-11.2} y={-4.2} width={0.9} height={1.8} rx={0.3} fill={tone("tail-light")} />
      <rect x={-11.2} y={2.4} width={0.9} height={1.8} rx={0.3} fill={tone("tail-light")} />
    </>
  );
}

export function NotFoundScene({ carLabel }: { carLabel: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<SVGSVGElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const car = carRef.current;
    const tag = tagRef.current;
    if (!host || !car || !tag) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastFrame = 0;
    let visible = false;
    let distance = RESTING_DISTANCE;
    let pause = 0;

    const place = () => {
      const pose = sceneTransforms(distance);
      car.style.transform = pose.car;
      tag.style.transform = pose.tag;
    };

    const tick = (now: number) => {
      const delta = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      if (pause > 0) {
        pause -= delta;
      } else {
        // Ease off through bends, like a driver would.
        distance += CAR_SPEED * (1 - Math.min(0.4, turnAt(distance) * 1.1)) * delta;
        if (distance >= TRACK_LENGTH) {
          distance = 0;
          pause = LOOP_PAUSE;
        }
      }
      place();
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      if (reducedMotion.matches) {
        distance = RESTING_DISTANCE;
        pause = 0;
        place();
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(host);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.scene} aria-hidden="true">
      <svg viewBox="0 0 480 480" className={styles.art} focusable="false">
        <SceneFilters />
        <Scenery />
      </svg>
      <svg
        ref={carRef}
        viewBox={`${-CAR_BOX / 2} ${-CAR_BOX / 2} ${CAR_BOX} ${CAR_BOX}`}
        className={styles.car}
        style={{ transform: RESTING_POSE.car }}
        focusable="false"
      >
        <Car />
      </svg>
      <div ref={tagRef} className={styles.tagTrack} style={{ transform: RESTING_POSE.tag }}>
        <span className="absolute left-3 top-0 -translate-y-[calc(100%+0.625rem)] whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-medium leading-none text-primary-foreground shadow-sm">
          {carLabel}
        </span>
      </div>
    </div>
  );
}
