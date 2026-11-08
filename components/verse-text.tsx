/**
 * <VerseText />: text that prints like a misregistered comic, then keeps glitching.
 * React only. The text stays real and selectable; reduced motion shows it printed.
 */

'use client'

import {
  type CSSProperties,
  Fragment,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

/** mulberry32: a small seeded PRNG, uniform in [0, 1). */
function rng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Two numbers mixed into one 32-bit seed (murmur3's finalizer). */
function mixSeed(a: number, b: number): number {
  let h = (Math.imul(a >>> 0, 0x9e3779b1) ^ (b >>> 0)) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}

/** One tick: a frame on ones, 24 a second. A hold on twos lasts two. */
const FRAME_MS = 1000 / 24

/** The flat glitch colours, named as in verse-text.css. */
const FLAT = ['violet', 'magenta', 'green', 'gold'] as const

/** Which flat colours carry dark ink; the rest carry white. */
const FLAT_LIGHT = [false, false, true, true] as const

type Point = [number, number]

interface Plates {
  /** The cyan, magenta and yellow plates' offsets from register, em. */
  c: Point
  m: Point
  y: Point
}

interface Shard {
  /** The piece, as polygon points in % of the word's box. */
  points: Point[]
  /** The same piece grown about its centre: its black edge. */
  rim: Point[]
  /** Its centre, % of the word's box. */
  cx: number
  cy: number
  /** How far it is pushed out, em, and turned, degrees. */
  dx: number
  dy: number
  turn: number
  /** Its flat colour, an index into FLAT. */
  color: number
  /** The angle of its motion streak, degrees, or -1 for none. */
  streak: number
}

interface Copy {
  /** Offset, em, and flat colour (FLAT index). */
  dx: number
  dy: number
  color: number
}

/** How a word looks for one frame. */
interface Look {
  /** The black key is printed. */
  key: boolean
  plates: Plates | null
  shards: Shard[] | null
  copies: Copy[]
  /** The interlace tear through the frame's inks, or null for none. */
  comb: Comb | null
  /** A seed for its dots, specks and torn ink; 0 for none. */
  noise: number
}

interface Frame {
  /** 1 on ones, 2 on twos. */
  ticks: number
  look: Look
}

interface WordPrint {
  /** The tick its first frame lands on. */
  start: number
  /** Its frames; after the last it rests printed. */
  frames: Frame[]
}

/** A horizontal band of the paragraph, % of its height, and its slip, em. */
interface Band {
  top: number
  bottom: number
  dx: number
}

interface Tear extends Band {
  tick: number
}

interface Schedule {
  words: WordPrint[]
  /** Bands torn sideways while the words arrive. */
  tears: Tear[]
  /** The tick from which every word rests printed. */
  end: number
}

interface BurstHit {
  /** The word's index in print order. */
  index: number
  look: Look
}

interface BurstFrame {
  ticks: number
  words: BurstHit[]
  tear: Band | null
  /** The band's cyan, magenta and yellow split apart, em; 0 for none. */
  split: number
}

interface Burst {
  start: number
  /** How long it stays: a flick, a medium burst or a stuck glitch. */
  kind: BurstKind
  frames: BurstFrame[]
}

type WordState = 'waiting' | 'printed' | Look

interface PageLook {
  words: WordState[]
  tear: Band | null
  split: number
}

/** Helpers over one seeded stream. */
function draws(seed: number) {
  const random = rng(seed)
  const between = (lo: number, hi: number) => lo + (hi - lo) * random()
  return {
    random,
    between,
    int: (lo: number, hi: number) => lo + Math.floor(random() * (hi - lo + 1)),
    sign: () => (random() < 0.5 ? -1 : 1),
    chance: (p: number) => random() < p,
  }
}

type Draws = ReturnType<typeof draws>

/** A seed that is never 0 (0 means "no noise"). */
function noiseSeed(seed: number): number {
  return (seed % 999_983) + 1
}

// ---------------------------------------------------------------- shards

function polygonArea(points: Point[]): number {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i] ?? [0, 0]
    const [x1, y1] = points[(i + 1) % points.length] ?? [0, 0]
    sum += x0 * y1 - x1 * y0
  }
  return Math.abs(sum) / 2
}

function centroid(points: Point[]): Point {
  let x = 0
  let y = 0
  for (const [px, py] of points) {
    x += px
    y += py
  }
  return [x / points.length, y / points.length]
}

/** Drops repeated corners where a cut passed through one. */
function tidy(points: Point[]): Point[] {
  return points.filter((p, i) => {
    const q = points[(i + 1) % points.length]
    return !q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6
  })
}

/** Splits a convex polygon along the line through a and b. */
function split(polygon: Point[], a: Point, b: Point): [Point[], Point[]] {
  const side = (p: Point) =>
    (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
  const left: Point[] = []
  const right: Point[] = []
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i]
    const q = polygon[(i + 1) % polygon.length]
    if (!p || !q) continue
    const sp = side(p)
    const sq = side(q)
    if (sp >= 0) left.push(p)
    if (sp <= 0) right.push(p)
    if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) {
      const t = sp / (sp - sq)
      const cut: Point = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      left.push(cut)
      right.push(cut)
    }
  }
  return [tidy(left), tidy(right)]
}

/** A point on the box's edge: side 0 top, 1 right, 2 bottom, 3 left. */
function onEdge(edge: number, t: number): Point {
  if (edge === 0) return [t * 100, 0]
  if (edge === 1) return [100, t * 100]
  if (edge === 2) return [t * 100, 100]
  return [0, t * 100]
}

/**
 * The word broken like glass: 3 to 8 pieces from edge-to-edge cuts, none a sliver,
 * each pushed out, turned and flat-coloured, about a third streaked.
 */
