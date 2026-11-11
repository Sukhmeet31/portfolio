import { useEffect } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Flag,
  RotateCcw,
  X,
} from "lucide-react";
import { signals } from "@/lib/signal-run";

export function SignalRunControl({
  progress,
  disabled,
  onStart,
  onEnd,
}: {
  progress: number | null;
  disabled: boolean;
  onStart: () => void;
  onEnd: () => void;
}) {
  const finished = progress === signals.length;
  return (
    <section className="signal-run-control" aria-labelledby="signal-run-title">
      <div className="signal-run-icon">
        <Flag size={18} />
      </div>
      <div className="signal-run-copy">
        <h2 id="signal-run-title">
          Signal Run <span className="mono">A LITTLE DETOUR</span>
        </h2>
        <p aria-label="Signal Run progress" aria-live="polite">
          {progress === null
            ? "Five beacons. One little rover. Follow the glow."
            : `${progress} / 5 · ${finished ? "Circuit complete. Nicely driven." : "Drive through the glowing beacon."}`}
        </p>
      </div>
      <button
        className="signal-start"
        disabled={disabled}
        onClick={onStart}
        aria-label={
          progress === null
            ? "Start Signal Run"
            : finished
              ? "Play Signal Run again"
              : "Restart Signal Run"
        }
      >
        {progress === null ? <Flag size={13} /> : <RotateCcw size={13} />}
        {progress === null ? "Start run" : finished ? "Play again" : "Restart"}
      </button>
      {progress !== null && (
        <button
          className="signal-end"
          aria-label="End Signal Run"
          onClick={onEnd}
        >
          <X size={16} />
        </button>
      )}
    </section>
  );
}

const directions = [
  { key: "w", name: "forward", Icon: ArrowUp },
  { key: "a", name: "left", Icon: ArrowLeft },
  { key: "s", name: "backward", Icon: ArrowDown },
  { key: "d", name: "right", Icon: ArrowRight },
];
export function DirectionalPad({
  onDrive,
  onFocusScene,
  onStop,
}: {
  onDrive: (key: string, down: boolean) => void;
  onFocusScene: () => void;
  onStop: () => void;
}) {
  // Completion can remove a held button before its key/pointer release arrives.
  useEffect(() => onStop, [onStop]);
  return (
    <div
      className="directional-pad"
      role="group"
      aria-label="Rover directional controls"
    >
      {directions.map(({ key, name, Icon }) => (
        <button
          key={key}
          className={`drive-${key}`}
          aria-label={`Drive ${name}`}
          title={`Drive ${name}`}
          onPointerDown={(event) => {
            event.preventDefault();
            onFocusScene();
            event.currentTarget.setPointerCapture(event.pointerId);
            onDrive(key, true);
          }}
          onPointerUp={() => onDrive(key, false)}
          onPointerCancel={() => onDrive(key, false)}
          onLostPointerCapture={() => onDrive(key, false)}
          onBlur={onStop}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              onDrive(key, true);
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              onDrive(key, false);
            }
          }}
        >
          <Icon size={17} />
        </button>
      ))}
      <span className="mono">HOLD TO DRIVE</span>
    </div>
  );
}

export function SignalMarkers({ progress }: { progress: number | null }) {
  if (progress === null) return null;
  return (
    <group>
      {signals.map((point, index) => {
        const current = index === progress;
        const collected = index < progress;
        const color = current ? "#4355f9" : collected ? "#7f976b" : "#b3b6aa";
        return (
          <group key={index} position={[point.x, 0.09, point.z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.65, 0.82, 40]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={current ? 1 : 0.6}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.62, 32]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={current ? 0.22 : 0.08}
                depthWrite={false}
              />
            </mesh>
            {current && (
              <mesh position={[0, 0.9, 0]}>
                <octahedronGeometry args={[0.25]} />
                <meshStandardMaterial
                  color="#a4b2ff"
                  emissive="#4355f9"
                  emissiveIntensity={0.7}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
