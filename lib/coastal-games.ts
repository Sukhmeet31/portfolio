import type { Position } from "./movement.ts";

export const RACE_START: Position = { x: -21, z: 13 };
export const RACE_GATES: readonly Position[] = [
  { x: -27, z: 8 }, { x: -27, z: -12 }, { x: -21, z: -17 },
  { x: -15, z: -12 }, { x: -15, z: 8 }, RACE_START,
];
export type RaceState = { next: number; elapsed: number; finished: boolean; invalid: boolean };
export const newRace = (): RaceState => ({ next: 0, elapsed: 0, finished: false, invalid: false });
export function onRaceTrack(p: Position) {
  return p.x >= -30 && p.x <= -12 && p.z >= -20 && p.z <= 16 &&
    !(p.x > -25 && p.x < -17 && p.z > -15 && p.z < 11);
}
export function stepRace(race: RaceState, p: Position, delta: number): RaceState {
  if (race.finished || race.invalid) return race;
  const elapsed = race.elapsed + Math.max(0, Number.isFinite(delta) ? delta : 0);
  if (!onRaceTrack(p)) return { ...race, elapsed, invalid: true };
  const gate = RACE_GATES[race.next];
  const next = race.next + Number(Boolean(gate && Math.hypot(gate.x - p.x, gate.z - p.z) < 1.9));
  return { next, elapsed, invalid: false, finished: next === RACE_GATES.length };
}

export type Pin = Position & { id: number; vx: number; vz: number; fallen: boolean; tilt: number; angle: number };
export function newPins(): Pin[] {
  return Array.from({ length: 4 }, (_, row) => Array.from({ length: row + 1 }, (_, col) => ({
    id: row * (row + 1) / 2 + col, x: 21 + (col - row / 2) * 0.95, z: -8 - row * 0.95,
    vx: 0, vz: 0, fallen: false, tilt: 0, angle: 0,
  }))).flat();
}
function distanceToSegment(p: Position, a: Position, b: Position) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const length = dx * dx + dz * dz;
  const t = length ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / length)) : 0;
  return Math.hypot(p.x - a.x - dx * t, p.z - a.z - dz * t);
}
export function stepPins(pins: readonly Pin[], from: Position, to: Position, delta: number): Pin[] {
  const dt = Math.max(0, Math.min(delta, 0.05));
  const result = pins.map((pin) => ({ ...pin }));
  const dx = to.x - from.x, dz = to.z - from.z, travel = Math.hypot(dx, dz);
  if (travel > 0.001) {
    for (const pin of result) if (distanceToSegment(pin, from, to) < 0.75) {
      const impulse = Math.min(10, Math.max(4, travel / Math.max(dt, 0.001)));
      pin.vx = dx / travel * impulse + ((pin.id % 3) - 1) * 0.7;
      pin.vz = dz / travel * impulse;
      pin.fallen = true;
      pin.angle = Math.atan2(pin.vx, pin.vz);
    }
  }
  for (let i = 0; i < result.length; i++) for (let j = i + 1; j < result.length; j++) {
    const a = result[i], b = result[j];
    const x = b.x - a.x, z = b.z - a.z, distance = Math.hypot(x, z);
    if (distance > 0 && distance < 0.7) {
      const energy = Math.max(Math.hypot(a.vx, a.vz), Math.hypot(b.vx, b.vz));
      if (energy > 0.65) {
        const nx = x / distance, nz = z / distance;
        const push = energy * 0.68;
        a.vx -= nx * push * 0.25; a.vz -= nz * push * 0.25;
        b.vx += nx * push; b.vz += nz * push;
        a.fallen = b.fallen = true;
        a.angle = Math.atan2(a.vx, a.vz); b.angle = Math.atan2(b.vx, b.vz);
        const separation = (0.7 - distance) / 2;
        a.x -= nx * separation; a.z -= nz * separation;
        b.x += nx * separation; b.z += nz * separation;
      }
    }
  }
  for (const pin of result) {
    pin.x += pin.vx * dt; pin.z += pin.vz * dt;
    pin.vx *= Math.exp(-3 * dt); pin.vz *= Math.exp(-3 * dt);
    if (pin.x < 17.3 || pin.x > 24.7) { pin.x = Math.max(17.3, Math.min(24.7, pin.x)); pin.vx *= -0.35; }
    if (pin.z < -14 || pin.z > 5) { pin.z = Math.max(-14, Math.min(5, pin.z)); pin.vz *= -0.35; }
    if (pin.fallen) pin.tilt = Math.min(Math.PI / 2, pin.tilt + dt * 5);
  }
  return result;
}
export function stuntHeight(p: Position) {
  if (p.x < 16.2 || p.x > 19.8 || p.z < 12 || p.z > 18) return 0;
  return Math.sin((p.z - 12) / 6 * Math.PI) * 1.3;
}