function shatter(seed: number): Shard[] {
  const d = draws(seed)
  let pieces: Point[][] = [
    [
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
    ],
  ]
  const cuts = d.int(2, 3)
  for (let k = 0; k < 8 && (k < cuts || pieces.length < 3); k++) {
    // a cut runs between two different edges, mostly across the word's width
    const from = d.int(0, 3)
    const to = (from + d.int(1, 3)) % 4
    const a = onEdge(from, d.between(0.1, 0.9))
    const b = onEdge(to, d.between(0.1, 0.9))
    const next: Point[][] = []
    for (const piece of pieces) {
      const [left, right] = split(piece, a, b)
      const whole = left.length >= 3 && right.length >= 3
      const thin = !whole || polygonArea(left) < 900 || polygonArea(right) < 900
      if (thin || next.length + 2 > 8) next.push(piece)
      else next.push(left, right)
    }
    pieces = next
  }
  // still too few: cut the biggest piece through its own centre
  for (let k = 0; k < 4 && pieces.length < 3; k++) {
    const biggest = pieces.reduce((best, piece) =>
      polygonArea(piece) > polygonArea(best) ? piece : best
    )
    const [mx, my] = centroid(biggest)
    const angle = d.between(0.35, 1.2) * d.sign()
    const halves = split(
      biggest,
      [mx - Math.cos(angle) * 10, my - Math.sin(angle) * 10],
      [mx + Math.cos(angle) * 10, my + Math.sin(angle) * 10]
    )
    if (halves[0].length < 3 || halves[1].length < 3) continue
    pieces = [...pieces.filter((piece) => piece !== biggest), ...halves]
  }
  return pieces.map((points) => {
    const [cx, cy] = centroid(points)
    const ox = (cx - 50) / 50
    const oy = (cy - 50) / 50
    const pushX = ox * d.between(0.08, 0.3)
    const pushY = oy * d.between(0.05, 0.2)
    return {
      points,
      rim: points.map(([x, y]): Point => [
        cx + (x - cx) * 1.16,
        cy + (y - cy) * 1.16,
      ]),
      cx,
      cy,
      dx: pushX,
      dy: pushY,
      turn: d.sign() * d.between(2, 13),
      color: d.int(0, FLAT.length - 1),
      streak: d.chance(0.35) ? (Math.atan2(pushY, pushX) * 180) / Math.PI : -1,
    }
  })
}

// ---------------------------------------------------------------- plates and copies

/** How a word comes through: broken into shards, or as flat copies. */
type Arrival = 'shards' | 'copies'

/**
 * Cyan, magenta and yellow `reach` em from register, a third of a turn apart and
 * mostly sideways; the angle comes from `seed`, so a word's plates close along it.
 */
function platesAround(seed: number, reach: number): Plates {
  const angle = rng(seed)() * Math.PI * 2
  const at = (k: number): Point => {
    const t = angle + (k * Math.PI * 2) / 3
    const x = Math.cos(t)
    const y = Math.sin(t) * 0.55
    const length = Math.hypot(x, y)
    return [(x / length) * reach, (y / length) * reach]
  }
  return { c: at(0), m: at(1), y: at(2) }
}

function copiesOf(d: Draws, count: number): Copy[] {
  return Array.from({ length: count }, () => ({
    dx: d.sign() * d.between(0.1, 0.35),
    dy: (d.random() - 0.5) * 0.24,
    color: d.int(0, FLAT.length - 1),
  }))
}

// ---------------------------------------------------------------- the comb

/** A plate colour a strip of the comb can print in. */
type Tint = 'c' | 'm'

interface Strip {
  /** Its top and bottom, em down from the top of the word's box. */
  top: number
  bottom: number
  /** The slip it takes, an index into its comb's `slips`; -1 stays in place. */
  slip: number
  /** A plate colour it prints in instead of the frame's own inks, or null. */
  tint: Tint | null
}

/**
 * The interlace tear: the word's inks cut into thin strips, every other one slipped
 * and a few tinted. It only moves ink, so the lines exist only inside the glyphs.
 */
interface Comb {
  /** The sideways slips its strips take, em. */
  slips: number[]
  /** Top to bottom, edge to edge. */
  strips: Strip[]
}

/** Where a comb starts and stops, em down the word's box: a little past the glyphs. */
const COMB_TOP = -0.15

const COMB_BOTTOM = 1.35

/** The lowercase body, em down the word's box, for a typical sans. */
const COMB_BODY: [number, number] = [0.42, 0.95]

/** Whether a strip lies across the lowercase body, where every letter has ink. */
function inBody(strip: Strip): boolean {
  const middle = (strip.top + strip.bottom) / 2
  return middle > COMB_BODY[0] && middle < COMB_BODY[1]
}

/**
 * Strips 0.06 to 0.1 em tall, every other one slipped 0.03 to 0.15 em either way,
 * and one to three slipped strips across the body tinted cyan or magenta.
 */
function combOf(seed: number): Comb {
  const d = draws(seed)
  const slips = Array.from({ length: 3 }, () => d.sign() * d.between(0.03, 0.15))
  const strips: Strip[] = []
  for (let top = COMB_TOP; top < COMB_BOTTOM; ) {
    const bottom = top + d.between(0.06, 0.1)
    const slipped = strips.length % 2 === 1
    strips.push({
      top,
      bottom,
      slip: slipped ? d.int(0, slips.length - 1) : -1,
      tint: null,
    })
    top = bottom
  }
  const tintable = strips.filter((strip) => strip.slip >= 0 && inBody(strip))
  for (let k = d.int(1, 3); k > 0 && tintable.length > 0; k--) {
    const [strip] = tintable.splice(d.int(0, tintable.length - 1), 1)
    if (strip) strip.tint = d.chance(0.5) ? 'c' : 'm'
  }
  return { slips, strips }
}

/**
 * One glitch frame of an arriving word, no key yet: shards (sometimes with a copy
 * behind), or one or two copies with plates 0.15 to 0.4 em out, combed.
 */
function materialise(seed: number, kind: Arrival): Look {
  const d = draws(mixSeed(seed, 3))
  if (kind === 'shards') {
    return {
      key: false,
      plates: null,
      shards: shatter(mixSeed(seed, 4)),
      copies: d.chance(0.5) ? copiesOf(d, 1) : [],
      comb: null,
      noise: noiseSeed(seed),
    }
  }
  return {
    key: false,
    plates: platesAround(mixSeed(seed, 5), d.between(0.15, 0.4)),
    shards: null,
    copies: copiesOf(d, d.int(1, 2)),
    comb: combOf(mixSeed(seed, 6)),
    noise: noiseSeed(seed),
  }
}

