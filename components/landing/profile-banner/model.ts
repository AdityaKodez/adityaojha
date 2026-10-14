// A 96 × 56 mm interface outline. Motion, ink and readout share this path.
export const TRACE = [
  [-48, -28], [48, -28], [48, 28], [-48, 28], [-48, -28],
] as const;
export const LENGTH = TRACE.slice(1).reduce((total, point, index) =>
  total + Math.hypot(point[0] - TRACE[index][0], point[1] - TRACE[index][1]), 0);
export const INITIAL_PROGRESS = 0;

export function penAt(progress: number) {
  let distance = Math.max(0, Math.min(1, progress)) * LENGTH;
  for (let i = 1; i < TRACE.length; i++) {
    const from = TRACE[i - 1];
    const to = TRACE[i];
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    if (distance <= length || i === TRACE.length - 1) {
      const share = distance / length;
      return { x: from[0] + (to[0] - from[0]) * share, y: from[1] + (to[1] - from[1]) * share };
    }
    distance -= length;
  }
  return { x: TRACE[0][0], y: TRACE[0][1] };
}

export function readoutAt(progress: number, unit: string) {
  const pen = penAt(progress);
  return `X ${(pen.x + 48).toFixed(1)} · Y ${(pen.y + 28).toFixed(1)} ${unit}`;
}
