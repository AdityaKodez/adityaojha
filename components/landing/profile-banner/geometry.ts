import * as k from "@/lib/anatomy/iso-kit";
import { TRACE } from "./model";

// Figure: a desktop XY plotter, built from 70+ machined, mounted parts.
// Base: bed, four feet, pads, inset deck, paper, four paper clips, screw seats.
// Guides: two Y rails, four end blocks, rail seats, ruler and calibration marks.
// Gantry: two sleds, four bushings, two columns, caps, twin X beams, belt and teeth.
// Carriage: saddle, housing, lid, ribs, clamp, blue pen body, ferrule and nib.
// Details: seams, vents, closed fastener seats, printed interface and registration.
export const WIDTH = 680;
export const HEIGHT = 300;
const BED = { x: -132, y: -89, w: 264, d: 178, r: 9 };
export const P = k.fitProjection([
  ...k.boxCorners(BED, -13, 0), [-105, -59, 78], [112, -3, 52], [0, 20, 78],
], WIDTH, HEIGHT, {
  pad: 7, azimuth: 48, elevation: 27,
});
const ORIGIN = k.iso([0, 0, 0], P);
const X = k.iso([1, 0, 0], P);
const Y = k.iso([0, 1, 0], P);
export const axes = { x: [X[0] - ORIGIN[0], X[1] - ORIGIN[1]], y: [Y[0] - ORIGIN[0], Y[1] - ORIGIN[1]] };
export const tracePoints = TRACE.map(([x, y]) => k.iso([x, y, 3.6], P));

const line = (d: string, tone: k.LineTone = "lo", free = false) => k.lineSvg(d, { tone, free });
const screws = (plan: k.Plan, z: number, inset = 4) => {
  const points = k.corners(plan, inset);
  return line(points.map(([x, y]) => k.ring(x, y, 1.55, z, P, 12)).join(""), "mid") +
    k.dotsSvg(points.map(([x, y]) => k.iso([x, y, z], P)), { size: 0.48, tone: "hi" });
};
const slab = (plan: k.Plan, z: number, h: number, tone: k.Tone = "mid", lit = false) =>
  k.solidSvg(k.slabOf(plan, z, h, P, 5, Math.min(h / 3, 0.65)), { tone, crease: "lo", lit });
const parts: { at: k.Point3; svg: string }[] = [];
const put = (plan: k.Plan, z: number, h: number, detail = "", tone: k.Tone = "mid") => {
  parts.push({ at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg: slab(plan, z, h, tone) + detail });
};
const sorted = () => parts.sort((a, b) => k.depthOf(a.at, P) - k.depthOf(b.at, P)).map(p => p.svg).join("");

for (const [x, y] of k.corners(BED, 17)) {
  put({ x: x - 7, y: y - 6, w: 14, d: 12, r: 2 }, -13, 4, "", "lo");
  put({ x: x - 5, y: y - 4, w: 10, d: 8, r: 1.5 }, -9, 3);
}
const feet = sorted();
parts.length = 0;
const bed = slab(BED, -6, 6) + line(k.planOutline(k.insetPlan(BED, 4), 0, P), "faint") + screws(BED, 0, 10);
const deck = { x: -112, y: -76, w: 224, d: 152, r: 4 };
const paper = { x: -85, y: -61, w: 170, d: 122, r: 1.2 };
put(deck, 0, 2, line(k.planOutline(k.insetPlan(deck, 2), 2, P), "faint"));
put(paper, 2, 1.6, line(k.planOutline({ x: -62, y: -43, w: 124, d: 87, r: 1.5 }, 3.6, P), "faint") +
  line(k.lineOnTop([-62, -34], [62, -34], 3.6, P), "faint") +
  line(k.planOutline({ x: -36, y: -15, w: 72, d: 12, r: 1 }, 3.6, P), "faint") +
  line(k.planOutline({ x: -36, y: 3, w: 44, d: 6, r: 1 }, 3.6, P), "faint") +
  line(k.planOutline({ x: -36, y: 15, w: 58, d: 6, r: 1 }, 3.6, P), "faint"));