/**
 * A word's arrival: 1 or 2 glitch frames on ones, then its plates closing onto the
 * key over 3 or 4 holds on twos, from 0.12 to 0.22 em out.
 */
function wordFrames(seed: number): Frame[] {
  const d = draws(seed)
  const first: Arrival = d.chance(0.6) ? 'shards' : 'copies'
  const other: Arrival = first === 'shards' ? 'copies' : 'shards'
  const kinds: Arrival[] = d.chance(0.45) ? [first, other] : [first]
  const frames: Frame[] = kinds.map((kind, k) => ({
    ticks: 1,
    look: materialise(mixSeed(seed, k + 1), kind),
  }))
  const reach = d.between(0.12, 0.22)
  const shares = d.chance(0.5) ? [1, 0.55, 0.25, 0.08] : [1, 0.42, 0.14]
  const lines = mixSeed(seed, 9)
  for (const share of shares) {
    frames.push({
      ticks: 2,
      look: {
        key: true,
        plates: platesAround(lines, reach * share),
        shards: null,
        copies: [],
        comb: null,
        noise: 0,
      },
    })
  }
  return frames
}

// ---------------------------------------------------------------- the print

/** Extra ticks after a word, for its punctuation. */
function pauseAfter(word: string): number {
  // an ellipsis holds its breath: about 0.9 s to the next word
  if (/(\.\.\.|\u2026)["')\]]?$/.test(word)) return 19
  if (/[.!?]["')\]]?$/.test(word)) return 10
  if (/[,;:]$/.test(word)) return 5
  return 0
}

/** Ticks from one word to the next: 2, 3 or 4. */
function wordGap(roll: number): number {
  if (roll < 0.35) return 2
  return roll < 0.75 ? 3 : 4
}

/**
 * The whole arrival: words 2 to 4 ticks apart, rarely two at once, pausing at
 * punctuation, while a band of the paragraph tears sideways two to four times.
 */
function printSchedule(
  words: string[],
  seed: number,
  startTick = 0
): Schedule {
  const d = draws(mixSeed(seed, 1))
  let tick = startTick
  let paired = false
  const prints = words.map((word, i) => {
    const frames = wordFrames(mixSeed(seed, i + 2))
    const start = tick
    const pause = pauseAfter(word)
    const pair = pause === 0 && !paired && d.chance(0.08)
    paired = pair
    if (!pair) tick += wordGap(d.random()) + pause
    return { start, frames }
  })
  const end = prints.reduce(
    (latest, word) =>
      Math.max(
        latest,
        word.start + word.frames.reduce((sum, frame) => sum + frame.ticks, 0)
      ),
    startTick
  )

  const tears: Tear[] = []
  const attempts = d.int(2, 4)
  for (let k = 0; k < attempts; k++) {
    const at = d.int(startTick + 4, Math.max(startTick + 4, end - 4))
    if (tears.some((tear) => Math.abs(tear.tick - at) < 3)) continue
    const top = d.between(0, 78)
    const bottom = Math.min(100, top + d.between(14, 34))
    const dx = d.sign() * d.between(0.2, 0.8)
    tears.push({ tick: at, top, bottom, dx })
    if (d.chance(0.35)) {
      tears.push({
        tick: at + 1,
        top,
        bottom,
        dx: -Math.sign(dx) * d.between(0.2, 0.8),
      })
    }
  }
  tears.sort((a, b) => a.tick - b.tick)
  return { words: prints, tears, end }
}

// ---------------------------------------------------------------- after it settles

/** Ticks from the print settling to the first idle burst: 0.6 s. */
const FIRST_BURST = Math.round(600 / FRAME_MS)

/** Ticks of calm between bursts after that: 1.0 to 2.5 s. */
const BURST_GAP: [number, number] = [
  Math.round(1000 / FRAME_MS),
  Math.round(2500 / FRAME_MS),
]

/** How long a burst stays. */
type BurstKind = 'flick' | 'medium' | 'stuck'

/** Each kind's length, ticks; a stuck one lasts 0.35 to 0.6 s. */
const BURST_TICKS: Record<BurstKind, [number, number]> = {
  flick: [1, 3],
  medium: [4, 6],
  stuck: [8, 14],
}

/** Most bursts flick, some run longer, about one in four sticks. */
function burstKind(roll: number): BurstKind {
  if (roll < 0.25) return 'stuck'
  return roll < 0.55 ? 'medium' : 'flick'
}

/** Ticks each picture of a burst holds: 1 to 3 at random so it stutters; on twos when stuck. */
function burstHolds(d: Draws, kind: BurstKind): number[] {
  const [lo, hi] = BURST_TICKS[kind]
  const holds: number[] = []
  for (let left = d.int(lo, hi); left > 0; ) {
    const hold = Math.min(left, kind === 'stuck' ? 2 : d.int(1, 3))
    holds.push(hold)
    left -= hold
  }
  return holds
}

/** One picture of a burst on one or two words; the last one settles. */
function burstLook(seed: number, frame: number, last: boolean): Look {
  if (last) {
    return {
      key: true,
      plates: platesAround(seed, 0.05),
      shards: null,
      copies: [],
      comb: null,
      noise: 0,
    }
  }
  const d = draws(mixSeed(seed, frame + 11))
  const roll = d.random()
  if (roll < 0.4) return materialise(mixSeed(seed, frame + 21), 'shards')
  if (roll < 0.7) return materialise(mixSeed(seed, frame + 21), 'copies')
  return {
    key: true,
    plates: platesAround(mixSeed(seed, frame + 31), d.between(0.15, 0.3)),
    shards: null,
    copies: d.chance(0.5) ? copiesOf(d, 1) : [],
    comb: combOf(mixSeed(seed, frame + 51)),
    noise: noiseSeed(mixSeed(seed, frame + 41)),
  }
}

const clamp = (value: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, value))

/** A stuck glitch on its next two: the same picture, moved a hair. */
function nudge(look: Look, seed: number): Look {
  const d = draws(seed)
  const by = () => d.between(0.88, 1.12)
  const move = ([x, y]: Point): Point => [x * by(), y * by()]
  const plates = look.plates
  return {
    ...look,
    plates: plates ? { c: move(plates.c), m: move(plates.m), y: move(plates.y) } : null,
    shards:
      look.shards?.map((shard) => ({
        ...shard,
        dx: shard.dx * by(),
        dy: shard.dy * by(),
        turn: clamp(shard.turn * by(), -13, 13),
      })) ?? null,
    copies: look.copies.map((copy) => ({
      ...copy,
      dx: copy.dx * by(),
      dy: copy.dy * by(),
    })),
    comb: look.comb
      ? {
          ...look.comb,
          slips: look.comb.slips.map(
            (slip) => Math.sign(slip) * clamp(Math.abs(slip) * by(), 0.03, 0.15)
          ),
        }
      : null,
  }
}

/**
 * One burst from `start`: one word or two neighbours glitch, or a band tears,
 * alternating with its plates split. A stuck one holds, nudged on twos, then snaps back.
 */
function burstFrom(
  seed: number,
  kind: BurstKind,
  wordCount: number,
  start: number,
  /** A word it must hit, with the one after it; null to choose. */
  focus: number | null = null
): Burst {
  const d = draws(seed)
  const holds = burstHolds(d, kind)
  const band = focus === null && d.chance(0.35)
  const top = d.between(0, 72)
  const bottom = Math.min(100, top + d.between(18, 40))
  const first = focus ?? d.int(0, Math.max(0, wordCount - 1))
  const pair = (focus !== null || d.chance(0.4)) && first + 1 < wordCount
  const hits = pair ? [first, first + 1] : [first]
  const stuck = kind === 'stuck'
  const slip = d.sign() * d.between(0.25, 0.7)
  const held = d.chance(0.5) ? d.between(0.15, 0.35) : 0
  const frames = holds.map((ticks, f): BurstFrame => {
    if (band && stuck) {
      return {
        ticks,
        words: [],
        tear: { top, bottom, dx: slip * d.between(0.9, 1.1) },
        split: held ? held * d.between(0.9, 1.1) : 0,
      }
    }
    if (band) {
      return {
        ticks,
        words: [],
        tear: { top, bottom, dx: (f % 2 ? -1 : 1) * d.between(0.2, 0.8) },
        split: f % 2 ? d.between(0.15, 0.35) : 0,
      }
    }
    const settle = kind === 'medium' && holds.length > 1 && f === holds.length - 1
    return {
      ticks,
      words: hits.map((index) => {
        const look = burstLook(mixSeed(seed, index), stuck ? 0 : f, settle)
        return {
          index,
          look: stuck && f > 0 ? nudge(look, mixSeed(seed, index * 97 + f)) : look,
        }
      }),
      tear: null,
      split: 0,
    }
  })
  return { start, kind, frames }
}

/**
 * Idle burst `k`, starting after `previous` ended: 0.6 s after the print for the
 * first, then 1.0 to 2.5 s apart, never on a steady beat. Same seed, same burst.
 */
function burstAt(
  seed: number,
  k: number,
  wordCount: number,
  previous: number
): Burst {
  const d = draws(mixSeed(seed, 77 + k))
  const gap = k === 0 ? FIRST_BURST : d.int(...BURST_GAP)
  return burstFrom(
    mixSeed(seed, 1000 + k),
    burstKind(d.random()),
    wordCount,
    previous + gap
  )
}

/** The tick a burst ends on. */
function burstEnd(burst: Burst): number {
  return burst.start + burst.frames.reduce((sum, frame) => sum + frame.ticks, 0)
}

/** A word's state at `tick` along its own print. */
function stateOf(print: WordPrint, tick: number): WordState {
  let age = tick - print.start
  if (age < 0) return 'waiting'
  for (const frame of print.frames) {
    if (age < frame.ticks) return frame.look
    age -= frame.ticks
  }
  return 'printed'
}

/** Everything on the page at `tick`: each word's state, any torn band and any split. */
function lookAt(
  schedule: Schedule,
  bursts: Burst[],
  tick: number
): PageLook {
  const words: WordState[] = schedule.words.map((word) => stateOf(word, tick))
  const torn = schedule.tears.find((tear) => tear.tick === tick)
  let tear: Band | null = torn
    ? { top: torn.top, bottom: torn.bottom, dx: torn.dx }
    : null
  let splitBy = 0
  for (const burst of bursts) {
    let age = tick - burst.start
    if (age < 0) continue
    for (const frame of burst.frames) {
      if (age < frame.ticks) {
        for (const hit of frame.words) {
          if (words[hit.index] === 'printed') words[hit.index] = hit.look
        }
        if (frame.tear) tear = frame.tear
        splitBy = frame.split
        break
      }
      age -= frame.ticks
    }
  }
  return { words, tear, split: splitBy }
}

// ---------------------------------------------------------------- the timeline

// Idle bursts per print, planned once and shared: each depends only on its seed,
// index, word count and the previous end, so a list grows on demand.
const timelines = new Map<string, Burst[]>()

function burstList(
  seed: number,
  wordCount: number,
  end: number,
  tick: number
): Burst[] {
  const key = `${seed}|${wordCount}|${end}`
  let list = timelines.get(key)
  if (!list) {
    if (timelines.size > 64) timelines.clear()
    list = []
    timelines.set(key, list)
  }
  for (let last = list.at(-1); !last || last.start <= tick; last = list.at(-1)) {
    list.push(burstAt(seed, list.length, wordCount, last ? burstEnd(last) : end))
  }
  return list
}

/** How many bursts of a list have started by `tick`. */
function startedBy(list: Burst[], tick: number): number {
  let lo = 0
  let hi = list.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if ((list[mid]?.start ?? Number.POSITIVE_INFINITY) <= tick) lo = mid + 1
    else hi = mid
  }
  return lo
}

/** The last of `bursts` (in start order) started by `tick`: the one on the press, if any. */
function burstIn(bursts: Burst[], tick: number): Burst | null {
  return bursts[startedBy(bursts, tick) - 1] ?? null
}

/** The last idle burst started by `tick`: the one on the press, if any. */
function burstOn(
  seed: number,
  wordCount: number,
  end: number,
  tick: number
): Burst | null {
  return burstIn(burstList(seed, wordCount, end, tick), tick)
}

// ---------------------------------------------------------------- the text

/** A printed word and the spacing after it. */
interface Token {
  key: string
  text: string
  /** Its place in the print order. */
  index: number
  /** Whitespace that follows it, if any. */
  space: string
}

/** Text split into words with their spacing, numbered in print order. */
function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  for (const match of text.matchAll(/(\S+)(\s*)/g)) {
    tokens.push({
      key: `${tokens.length}:${match[1] ?? ''}`,
      text: match[1] ?? '',
      index: tokens.length,
      space: match[2] ?? '',
    })
  }
  return tokens
}

/** Amazing Fantasy #15's last caption (1962); its dash is an ellipsis the press holds on. */
const CAPTION =
  'And a lean, silent figure slowly fades into the gathering darkness, aware at last that in this world, with great power there must also come... great responsibility!'

const PLATES = ['c', 'm', 'y'] as const

// A shard's box is 15% wider and 30% taller each side than the word's, so pushed
// pieces keep their polygon; points come in % of the word and go out in % of the shard.
const PAD_X = 15

const PAD_Y = 30

function toShardBox([x, y]: [number, number]): string {
  return `${((x + PAD_X) / (100 + 2 * PAD_X)) * 100}% ${((y + PAD_Y) / (100 + 2 * PAD_Y)) * 100}%`
}

function polygon(points: [number, number][]): string {
  return `polygon(${points.map(toShardBox).join(', ')})`
}

interface Bit {
  key: string
  kind: 'dot' | 'speck' | 'ink'
  left: string
  top: string
  width: string
  height: string
  color: string
}

const em = (value: number) => `${value.toFixed(3)}em`

/**
 * Inks painted inline, read from .vt-word's --vt-paint-* (verse-text.css), so they
 * match the stylesheet's to the bit even when a build rewrites its colours.
 */
const INK = {
  violet: 'var(--vt-paint-violet)',
  magenta: 'var(--vt-paint-magenta)',
  green: 'var(--vt-paint-green)',
  gold: 'var(--vt-paint-gold)',
  key: 'var(--vt-paint-key)',
  dot: 'var(--vt-paint-dot)',
} as const

const flatInk = (index: number) => INK[FLAT[index] ?? 'violet']

/**
 * Debris round a glitching word: red halftone dots and gold specks, plus on a
 * combed frame a sliver or two of torn ink carried off along a slipped strip.
 */
function debris(seed: number, comb: Comb | null, ink: string): Bit[] {
  const random = rng(seed)
  const between = (lo: number, hi: number) => lo + (hi - lo) * random()
  const bits: Bit[] = []
  // red dots on a halftone grid, about a third missing
  const cx = between(-10, 110)
  const cy = between(-70, 170)
  const pitch = 0.12
  for (let row = -2; row <= 2; row++) {
    for (let column = -3; column <= 3; column++) {
      if (random() < 0.42 || Math.hypot(column, row * 1.4) > 3.2) continue
      const ox = (column + (row % 2 ? 0.5 : 0)) * pitch
      const oy = row * pitch * 0.866
      const size = em(0.075 + random() * 0.03)
      bits.push({
        key: `d${row}:${column}`,
        kind: 'dot',
        left: `calc(${cx}% + ${ox}em)`,
        top: `calc(${cy}% + ${oy}em)`,
        width: size,
        height: size,
        color: INK.dot,
      })
    }
  }
  for (let k = 0, n = 3 + Math.floor(random() * 4); k < n; k++) {
    const size = em(0.04 + random() * 0.04)
    bits.push({
      key: `s${k}`,
      kind: 'speck',
      left: `${between(-25, 125)}%`,
      top: `${between(-80, 180)}%`,
      width: size,
      height: size,
      color: INK.gold,
    })
  }
  if (!comb) return bits
  const torn = comb.strips.filter(
    (strip) => strip.slip >= 0 && strip.tint === null && inBody(strip)
  )
  for (let k = 0, n = 1 + Math.floor(random() * 2); k < n; k++) {
    const [strip] = torn.splice(Math.floor(random() * torn.length), 1)
    if (!strip) break
    const slip = comb.slips[strip.slip] ?? 0
    const width = between(0.1, 0.3)
    const away = between(0.04, 0.22)
    bits.push({
      key: `t${k}`,
      kind: 'ink',
      left:
        slip > 0 ? `calc(100% + ${em(slip + away)})` : em(slip - away - width),
      top: em(strip.top),
      width: em(width),
      height: em(strip.bottom - strip.top),
      color: ink,
    })
  }
  return bits
}

/** How far a comb layer reaches above and below the word, em (1 em each side); matches .vt-comb. */
const COMB_REACH_Y = 0.75

interface CombLayer {
  key: string
  /** Its slip, em. */
  slip: number
  tint: Tint | null
  /** Its strips, as a mask over the layer. */
  mask: string
}

/**
 * A comb's strips as one layer per slip and tint; the unslipped layer also draws
 * everything beyond the comb, so nothing thrown past it is lost.
 */
function combLayers(comb: Comb): CombLayer[] {
  const at = (y: number) => em(y + COMB_REACH_Y)
  const groups = new Map<string, { slip: number; tint: Tint | null }>([
    ['-1:', { slip: -1, tint: null }],
  ])
  for (const strip of comb.strips) {
    groups.set(`${strip.slip}:${strip.tint ?? ''}`, {
      slip: strip.slip,
      tint: strip.tint,
    })
  }
  return [...groups].map(([key, group]) => {
    const home = group.slip < 0 && group.tint === null
    const paint = (on: boolean) => (on ? '#000' : 'transparent')
    const stops = [`${paint(home)} 0 ${at(COMB_TOP)}`]
    for (const strip of comb.strips) {
      const member = strip.slip === group.slip && strip.tint === group.tint
      stops.push(`${paint(member)} ${at(strip.top)} ${at(strip.bottom)}`)
    }
    stops.push(
      `${paint(home)} ${at(comb.strips.at(-1)?.bottom ?? COMB_BOTTOM)} 100%`
    )
    return {
      key,
      slip: comb.slips[group.slip] ?? 0,
      tint: group.tint,
      mask: `linear-gradient(to bottom, ${stops.join(', ')})`,
    }
  })
}

/** A frame's inks: the key (on a combed frame), the flat copies and the plates. */
function Inks({ look, text, keyed }: { look: Look; text: string; keyed: boolean }) {
  const plates = look.plates
  return (
    <>
      {keyed ? <span className="vt-key-ink">{text}</span> : null}
      {look.copies.map((copy) => (
        <span
          key={`${copy.dx}:${copy.dy}`}
          className="vt-copy"
          style={{
            color: flatInk(copy.color),
            transform: `translate(${copy.dx}em, ${copy.dy}em)`,
          }}
        >
          {text}
        </span>
      ))}
      {plates
        ? PLATES.map((plate) => (
            <span
              key={plate}
              className="vt-plate"
              data-plate={plate}
              style={{
                transform: `translate(${plates[plate][0]}em, ${plates[plate][1]}em)`,
              }}
            >
              {text}
            </span>
          ))
        : null}
    </>
  )
}

/** The colour of torn ink: the key, or the frame's first copy. */
function inkOf(look: Look): string {
  const copy = look.copies[0]
  if (look.key || !copy) return INK.key
  return flatInk(copy.color)
}

function ShardPiece({ text, shard }: { text: string; shard: Shard }) {
  const move = `translate(${shard.dx}em, ${shard.dy}em) rotate(${shard.turn}deg)`
  const origin = toShardBox([shard.cx, shard.cy])
  return (
    <>
      <span
        className="vt-rim"
        style={{
          clipPath: polygon(shard.rim),
          transform: move,
          transformOrigin: origin,
        }}
      />
      <span
        className="vt-shard"
        data-color={FLAT[shard.color]}
        data-ink={FLAT_LIGHT[shard.color] ? 'dark' : 'light'}
        data-streak={shard.streak >= 0}
        style={
          {
            clipPath: polygon(shard.points),
            transform: move,
            transformOrigin: origin,
            // a custom property, so not in React's style type
            '--streak': `${shard.streak + 90}deg`,
          } as CSSProperties
        }
      >
        <span className="vt-shard-text">{text}</span>
      </span>
    </>
  )
}

/** One word as the press has it: waiting, glitching or printed. */
function PressWord({
  text,
  state,
}: {
  text: string
  state: WordState | undefined
}) {
  if (state === undefined || state === 'printed') {
    return <span className="vt-word">{text}</span>
  }
  if (state === 'waiting') {
    return (
      <span className="vt-word" data-state="waiting">
        {text}
      </span>
    )
  }
  const look = state
  const comb = look.comb
  return (
    // a combed frame draws its key inside the comb, so the word's own text hides
    <span className="vt-word" data-key={look.key && comb === null}>
      {text}
      <span className="vt-glitch" aria-hidden="true">
        {comb
          ? combLayers(comb).map((layer) => (
              <span
                key={layer.key}
                className="vt-comb"
                style={{
                  maskImage: layer.mask,
                  transform: layer.slip
                    ? `translateX(${em(layer.slip)})`
                    : undefined,
                }}
              >
                <span className="vt-comb-body">
                  {layer.tint ? (
                    <span className="vt-comb-ink" data-tint={layer.tint}>
                      {text}
                    </span>
                  ) : (
                    <Inks look={look} text={text} keyed={look.key} />
                  )}
                </span>
              </span>
            ))
          : <Inks look={look} text={text} keyed={false} />}
        {look.shards ? (
          <>
            <span className="vt-gap" />
            {look.shards.map((shard) => (
              <ShardPiece
                key={`${shard.cx}:${shard.cy}`}
                text={text}
                shard={shard}
              />
            ))}
          </>
        ) : null}
        {look.noise
          ? debris(look.noise, comb, inkOf(look)).map((bit) => (
              <span
                key={bit.key}
                className="vt-bit"
                data-kind={bit.kind}
                style={{
                  left: bit.left,
                  top: bit.top,
                  width: bit.width,
                  height: bit.height,
                  backgroundColor: bit.color,
                }}
              />
            ))
          : null}
      </span>
    </span>
  )
}

/** The words with their spacing, each in its press state. */
function Words({
  tokens,
  states,
}: {
  tokens: Token[]
  states: WordState[] | null
}) {
  return tokens.map((token) => (
    <Fragment key={token.key}>
      <PressWord text={token.text} state={states?.[token.index]} />
      {token.space}
    </Fragment>
  ))
}

const prose = (className?: string) =>
  className ? `vt-prose ${className}` : 'vt-prose'

function bandClip(band: Band): string {
  return `inset(${band.top}% -12% ${100 - band.bottom}% -12%)`
}

function bandHole(band: Band): string {
  return `linear-gradient(to bottom, black 0 ${band.top}%, transparent ${band.top}% ${band.bottom}%, black ${band.bottom}% 100%)`
}

/**
 * The paragraph at one tick. A torn band is cut out and drawn again thrown
 * sideways; a split band is drawn in cyan, magenta and yellow, pulled apart.
 */
function PressSheet({
  tokens,
  page,
  className,
}: {
  tokens: Token[]
  /** Null when every word rests printed. */
  page: PageLook | null
  className?: string | undefined
}) {
  const states = page?.words ?? null
  const tear = page?.tear ?? null
  const splitBy = page?.split ?? 0
  const hole = tear
    ? { maskImage: bandHole(tear), WebkitMaskImage: bandHole(tear) }
    : undefined
  const plates =
    tear && splitBy > 0
      ? platesAround(mixSeed(Math.round(tear.top * 1000), 3), splitBy)
      : null
  return (
    <div className="vt-sheet">
      <p className={prose(className)} style={hole}>
        <Words tokens={tokens} states={states} />
      </p>
      {tear && !plates ? (
        <p
          className={prose(className)}
          data-copy="key"
          aria-hidden="true"
          style={{
            clipPath: bandClip(tear),
            transform: `translateX(${tear.dx}em)`,
          }}
        >
          <Words tokens={tokens} states={states} />
        </p>
      ) : null}
      {tear && plates
        ? PLATES.map((plate) => (
            <p
              key={plate}
              className={prose(className)}
              data-copy="plate"
              data-plate={plate}
              aria-hidden="true"
              style={{
                clipPath: bandClip(tear),
                transform: `translate(${tear.dx * 0.4 + plates[plate][0]}em, ${plates[plate][1]}em)`,
              }}
            >
              <Words tokens={tokens} states={states} />
            </p>
          ))
        : null}
    </div>
  )
}

export interface VerseTextHandle {
  /** Prints it again from the top. */
  replay(): void
}

export interface VerseTextProps {
  /** The line to print. */
  text?: string
  /** The same seed always prints and glitches the same way. */
  seed?: number
  /** Prints the first time it scrolls into view. When off, it starts printed until you call `replay()`. */
  autoplay?: boolean
  /** Keeps glitching on its own once printed. */
  idle?: boolean
  /** `2` runs twice as fast, `0.5` at half speed. */
  speed?: number
  /** `light` for dark ink on light pages, `dark` for light ink on dark ones. */
  tone?: 'light' | 'dark'
  /** Classes for the root. Set font, size and colour here. */
  className?: string
  /** Styles for the root, such as its --vt-* inks. */
  style?: CSSProperties
  /** Draws this exact tick (24 per second) instead of running its own clock; below 0 it waits. */
  frame?: number
  /** `replay()` prints it again from the top. */
  ref?: Ref<VerseTextHandle>
}

// One plan per text and seed: the press is pure, so a take matches wherever it's drawn.
const plans = new Map<string, { tokens: Token[]; schedule: Schedule }>()

function planFor(text: string, seed: number) {
  const key = `${seed}|${text}`
  let plan = plans.get(key)
  if (!plan) {
    const tokens = tokenize(text)
    const words = tokens.map((token) => token.text)
    plan = { tokens, schedule: printSchedule(words, mixSeed(seed, 1), 1) }
    if (plans.size > 32) plans.clear()
    plans.set(key, plan)
  }
  return plan
}

/** The burst on the press at `tick`, if any. */
function idleBurst(schedule: Schedule, seed: number, tick: number): Burst | null {
  return burstOn(mixSeed(seed, 1), schedule.words.length, schedule.end, tick)
}

/** Whether anything moves at `tick`: the print, or a burst. */
function moving(schedule: Schedule, burst: Burst | null, tick: number) {
  return tick <= schedule.end || (burst !== null && tick <= burstEnd(burst))
}

const REDUCED = '(prefers-reduced-motion: reduce)'

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const readReduced = () => window.matchMedia(REDUCED).matches

const readFull = () => false

// Math.sin and Math.cos can differ in the last digit between server and browser,
// so frames are drawn only once hydrated; the server shows the text waiting.
const subscribeToNothing = () => () => undefined

const readHydrated = () => true

const readNotHydrated = () => false

/** At most this many ticks per animation frame: a long stall is skipped, not raced through. */
const MOST_PER_FRAME = 4

function VerseTextBody({
  text = CAPTION,
  seed = 1610,
  autoplay = true,
  idle = true,
  speed = 1,
  tone = 'light',
  className,
  style,
  frame,
  ref,
}: VerseTextProps) {
  const reduced = useSyncExternalStore(subscribeToMotion, readReduced, readFull)
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    readHydrated,
    readNotHydrated
  )
  const { tokens, schedule } = planFor(text, seed)
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  // null: not printed yet; then the tick it is on
  const [tick, setTick] = useState<number | null>(null)
  const position = useRef(0)

  useImperativeHandle(ref, () => ({
    replay() {
      position.current = 0
      setTick(0)
    },
  }))

  // the first sight starts the print
  useEffect(() => {
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.some((entry) => entry.isIntersecting)
        setVisible(seen)
        if (seen && autoplay) setTick((current) => current ?? 0)
      },
      { threshold: 0.3 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [root, autoplay])

  // the clock runs only while it is on screen with something to show
  const controlled = frame !== undefined
  const running =
    !controlled &&
    !reduced &&
    visible &&
    tick !== null &&
    (idle || tick <= schedule.end)
  useEffect(() => {
    if (!running) return
    let last = 0
    let carry = 0
    let raf = 0
    const step = (now: number) => {
      if (last > 0) {
        carry += ((now - last) * speed) / FRAME_MS
        const whole = Math.min(Math.floor(carry), MOST_PER_FRAME)
        carry -= Math.floor(carry)
        for (let k = 0; k < whole; k++) {
          const next = position.current + 1
          const before = idle ? idleBurst(schedule, seed, position.current) : null
          const after = idle ? idleBurst(schedule, seed, next) : null
          position.current = next
          // a still page draws nothing new, so it isn't redrawn
          if (
            moving(schedule, before, next - 1) ||
            moving(schedule, after, next)
          ) {
            setTick(next)
          }
        }
        if (!idle && position.current > schedule.end) return
      }
      last = now
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [running, speed, idle, schedule, seed])

  // the tick on screen: null while it waits, unprinted, or once still
  const at = controlled
    ? hydrated && frame >= 0
      ? frame
      : null
    : reduced
      ? null
      : tick
  let page: PageLook | null = null
  if (at !== null) {
    const burst = idle ? idleBurst(schedule, seed, at) : null
    page = lookAt(schedule, burst ? [burst] : [], at)
  }
  const waiting = controlled
    ? !hydrated || frame < 0
    : !reduced && autoplay && tick === null

  return (
    <div
      ref={setRoot}
      className={className ? `vt-root ${className}` : 'vt-root'}
      style={style}
      data-phase={waiting ? 'waiting' : 'live'}
      data-tone={tone}
    >
      <PressSheet tokens={tokens} page={page} />
    </div>
  )
}

/** <VerseText /> with its stylesheet, which React 19 hoists into <head> once per page. */
export function VerseText(props: VerseTextProps) {
  return (
    <>
      <style href="verse-text" precedence="default">
        {CSS}
      </style>
      <VerseTextBody {...props} />
    </>
  )
}

const CSS = `
/*
 * <VerseText />'s layers. Inks: --vt-ink, --vt-key, --vt-violet, --vt-magenta, --vt-green,
 * --vt-gold, --vt-plate-c/m/y, --vt-dot-red; plus --vt-blend, --vt-leading, --vt-wrap.
 */

.vt-root {
  color: var(--vt-ink, oklch(0.2 0 0));
}

/* tone="dark": light ink, plates screened; :where keeps it overridable */
:where(.vt-root[data-tone='dark']) {
  --vt-ink: oklch(0.955 0 0);
  --vt-blend: screen;
}

/* unseen (still read aloud) until it prints; shown after 3 s if scripts never run */
@media (scripting: enabled) {
  .vt-root[data-phase='waiting'] .vt-sheet {
    opacity: 0;
    animation: vt-reveal 0s 3s forwards;
  }
}

@keyframes vt-reveal {
  to {
    opacity: 1;
  }
}

.vt-sheet {
  position: relative;
}

.vt-prose {
  margin: 0;
  font-weight: 400;
  line-height: var(--vt-leading, 1.62);
  letter-spacing: -0.006em;
  text-wrap: var(--vt-wrap, pretty);
}

/* a torn or split band, drawn again over the paragraph */
.vt-prose[data-copy] {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

.vt-prose[data-copy='plate'] {
  mix-blend-mode: var(--vt-blend, multiply);
}

.vt-prose[data-copy='plate'] .vt-glitch {
  display: none;
}

.vt-prose[data-plate='c'] {
  color: var(--vt-plate-c, oklch(0.76 0.15 222));
}

.vt-prose[data-plate='m'] {
  color: var(--vt-plate-m, oklch(0.6 0.26 355));
}

.vt-prose[data-plate='y'] {
  color: var(--vt-plate-y, oklch(0.93 0.19 104));
}

/* ------------------------------------------------------------ a word */

.vt-word {
  /* the inks parts.tsx paints inline, resolved with the stylesheet's own colours */
  --vt-paint-violet: var(--vt-violet, oklch(0.48 0.29 272));
  --vt-paint-magenta: var(--vt-magenta, oklch(0.64 0.3 328));
  --vt-paint-green: var(--vt-green, oklch(0.72 0.25 145));
  --vt-paint-gold: var(--vt-gold, oklch(0.82 0.17 82));
  --vt-paint-key: var(--vt-key, oklch(0.12 0 0));
  --vt-paint-dot: var(--vt-dot-red, oklch(0.6 0.25 25));

  position: relative;
}

.vt-word[data-state='waiting'],
.vt-word[data-key='false'] {
  color: transparent;
}

.vt-glitch {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

/* copies over the word, line box centred on its own so the baselines meet */
.vt-copy,
.vt-plate,
.vt-key-ink,
.vt-comb-ink,
.vt-shard-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  white-space: pre;
}

.vt-copy,
.vt-plate {
  mix-blend-mode: var(--vt-blend, multiply);
}

.vt-plate[data-plate='c'] {
  color: var(--vt-plate-c, oklch(0.76 0.15 222));
}

.vt-plate[data-plate='m'] {
  color: var(--vt-plate-m, oklch(0.6 0.26 355));
}

.vt-plate[data-plate='y'] {
  color: var(--vt-plate-y, oklch(0.93 0.19 104));
}

/* the comb: the frame's inks once per slip, each masked to its strips; a layer
   reaches 1em past the word and 0.75em above and below (parts.tsx COMB_REACH_Y) */
.vt-comb {
  position: absolute;
  inset: -0.75em -1em;
}

.vt-comb-body {
  position: absolute;
  inset: 0.75em 1em;
}

.vt-key-ink {
  color: var(--vt-ink, oklch(0.2 0 0));
}

.vt-comb-ink {
  mix-blend-mode: var(--vt-blend, multiply);
}

.vt-comb-ink[data-tint='c'] {
  color: var(--vt-plate-c, oklch(0.76 0.15 222));
}

.vt-comb-ink[data-tint='m'] {
  color: var(--vt-plate-m, oklch(0.6 0.26 355));
}

/* the black behind the shards, showing in the gaps as they part */
.vt-gap {
  position: absolute;
  inset: 0;
  background-color: var(--vt-key, oklch(0.12 0 0));
}

/* a shard and its black edge, oversized (parts.tsx PAD_X, PAD_Y) so pushed pieces keep shape */
.vt-rim,
.vt-shard {
  position: absolute;
  inset: -30% -15%;
}

.vt-rim {
  background-color: var(--vt-key, oklch(0.12 0 0));
}

.vt-shard {
  background-color: var(--vt-shard);
}

.vt-shard[data-color='violet'] {
  --vt-shard: var(--vt-violet, oklch(0.48 0.29 272));
}

.vt-shard[data-color='magenta'] {
  --vt-shard: var(--vt-magenta, oklch(0.64 0.3 328));
}

.vt-shard[data-color='green'] {
  --vt-shard: var(--vt-green, oklch(0.72 0.25 145));
}

.vt-shard[data-color='gold'] {
  --vt-shard: var(--vt-gold, oklch(0.82 0.17 82));
}

/* a motion streak inside the shard, a darker tone of its colour */
.vt-shard[data-streak='true'] {
  background-image: repeating-linear-gradient(
    var(--streak),
    transparent 0 0.05em,
    color-mix(in oklab, var(--vt-shard), black 28%) 0.05em 0.085em
  );
}

/* the word's glyphs inside the shard, where the word stands */
.vt-shard-text {
  inset: 18.75% 11.538%;
}

.vt-shard[data-ink='light'] .vt-shard-text {
  color: oklch(0.99 0 0);
}

.vt-shard[data-ink='dark'] .vt-shard-text {
  color: var(--vt-key, oklch(0.12 0 0));
}

/* debris round a glitching word: dots, specks and torn ink */
.vt-bit {
  position: absolute;
}

.vt-bit[data-kind='dot'],
.vt-bit[data-kind='speck'] {
  border-radius: 50%;
}

@media (prefers-reduced-motion: reduce) {
  .vt-root[data-phase='waiting'] .vt-sheet {
    opacity: 1;
    animation: none;
  }
}
`
