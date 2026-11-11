"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  X,
  Orbit,
  Send,
  Palette,
  LocateFixed,
} from "lucide-react";
import { projects } from "@/lib/content";
import { START_POSITION, type Position } from "@/lib/movement";
import {
  toys,
  destinations,
  type DestinationId,
  roverPaints,
  type PlaygroundActions,
  type ToyId,
} from "@/lib/workshop-world";
import { MiniMap } from "./mini-map";
import { advanceSignalRun, signals } from "@/lib/signal-run";
import { DirectionalPad, SignalRunControl } from "./signal-run";
import { WorkshopMusic } from "./music";
import { ProjectPassport } from "./passport";
import { stampProject, useProjectPassport } from "@/lib/project-passport";
import { newRace, type RaceState } from "@/lib/coastal-games";
import { CoastalGames, IslandTravel, destinationIcons } from "./coastal-controls";
import type { Wave } from "./coastal-world";

const toyIcons = { sculpture: Orbit, plane: Send, paint: Palette };

function StaticWorkshop({ loading = false }: { loading?: boolean }) {
  return (
    <div className="static-workshop">
      <Image
        src="/images/workshop-expanded.jpg"
        alt="The coastal workshop island with project stations, a racing circuit, bowling lane, ocean pier and lighthouse"
        width={1062}
        height={570}
        sizes="(max-width: 760px) 100vw, 70vw"
        loading="eager"
      />
      <h2>{loading ? "Opening the workshop…" : "A quieter way to explore."}</h2>
      <p>
        {loading
          ? "The projects are ready to browse below."
          : "The 3D view is unavailable here. You can still explore every project using the project index."}
      </p>
    </div>
  );
}
const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <StaticWorkshop loading />,
});
class SceneBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onUnavailable();
  }
  render() {
    return this.state.failed ? <StaticWorkshop /> : this.props.children;
  }
}
const movementKeys = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
]);

