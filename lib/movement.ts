import { WORLD } from "./workshop-world.ts";
export type Position = { x: number; z: number };
export type Obstacle = Position & { halfX: number; halfZ: number };
export const START_POSITION: Position = { x: 0, z: 2.8 };
export const ROVER_RADIUS = 0.38;

export function stepRover(
  position: Position,
  direction: Position,
  delta: number,
  obstacles: readonly Obstacle[],
  speed = 2.8,
): Position {
  const magnitude = Math.hypot(direction.x, direction.z);
  if (!magnitude || !Number.isFinite(delta) || delta <= 0)
    return { ...position };
  // Clamp a stalled frame, then substep so a narrow obstacle cannot be skipped.
  const distance = Math.max(0, Math.min(Number.isFinite(speed) ? speed : 2.8, 12)) * Math.min(delta, 0.1);
  const steps = Math.max(1, Math.ceil(distance / 0.08));
  const dx = ((direction.x / magnitude) * distance) / steps;
  const dz = ((direction.z / magnitude) * distance) / steps;
  let { x, z } = position;
  const blocked = (px: number, pz: number) =>
    obstacles.some(
      (o) =>
        Math.abs(px - o.x) < o.halfX + ROVER_RADIUS &&
        Math.abs(pz - o.z) < o.halfZ + ROVER_RADIUS,
    );
  for (let i = 0; i < steps; i++) {
    const nextX = Math.max(-WORLD.maxX, Math.min(WORLD.maxX, x + dx));
    if (!blocked(nextX, z)) x = nextX;
    const nextZ = Math.max(-WORLD.maxZ, Math.min(WORLD.maxZ, z + dz));
    if (!blocked(x, nextZ)) z = nextZ;
  }
  return { x, z };
}
