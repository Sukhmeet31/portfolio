"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { Group, OrthographicCamera, PCFShadowMap, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { projects } from "@/lib/content";
import { START_POSITION, stepRover, type Position } from "@/lib/movement";
import {
  toys,
  destinations,
  roverPaints,
  type PlaygroundActions,
  type ToyId,
} from "@/lib/workshop-world";
import { Playground } from "./playground";
import { SignalMarkers } from "./signal-run";
import { CoastalWorld, islandTrees, type Wave } from "./coastal-world";
import { CoastalActivities } from "./coastal-activities";
import { stuntHeight, type RaceState } from "@/lib/coastal-games";
import {
  Architecture,
  DocumentStation,
  PavilionStation,
  RoverModel,
  TerminalStation,
} from "./objects";

type Props = {
  keys: RefObject<Set<string>>;
  labels: RefObject<HTMLDivElement | null>;
  active: boolean;
  selected: string | null;
  actions: PlaygroundActions;
  dusk: boolean;
  follow: boolean;
  signalProgress: number | null;
  reset: number;
  spawn: Position;
  boost: boolean;
  raceRun: number;
  raceActive: boolean;
  bowlingReset: number;
  wave: Wave;
  onWave: (point: Position) => void;
  onRace: (race: RaceState) => void;
  onBowling: (count: number) => void;
  cameraAction: { id: number; type: "in" | "out" | "reset" };
  onSelect: (slug: string, focus: boolean) => void;
  onPosition: (position: Position) => void;
  onReady: () => void;
  onUnavailable: () => void;
  onPlay: (id: ToyId) => void;
  onToyComplete: (id: "sculpture" | "plane") => void;
};
const subscribeVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const obstacles = [
  ...projects.map((p) => p.station),
  ...toys.filter((toy) => toy.id !== "paint"),
  ...islandTrees.map((tree) => ({ ...tree, halfX: 0.35, halfZ: 0.35 })),
  { x: 28, z: 19, halfX: 1, halfZ: 1 },
  { x: 21, z: -14, halfX: 4, halfZ: 0.15 },
  { x: -8.6, z: -6.1, halfX: 0.6, halfZ: 0.6 },
  { x: 8.6, z: -6.1, halfX: 0.6, halfZ: 0.6 },
  { x: -5.6, z: -6.5, halfX: 1.65, halfZ: 0.35 },
  { x: -1.2, z: 5.25, halfX: 0.07, halfZ: 0.07 },
  { x: 1.2, z: 5.25, halfX: 0.07, halfZ: 0.07 },
  { x: 1.7, z: 5.85, halfX: 0.22, halfZ: 0.9 },
];
const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

function Rover({
  keys,
  active,
  reset,
  onSelect,
  onPosition,
  actions,
  spawn,
  boost,
  raceActive,
  reducedMotion,
  joltRef,
  roverPosition: positionRef,
}: Props & { roverPosition: RefObject<Position>; joltRef: RefObject<number>; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const zone = useRef<string | null>(null);
  const lastReported = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    positionRef.current = { ...spawn };
    if (group.current) {
      group.current.position.set(spawn.x, 0, spawn.z);
      group.current.rotation.y = 0;
    }
    zone.current = null;
    onPosition(spawn);
    invalidate();
  }, [reset, spawn, invalidate, onPosition, positionRef]);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  useFrame((state, delta) => {
    if (!group.current || document.hidden) return;
    joltRef.current = Math.max(0, joltRef.current - Math.min(delta, 0.05));
    group.current.rotation.z = reducedMotion ? 0 : Math.sin(joltRef.current * 35) * joltRef.current * 0.5;
    group.current.position.y = stuntHeight(positionRef.current) + (reducedMotion ? 0 : Math.abs(Math.sin(joltRef.current * 22)) * joltRef.current * 0.4);
    if (joltRef.current > 0) invalidate();
    if (!active) return;
    const held = keys.current;
    const dx =
      Number(held.has("d") || held.has("arrowright")) -
      Number(held.has("a") || held.has("arrowleft"));
    const dz =
      Number(held.has("s") || held.has("arrowdown")) -
      Number(held.has("w") || held.has("arrowup"));
    // Opposing keys still represent active input. Keep demand frames alive so
    // releasing either key immediately resumes the remaining direction.
    if (!dx && !dz) {
      invalidate();
      return;
    }
    positionRef.current = stepRover(
      positionRef.current,
      { x: dx, z: dz },
      delta,
      obstacles,
      boost || held.has("shift") ? 10 : raceActive ? 8 : Math.abs(positionRef.current.x) < 10 && Math.abs(positionRef.current.z) < 8 ? 2.8 : 6,
    );
    group.current.position.set(positionRef.current.x, stuntHeight(positionRef.current), positionRef.current.z);
    group.current.rotation.y = Math.atan2(-dx, -dz);
    const nearby =
      projects.find(
        (p) =>
          Math.hypot(
            p.station.x - positionRef.current.x,
            p.station.z - positionRef.current.z,
          ) < 2.1,
      )?.slug ?? null;
    if (nearby && nearby !== zone.current) onSelect(nearby, false);
    zone.current = nearby;
    if (state.clock.elapsedTime - lastReported.current > 0.12) {
      onPosition({ ...positionRef.current });
      lastReported.current = state.clock.elapsedTime;
    }
    invalidate();
  });
  return (
    <group ref={group} position={[START_POSITION.x, 0, START_POSITION.z]}>
      <RoverModel
        color={roverPaints[actions.paint % roverPaints.length].color}
      />
    </group>
  );
}