export function Workshop() {
  const stamps = useProjectPassport();
  const [selection, setSelection] = useState<{
    slug: string;
    focus: boolean;
  } | null>(null);
  const selected = selection?.slug ?? null;
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [isStatic, setStatic] = useState(false);
  const [reset, setReset] = useState(0);
  const [position, setPosition] = useState<Position>(START_POSITION);
  const [spawn, setSpawn] = useState<Position>(START_POSITION);
  const [boost, setBoost] = useState(false);
  const [raceRun, setRaceRun] = useState(0);
  const [race, setRace] = useState<RaceState | null>(null);
  const [bowlingReset, setBowlingReset] = useState(0);
  const [pins, setPins] = useState(0);
  const [wave, setWave] = useState<Wave>({ id: 0, x: 22, z: 29 });
  const raceActive = race !== null && !race.finished && !race.invalid;
  const [signalProgress, setSignalProgress] = useState<number | null>(null);
  const [actions, setActions] = useState<PlaygroundActions>({
    sculpture: 0,
    plane: 0,
    paint: 0,
  });
  const [busy, setBusy] = useState<Record<ToyId, boolean>>({
    sculpture: false,
    plane: false,
    paint: false,
  });
  const busyActions = useRef(new Set<ToyId>());
  const [message, setMessage] = useState(
    "A few things here are just for fun. Try one.",
  );
  const [dusk, setDusk] = useState(false);
  const [follow, setFollow] = useState(true);
  const [cameraAction, setCameraAction] = useState<{
    id: number;
    type: "in" | "out" | "reset";
  }>({ id: 0, type: "reset" });
  const scene = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const keys = useRef(new Set<string>());
  const previousFocus = useRef<HTMLElement | null>(null);
  const project = projects.find((p) => p.slug === selected);
  const stop = useCallback(() => {
    keys.current.clear();
    setActive(false);
  }, []);
  const unavailable = useCallback(() => {
    setStatic(true);
    setSignalProgress(null);
    setRace(null);
    stop();
  }, [stop]);
  const onReady = useCallback(() => setReady(true), []);
  const onRace = useCallback((state: RaceState) => setRace(state), []);
  const onBowling = useCallback((count: number) => setPins(count), []);
  const onWave = useCallback((point: Position) => setWave((value) => ({ ...point, id: value.id + 1 })), []);
  const onPosition = useCallback((p: Position) => {
    setPosition(p);
    setSignalProgress((progress) =>
      progress === null ? null : advanceSignalRun(progress, p),
    );
  }, []);
  const play = useCallback(
    (id: ToyId) => {
      if (!ready || isStatic || busyActions.current.has(id)) return;
      if (id !== "paint") {
        busyActions.current.add(id);
        setBusy((state) => ({ ...state, [id]: true }));
      }
      setActions((state) => ({ ...state, [id]: state[id] + 1 }));
      setMessage(
        id === "plane"
          ? "Paper plane in flight. Taking the scenic route."
          : id === "sculpture"
            ? "A little momentum. The sculpture is spinning."
            : `Rover repainted ${roverPaints[(actions.paint + 1) % roverPaints.length].name.toLowerCase()}. Ready for a new lap.`,
      );
    },
    [ready, isStatic, actions.paint],
  );
  const onToyComplete = useCallback((id: "sculpture" | "plane") => {
    busyActions.current.delete(id);
    setBusy((state) => ({ ...state, [id]: false }));
    setMessage(
      id === "plane"
        ? "Paper plane landed. Ready for another flight."
        : "A new angle. Give the sculpture another spin.",
    );
  }, []);
  const select = useCallback((slug: string, focus: boolean) => {
    stampProject(slug);
    if (focus) {
      previousFocus.current = document.activeElement as HTMLElement;
      keys.current.clear();
      setActive(false);
    }
    setSelection({ slug, focus });
  }, []);
  useEffect(() => {
    if (selection?.focus) panelHeading.current?.focus({ preventScroll: true });
  }, [selection]);
  useEffect(() => {
    document.documentElement.dataset.workshopNight = String(dusk);
    return () => { delete document.documentElement.dataset.workshopNight; };
  }, [dusk]);
  useEffect(() => {
    const heldKeys = keys.current;
    const hidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", hidden);
      heldKeys.clear();
    };
  }, [stop]);
  function closePanel() {
    setSelection(null);
    stop();
    previousFocus.current?.focus({ preventScroll: true });
  }
  function camera(type: "in" | "out" | "reset") {
    if (type === "reset") setFollow(false);
    setCameraAction((a) => ({ id: a.id + 1, type }));
  }
  function resetRover() {
    stop();
    setSignalProgress(null);
    setRace(null);
    setSpawn(START_POSITION);
    setReset((value) => value + 1);
    setSelection(null);
    scene.current?.focus({ preventScroll: true });
  }
  function startSignalRun() {
    resetRover();
    setSignalProgress(0);
    setFollow(true);
    scene.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }
  function travel(id: DestinationId) {
    const destination = destinations.find((item) => item.id === id)!;
    stop();
    setSignalProgress(null);
    setRace(null);
    setSpawn({ x: destination.x, z: destination.z });
    setReset((value) => value + 1);
    setSelection(null);
    setFollow(true);
    scene.current?.focus({ preventScroll: true });
    scene.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }
  function startRace() {
    travel("race");
    setRace(newRace());
    setRaceRun((value) => value + 1);
  }
  function resetPins() {
    travel("bowling");
    setBowlingReset((value) => value + 1);
    setPins(0);
  }
  function drive(key: string, down: boolean) {
    if (!ready || isStatic) return;
    if (down) keys.current.add(key);
    else keys.current.delete(key);
    setActive([...keys.current].some((key) => movementKeys.has(key)));
  }
  return (
    <>
      <IslandTravel disabled={!ready || isStatic} night={dusk} boost={boost} onTravel={travel} onNight={() => setDusk((value) => !value)} onBoost={() => setBoost((value) => !value)} onOverview={() => camera("reset")} />
      <div className="workshop-activity-bar">
        <SignalRunControl
          progress={signalProgress}
          disabled={!ready || isStatic}
          onStart={startSignalRun}
          onEnd={() => {
            stop();
            setSignalProgress(null);
          }}
        />
        <WorkshopMusic />
      </div>
      <div
        className="workshop-layout"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            if (selected) closePanel();
            else {
              stop();
              scene.current?.blur();
            }
          }
        }}
      >
        <div className="scene-column">
          <div
            ref={scene}
            className="scene-container"
            tabIndex={isStatic ? -1 : 0}
            role="region"
            aria-label="Interactive workshop. Focus here and use arrow keys or W A S D to move the rover."
            aria-describedby="workshop-instructions"
            data-ready={ready && !isStatic}
            data-lighting={dusk ? "night" : "day"}
            onPointerDown={(event) => {
              if (!(event.target as HTMLElement).closest("button,a"))
                scene.current?.focus({ preventScroll: true });
            }}
            onKeyDown={(event) => {
              if (
                isStatic ||
                event.target !== event.currentTarget ||
                (!movementKeys.has(event.key.toLowerCase()) && event.key !== "Shift")
              )
                return;
              event.preventDefault();
              keys.current.add(event.key.toLowerCase());
              setActive([...keys.current].some((key) => movementKeys.has(key)));
            }}
            onKeyUp={(event) => {
              keys.current.delete(event.key.toLowerCase());
              setActive([...keys.current].some((key) => movementKeys.has(key)));
            }}
            onBlur={stop}
          >
            {isStatic ? (
              <StaticWorkshop />
            ) : (
              <SceneBoundary onUnavailable={unavailable}>
                <Scene
                  keys={keys}
                  labels={labels}
                  active={active}
                  selected={selected}
                  actions={actions}
                  dusk={dusk}
                  follow={follow}
                  signalProgress={signalProgress}
                  reset={reset}
                  spawn={spawn}
                  boost={boost}
                  raceRun={raceRun}
                  raceActive={raceActive}
                  bowlingReset={bowlingReset}
                  wave={wave}
                  onWave={onWave}
                  onRace={onRace}
                  onBowling={onBowling}
                  cameraAction={cameraAction}
                  onSelect={select}
                  onPosition={onPosition}
                  onReady={onReady}
                  onUnavailable={unavailable}
                  onPlay={play}
                  onToyComplete={onToyComplete}
                />
              </SceneBoundary>
            )}
            {!isStatic && (
              <div ref={labels} className="station-labels">
                {projects.map((project) => (
                  <button
                    key={project.slug}
                    data-anchor={project.slug}
                    className={`station-badge ${selected === project.slug ? "active" : ""}`}
                    aria-label={`Select ${project.name} station`}
                    onClick={() => select(project.slug, true)}
                  >
                    {project.number}
                  </button>
                ))}
                {toys.map((toy) => {
                  const Icon = toyIcons[toy.id];
                  return (
                    <button
                      key={toy.id}
                      data-anchor={toy.id}
                      className="station-badge toy-badge"
                      aria-label={`${toy.name} in the workshop`}
                      disabled={!ready || busy[toy.id]}
                      onClick={() => play(toy.id)}
                      title={toy.name}
                    >
                      <Icon size={15} />
                    </button>
                  );
                })}
                {destinations.filter((item) => item.id !== "home").map((destination) => {
                  const Icon = destinationIcons[destination.id];
                  return <button key={destination.id} data-destination={destination.id} className="station-badge destination-badge" aria-label={`Travel to ${destination.name.toLowerCase()}`} title={destination.name} disabled={!ready} onClick={() => travel(destination.id)}><Icon size={16} /></button>;
                })}
              </div>
            )}
            {!isStatic && (
              <div className="scene-hint mono">
                <span className="scene-status-dot" />
                {ready
                  ? signalProgress !== null
                    ? `${signalProgress} / 5 SIGNALS · ${signalProgress === signals.length ? "CIRCUIT COMPLETE" : "FOLLOW THE GLOW"}`
                    : race !== null
                      ? race.invalid ? "OFF TRACK · RESTART FOR A CLEAN LAP" : race.finished ? `LAP COMPLETE · ${race.elapsed.toFixed(1)}s` : `${race.next} / 6 GATES · ${race.elapsed.toFixed(1)}s · FOLLOW THE GOLD`
                    : active
                      ? "ROVER IN MOTION"
                      : "ONE ISLAND. FOLLOW YOUR CURIOSITY."
                  : "PREPARING YOUR WORKSHOP"}
              </div>
            )}
            {!isStatic && ready && (
              <MiniMap position={position} progress={signalProgress} />
            )}
            {!isStatic &&
              ready && (
                <DirectionalPad
                  // Remounting releases a held finish-line input while keeping free driving available.
                  key={signalProgress === signals.length ? "completed" : "driving"}
                  onDrive={drive}
                  onFocusScene={() =>
                    scene.current?.focus({ preventScroll: true })
                  }
                  onStop={stop}
                />
              )}
          </div>
          <div className="scene-toolbar">
            <div>
              <button disabled={!ready || isStatic} onClick={resetRover}>
                <RotateCcw size={13} />
                Reset rover
              </button>
              <button
                disabled={!ready || isStatic}
                onClick={() => camera("reset")}
                aria-label="Reset camera"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <span className="mono" aria-label="Rover coordinates">
              X {position.x.toFixed(1)} / Z {position.z.toFixed(1)}
            </span>
            <div>
              <button
                disabled={!ready || isStatic}
                onClick={() => camera("out")}
                aria-label="Zoom out"
              >
                <Minus size={14} />
              </button>
              <button
                disabled={!ready || isStatic}
                onClick={() => camera("in")}
                aria-label="Zoom in"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <CoastalGames disabled={!ready || isStatic} race={race} pins={pins} waves={wave.id} onRace={startRace} onBowling={resetPins} onWaves={() => { travel("coast"); onWave({ x: 22, z: 29 }); }} />
        </div>
        <aside className="workshop-sidebar">
          <span className="mono">THE PROJECT INDEX</span>
          <h2>Choose a starting point.</h2>
          <p>Select a station in the courtyard or open a project here.</p>
          <ol className="station-list">
            {projects.map((p) => (
              <li key={p.slug}>
                <button
                  aria-pressed={selected === p.slug}
                  aria-controls={
                    selected === p.slug ? "selected-project" : undefined
                  }
                  onClick={() => select(p.slug, true)}
                >
                  <span className="mono">{p.number}</span>
                  <span>{p.name}</span>
                  <ArrowUpRight size={14} />
                </button>
              </li>
            ))}
          </ol>
          {project && (
            <section
              id="selected-project"
              className="workshop-panel"
              aria-label="Selected project"
            >
              <div className="panel-top">
                <span className="mono">STATION {project.number}</span>
                <button aria-label="Close project panel" onClick={closePanel}>
                  <X size={16} />
                </button>
              </div>
              <h3 ref={panelHeading} tabIndex={-1}>
                {project.name}
              </h3>
              <p>{project.summary}</p>
              <Link href={`/projects/${project.slug}`}>
                Read case study <ArrowRight size={15} />
              </Link>
            </section>
          )}
          <ProjectPassport stamps={stamps} />
          <section className="workshop-play" aria-labelledby="play-title">
            <span className="mono">OFF THE CLOCK</span>
            <h3 id="play-title">Go on. Play a little.</h3>
            <div className="toy-controls">
              {toys.map((toy) => {
                const Icon = toyIcons[toy.id];
                return (
                  <button
                    key={toy.id}
                    onClick={() => play(toy.id)}
                    disabled={!ready || isStatic || busy[toy.id]}
                    aria-label={toy.name}
                  >
                    <Icon size={15} />
                    <span>{toy.name}</span>
                    {toy.id === "paint" ? (
                      <span
                        className="paint-swatch"
                        style={
                          {
                            "--paint":
                              roverPaints[actions.paint % roverPaints.length]
                                .color,
                          } as React.CSSProperties
                        }
                      >
                        {roverPaints[actions.paint % roverPaints.length].name}
                      </span>
                    ) : (
                      <span className="toy-action-state">
                        {busy[toy.id] ? "…" : "↗"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="toy-feedback" role="status" aria-live="polite">
              {isStatic
                ? "The toys need the 3D view. Every project is still ready to explore."
                : message}
            </p>
            <div className="workshop-view-options">
              <button
                disabled={!ready || isStatic}
                aria-pressed={follow}
                onClick={() => setFollow((value) => !value)}
              >
                <LocateFixed size={14} /> Follow rover
              </button>
              <button disabled={!ready || isStatic} onClick={() => camera("reset")}><Maximize2 size={14} /> Whole island</button>
            </div>
          </section>
          <div id="workshop-instructions" className="workshop-guide">
            <span className="mono">A LITTLE FIELD GUIDE</span>
            <p className="desktop-instructions">
              Click the courtyard, then use <kbd>W</kbd> <kbd>A</kbd>{" "}
              <kbd>S</kbd> <kbd>D</kbd> or the arrow keys to drive. Drag to look
              around; right-drag to pan. Hold <kbd>Shift</kbd> to boost. Use the travel stops to find a new corner of the island.{" "}
              <kbd>Esc</kbd> releases the controls.
            </p>
            <p className="mobile-instructions">
              Hold the arrow buttons to drive. Tap a travel stop to roam somewhere new. Drag to look around, or use the zoom buttons. Every project is also listed above.
            </p>
          </div>
        </aside>
      </div>
      <div className="workshop-bottom">
        <span className="mono">A LITTLE MORE ROOM FOR CURIOSITY.</span>
        <p>Your pace. Your route. A few things to discover.</p>
      </div>
    </>
  );
}
