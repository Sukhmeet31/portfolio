import { onRaceTrack, RACE_GATES, RACE_START } from "./coastal-games.ts";
import { WORLD } from "./workshop-world.ts";
import type { Position } from "./movement.ts";

export const MAIN_DOCK = { x: 30, z: 0 };
export const COVE_DOCK = { x: 44, z: 4 };
export const COVE = { x: 50, z: 0, width: 16, depth: 18 };
export const CLUES = [
  { id: "grove", name: "Grove compass", hint: "South of the courtyard, near the trees.", x: -5, z: 16 },
  { id: "north", name: "North star", hint: "Beyond the courtyard’s northern edge.", x: 1, z: -16 },
  { id: "shore", name: "Lighthouse token", hint: "Between the lighthouse and the eastern shore.", x: 29, z: 22 },
  { id: "bottle", name: "Message in a bottle", hint: "Across the water in Secret Cove.", x: 51, z: -3 },
] as const;
export type Clue = (typeof CLUES)[number]["id"];
export type Sample = Position & { t: number; heading: number; gate?: number };
export type BestLap = { duration: number; samples: Sample[] };
export type AdventureSave = {
  best: BestLap | null; found: Clue[]; paint: "stock" | "coral" | "sunset";
  rally: boolean; headlights: boolean;
};
export const INITIAL_ADVENTURE: AdventureSave = { best: null, found: [], paint: "stock", rally: false, headlights: false };

export function landBounds(p: Position) {
  return p.x >= 42
    ? { minX: 42.8, maxX: 57.2, minZ: -8.2, maxZ: 8.2 }
    : { minX: -WORLD.maxX, maxX: WORLD.maxX, minZ: -WORLD.maxZ, maxZ: WORLD.maxZ };
}

export function ferryPosition(returning: boolean, progress: number): Position {
  const from = returning ? COVE_DOCK : MAIN_DOCK;
  const to = returning ? MAIN_DOCK : COVE_DOCK;
  const t = Math.max(0, Math.min(1, progress));
  return { x: from.x + (to.x - from.x) * t, z: from.z + (to.z - from.z) * t };
}

export function collectNear(found: Clue[], p: Position): Clue[] {
  const nearby = CLUES.find((clue) => clue.id !== "bottle" && !found.includes(clue.id)
    && Math.hypot(p.x - clue.x, p.z - clue.z) < 1.85);
  return nearby ? [...found, nearby.id] : found;
}

export function unlocks(found: Clue[], stamps: number) {
  const count = new Set(found).size;
  return { coral: count >= 1, sunset: count >= 3, rally: stamps >= 3, headlights: found.includes("bottle") };
}

export function appendSample(samples: Sample[], p: Position, t: number, heading = 0, gate?: number): Sample[] {
  const last = samples.at(-1);
  if (last && t <= last.t) return samples;
  const recording = samples.length >= 1200 ? samples.filter((sample, i) => i % 2 === 0 || sample.gate !== undefined) : samples;
  recording.push({ x: p.x, z: p.z, t, heading, gate });
  return recording;
}

export function ghostAt(lap: BestLap, t: number): Sample {
  const { samples } = lap;
  if (t <= 0) return samples[0];
  if (t >= lap.duration) return samples[samples.length - 1];
  let low = 0, high = samples.length - 1;
  while (high - low > 1) {
    const mid = (low + high) >> 1;
    if (samples[mid].t <= t) low = mid;
    else high = mid;
  }
  const a = samples[low], b = samples[high];
  const blend = (t - a.t) / (b.t - a.t);
  const turn = Math.atan2(Math.sin(b.heading - a.heading), Math.cos(b.heading - a.heading));
  return { t, x: a.x + (b.x - a.x) * blend, z: a.z + (b.z - a.z) * blend, heading: a.heading + turn * blend };
}

function validLap(value: unknown): value is BestLap {
  if (!value || typeof value !== "object") return false;
  const { duration, samples } = value as BestLap;
  if (!Number.isFinite(duration) || duration < 5 || !Array.isArray(samples) || samples.length < 7 || samples.length > 1200) return false;
  let previous = -1;
  let passed = 0;
  for (const pose of samples) {
    if (!pose || !Number.isFinite(pose.t) || pose.t <= previous || !Number.isFinite(pose.heading)
      || !Number.isFinite(pose.x) || !Number.isFinite(pose.z) || !onRaceTrack(pose)) return false;
    previous = pose.t;
    const target = RACE_GATES[passed];
    if (pose.gate !== undefined) {
      if (!target || pose.gate !== passed || Math.hypot(pose.x - target.x, pose.z - target.z) >= 1.9) return false;
      passed += 1;
    }
  }
  const first = samples[0];
  return first.t === 0 && first.x === RACE_START.x && first.z === RACE_START.z
    && passed === RACE_GATES.length && samples.at(-1)?.gate === RACE_GATES.length - 1 && previous === duration;
}

export function chooseBest(old: BestLap | null, next: BestLap) {
  return validLap(next) && (!old || next.duration < old.duration) ? next : old;
}

export function lapMedal(seconds: number) {
  return seconds <= 18 ? "Gold" : seconds <= 24 ? "Silver" : "Bronze";
}

export function readAdventure(raw: string): AdventureSave {
  if (raw.length > 200_000) return INITIAL_ADVENTURE;
  try {
    const data = JSON.parse(raw) as Partial<AdventureSave> | null;
    if (!data || typeof data !== "object") return INITIAL_ADVENTURE;
    const found = Array.isArray(data.found) ? CLUES.filter((clue) => data.found?.includes(clue.id)).map((clue) => clue.id) : [];
    const earned = unlocks(found, 0);
    let paint: AdventureSave["paint"] = "stock";
    if (data.paint === "coral" && earned.coral) paint = "coral";
    if (data.paint === "sunset" && earned.sunset) paint = "sunset";
    return { found, paint, best: validLap(data.best) ? data.best : null,
      rally: data.rally === true, headlights: data.headlights === true && earned.headlights };
  } catch {
    return INITIAL_ADVENTURE;
  }
}
