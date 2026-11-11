import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";
import { newPins, newRace, RACE_GATES, stepPins, stepRace, type RaceState } from "@/lib/coastal-games";
import type { Position } from "@/lib/movement";

export function CoastalActivities({ roverPosition, joltRef, reset, bowlingReset, raceRun, raceActive, reducedMotion, onBowling, onRace }: {
  roverPosition: RefObject<Position>; joltRef: RefObject<number>; reset: number; bowlingReset: number;
  raceRun: number; raceActive: boolean; reducedMotion: boolean;
  onBowling: (count: number) => void; onRace: (race: RaceState) => void;
}) {
  const pins = useRef(newPins());
  const groups = useRef<(Group | null)[]>([]);
  const previous = useRef({ ...roverPosition.current });
  const race = useRef(newRace());
  const reported = useRef(0);
  const raceUpdatedAt = useRef<number | null>(null);
  const pendingRaceTime = useRef(0);
  const gate = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => { previous.current = { ...roverPosition.current }; }, [reset, roverPosition]);
  useEffect(() => { pins.current = newPins(); invalidate(); }, [bowlingReset, invalidate]);
  useEffect(() => { race.current = newRace(); reported.current = 0; invalidate(); }, [raceRun, invalidate]);
  useEffect(() => {
    if (!raceActive) return;
    raceUpdatedAt.current = document.hidden ? null : performance.now();
    pendingRaceTime.current = 0;
    const visibility = () => {
      const now = performance.now();
      if (document.hidden) {
        if (raceUpdatedAt.current !== null) pendingRaceTime.current += (now - raceUpdatedAt.current) / 1000;
        raceUpdatedAt.current = null;
      } else raceUpdatedAt.current = now;
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      raceUpdatedAt.current = null;
      pendingRaceTime.current = 0;
    };
  }, [raceActive, raceRun]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    const dt = Math.min(delta, 0.05);
    const before = pins.current.filter((pin) => pin.fallen).length;
    pins.current = stepPins(pins.current, previous.current, roverPosition.current, dt);
    previous.current = { ...roverPosition.current };
    const down = pins.current.filter((pin) => pin.fallen).length;
    if (before !== down) { joltRef.current = reducedMotion ? 0 : 0.5; onBowling(down); }
    pins.current.forEach((pin, index) => {
      const group = groups.current[index];
      if (!group) return;
      const tilt = reducedMotion && pin.fallen ? Math.PI / 2 : pin.tilt;
      group.position.set(pin.x, pin.fallen ? 0.3 : 0.13, pin.z);
      group.rotation.set(Math.cos(pin.angle) * tilt, 0, -Math.sin(pin.angle) * tilt);
    });
    if (pins.current.some((pin) => pin.fallen && (pin.tilt < Math.PI / 2 || Math.hypot(pin.vx, pin.vz) > 0.03))) invalidate();
    if (raceActive) {
      // Lap time uses visible wall time; physics may clamp its step on slow GPUs.
      const now = performance.now();
      const elapsed = pendingRaceTime.current + (raceUpdatedAt.current === null ? 0 : (now - raceUpdatedAt.current) / 1000);
      raceUpdatedAt.current = now;
      pendingRaceTime.current = 0;
      const next = stepRace(race.current, roverPosition.current, elapsed);
      const changed = next.next !== race.current.next || next.finished || next.invalid;
      race.current = next;
      reported.current += elapsed;
      if (changed || reported.current > 0.15) { onRace({ ...next }); reported.current = 0; }
      const target = RACE_GATES[next.next];
      if (gate.current && target) gate.current.position.set(target.x, 0.15, target.z);
      invalidate();
    }
  });
  return <group>
    {newPins().map((pin, i) => <group key={pin.id} ref={(node) => { groups.current[i] = node; }} position={[pin.x, 0.13, pin.z]}>
      <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.14, 0.29, 0.8, 12]} /><meshStandardMaterial color="#f4eddb" roughness={0.4} /></mesh>
      <mesh position={[0, 0.82, 0]} castShadow><sphereGeometry args={[0.19, 12, 10]} /><meshStandardMaterial color="#f4eddb" roughness={0.4} /></mesh>
      <mesh position={[0, 0.68, 0]}><cylinderGeometry args={[0.16, 0.16, 0.11, 12]} /><meshStandardMaterial color="#e16b62" /></mesh>
    </group>)}
    {raceActive && <group ref={gate} position={[RACE_GATES[0].x, 0.15, RACE_GATES[0].z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.55, 1.8, 32]} /><meshBasicMaterial color="#f5d970" /></mesh>
      <mesh position={[0, 1.5, 0]}><octahedronGeometry args={[0.38]} /><meshStandardMaterial color="#ffe899" emissive="#f9c85c" emissiveIntensity={0.7} /></mesh>
    </group>}
  </group>;
}
