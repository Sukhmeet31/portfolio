import type { Position } from "./movement.ts";

export const signals: readonly Position[] = [
  { x: 3, z: 2.8 },
  { x: 7, z: 0 },
  { x: -7, z: 0 },
  { x: -3, z: 2.8 },
  { x: 0, z: 2.8 },
];
export function advanceSignalRun(
  collected: number,
  position: Position,
): number {
  const target = signals[collected];
  if (!target) return collected;
  return Math.hypot(target.x - position.x, target.z - position.z) <= 0.85
    ? collected + 1
    : collected;
}