for (const x of [-89, 81]) for (const y of [-48, 42]) {
  const clip = { x, y, w: 8, d: 7, r: 1 };
  put(clip, 3.6, 1.5, screws(clip, 5.1, 2));
}
for (const x of [-103, 97]) {
  put({ x: x - 2, y: -70, w: 10, d: 140, r: 1 }, 2, 3);
  put({ x, y: -68, w: 6, d: 136, r: 1 }, 5, 5,
    line(k.planOutline({ x: x + 1.5, y: -66, w: 3, d: 132, r: 0.5 }, 10, P), "faint"));
  for (const y of [-74, 68]) {
    const stop = { x: x - 4, y, w: 14, d: 6, r: 1.5 };
    put(stop, 2, 10, screws(stop, 12, 2));
  }
}
const strip = { x: -110, y: 80, w: 220, d: 5, r: 0.5 };
put(strip, 0, 0.6);
const ticks = k.topTicks(-106, 106, 4, 5, 80, 0.6, [1.5, 3], P);
const base = `<path class="iso-halo" d="${k.haloOf(BED, -13, 6, P)}"/>` + feet + bed + sorted() + line(ticks.minor, "lo") + line(ticks.major, "mid");

parts.length = 0;
for (const x of [-106, 94]) {
  // The sled rests on the guide; raised cheeks sit beside it, never through it.
  const sled = { x, y: -15, w: 18, d: 30, r: 2 };
  put(sled, 10, 5, screws(sled, 15, 3));
  for (const y of [-15, 11]) {
    put({ x, y, w: 18, d: 4, r: 0.5 }, 15, 3);
  }
  put({ x: x + 3, y: -8, w: 12, d: 16, r: 1.5 }, 15, 32,
    line(k.sideSeam({ x: x + 3, y: -8, w: 12, d: 16, r: 1.5 }, 38, P, 5), "faint"));
  const cap = { x: x + 1, y: -10, w: 16, d: 20, r: 2 };
  put(cap, 47, 5, screws(cap, 52, 3));
}
for (const y of [-8, 4]) {
  put({ x: -91, y, w: 188, d: 4, r: 0.75 }, 44, 6);
  put({ x: -91, y: y + 0.9, w: 188, d: 2.2, r: 0.4 }, 50, 1.5);
}
put({ x: -91, y: -1, w: 188, d: 2, r: 0.25 }, 47, 2, "", "lo");
for (let x = -87; x < 94; x += 7) {
  put({ x, y: -1, w: 1, d: 2, r: 0 }, 49, 0.5, "", "lo");
}
export const gantry = sorted();
parts.length = 0;
const saddle = { x: -15, y: -10, w: 30, d: 22, r: 2 };
put(saddle, 51.5, 4, screws(saddle, 55.5, 3));
const housing = { x: -11, y: -6, w: 22, d: 18, r: 2 };
put(housing, 55.5, 14, line(k.planOutline(k.insetPlan(housing, 2), 69.5, P), "faint") + screws(housing, 69.5, 4));
for (let x = -7; x <= 6; x += 3) {
  put({ x, y: -4, w: 1.2, d: 12, r: 0.2 }, 69.5, 1);
}
const bracket = { x: -7, y: 12, w: 14, d: 7, r: 1 };
put(bracket, 44, 17, screws(bracket, 61, 2));
// Pen is attached to the front bracket and reaches the paper at z=3.6.
put({ x: -2, y: 12, w: 4, d: 7, r: 0.5 }, 28, 16, "", "hi");
put({ x: -1, y: 14.5, w: 2, d: 2, r: 0.25 }, 5.6, 22.4, "", "hi");
put({ x: -0.5, y: 15, w: 1, d: 1, r: 0.15 }, 3.6, 2, "", "hi");
const pen = { x: -3, y: 12.5, w: 6, d: 6, r: 1 };
parts.push({ at: [0, 15.5, 59], svg: slab(pen, 44, 30, "hi", true) +
  line(k.planOutline(k.insetPlan(pen, 1), 74, P), "lit") });
export const head = sorted();
// Pen tip is 15.5 mm in front of the bridge's centre; compensate in Y motion.
export const PEN_OFFSET = 15.5;
export { base };