function Camera({
  action,
  follow,
  roverPosition,
}: {
  action: Props["cameraAction"];
  follow: boolean;
  roverPosition: RefObject<Position>;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { get, size, invalidate } = useThree();
  useEffect(() => {
    const camera = get().camera;
    if (!(camera instanceof OrthographicCamera)) return;
    camera.zoom = follow
      ? Math.min(size.width / 20, size.height / 16)
      : Math.min(size.width / 88, size.height / 70);
    if (!follow) {
      camera.position.set(58, 48, 66);
      controls.current?.target.set(0, 0.4, 0);
      controls.current?.update();
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, invalidate, follow]);
  useEffect(() => {
    const camera = get().camera;
    if (!(camera instanceof OrthographicCamera) || !action.id) return;
    if (action.type === "reset") {
      camera.position.set(58, 48, 66);
      controls.current?.target.set(0, 0.4, 0);
      camera.zoom = Math.min(size.width / 88, size.height / 70);
    } else
      camera.zoom = Math.max(
        2,
        Math.min(120, camera.zoom * (action.type === "in" ? 1.2 : 1 / 1.2)),
      );
    camera.updateProjectionMatrix();
    controls.current?.update();
    invalidate();
  }, [action, get, invalidate, size.height, size.width]);
  useFrame(({ camera }) => {
    if (!follow || !controls.current) return;
    const target = controls.current.target;
    const dx = roverPosition.current.x - target.x;
    const dz = roverPosition.current.z - target.z;
    if (Math.abs(dx) + Math.abs(dz) < 0.0001) return;
    camera.position.x += dx;
    camera.position.z += dz;
    target.x += dx;
    target.z += dz;
    controls.current.update();
  });
  return (
    <OrbitControls
      ref={controls}
      target={[0, 0.4, 0]}
      enablePan={!follow}
      enableDamping={false}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.7}
      minZoom={2}
      maxZoom={120}
    />
  );
}
function Lifecycle({ onUnavailable }: Pick<Props, "onUnavailable">) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onUnavailable]);
  return null;
}
function StationLabelPositions({ labels }: Pick<Props, "labels">) {
  const point = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    // Keep labels in the page's existing React root. Only their projected
    // screen positions are imperative, so there are no nested DOM roots.
    if (!labels.current) return;
    const occupied: { x: number; y: number }[] = [];
    Array.from(labels.current.children).forEach((child) => {
      const button = child as HTMLButtonElement;
      const project = projects.find((p) => p.slug === button.dataset.anchor);
      const toy = toys.find((t) => t.id === button.dataset.anchor);
      const destination = destinations.find((d) => d.id === button.dataset.destination);
      const anchor = project?.station ?? toy ?? destination;
      if (!anchor) return;
      point.current
        .set(anchor.x, toy?.height ?? 2.75, anchor.z)
        .project(camera);
      const x = ((point.current.x + 1) * size.width) / 2;
      const y = ((1 - point.current.y) * size.height) / 2;
      button.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      const shown =
        point.current.z >= -1 &&
        point.current.z <= 1 &&
        x > 20 &&
        x < size.width - 20 &&
        y > 20 &&
        y < size.height - 20 && !occupied.some((other) => Math.hypot(other.x - x, other.y - y) < 36);
      button.style.visibility = shown ? "visible" : "hidden";
      if (shown) occupied.push({ x, y });
    });
  });
  return null;
}
export default function Scene(props: Props) {
  const roverPosition = useRef({ ...START_POSITION });
  const joltRef = useRef(0);
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      orthographic
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [58, 48, 66], zoom: 12, near: 0.1, far: 300 }}
      frameloop={visible ? "demand" : "never"}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFShadowMap;
        props.onReady();
      }}
    >
      <color attach="background" args={[props.dusk ? "#081321" : "#acd3d5"]} />
      <ambientLight intensity={props.dusk ? 0.3 : 1.2} />
      <hemisphereLight
        args={[
          props.dusk ? "#9eaeed" : "#fffdf0",
          props.dusk ? "#51536b" : "#abbba7",
          props.dusk ? 0.65 : 1.5,
        ]}
      />
      <directionalLight
        position={[-20, 40, 20]}
        intensity={props.dusk ? 1.5 : 3.4}
        color={props.dusk ? "#c0caff" : "#ffffff"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
        shadow-camera-far={120}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <CoastalWorld night={props.dusk} reducedMotion={reducedMotion} visible={visible} onWave={props.onWave} wave={props.wave} />
      <Architecture dusk={props.dusk} />
      <SignalMarkers progress={props.signalProgress} />
      {projects.map((project) => (
        <group
          key={project.slug}
          position={[project.station.x, 0, project.station.z]}
          onClick={(event) => {
            event.stopPropagation();
            props.onSelect(project.slug, true);
          }}
        >
          {project.visual === "documents" ? (
            <DocumentStation />
          ) : project.visual === "terminal" ? (
            <TerminalStation />
          ) : (
            <PavilionStation />
          )}
        </group>
      ))}
      <Playground
        actions={props.actions}
        reducedMotion={reducedMotion}
        onPlay={props.onPlay}
        onComplete={props.onToyComplete}
      />
      <Rover {...props} roverPosition={roverPosition} joltRef={joltRef} reducedMotion={reducedMotion} />
      <CoastalActivities roverPosition={roverPosition} joltRef={joltRef} reset={props.reset} bowlingReset={props.bowlingReset} raceRun={props.raceRun} raceActive={props.raceActive} reducedMotion={reducedMotion} onRace={props.onRace} onBowling={props.onBowling} />
      <Camera
        action={props.cameraAction}
        follow={props.follow}
        roverPosition={roverPosition}
      />
      <Lifecycle onUnavailable={props.onUnavailable} />
      <StationLabelPositions labels={props.labels} />
    </Canvas>
  );
}
