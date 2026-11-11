import { projects } from "@/lib/content";
import { destinations, WORLD } from "@/lib/workshop-world";
import type { Position } from "@/lib/movement";
import { signals } from "@/lib/signal-run";

export function MiniMap({ position, progress }: { position: Position; progress: number | null }) {
  return <div className="workshop-minimap">
    <span className="mono">YOU ARE HERE</span>
    <svg viewBox="-35 -28 70 56" role="img" aria-label={`Workshop map. Rover at X ${position.x.toFixed(1)}, Z ${position.z.toFixed(1)}.`}>
      <rect x="-35" y="-28" width="70" height="56" rx="3" fill="#84b9c5" />
      <rect x={-WORLD.width / 2} y={-WORLD.depth / 2} width={WORLD.width} height={WORLD.depth} rx="2" fill="#d8dcc5" />
      <rect x="-30" y="-20" width="18" height="36" rx="1" fill="#626d72" />
      <rect x="-25" y="-15" width="8" height="26" fill="#b1c293" />
      <rect x="17" y="-14" width="8" height="19" fill="#bb8752" />
      <path d="M-10 0H16 M10 -18V21H25 M-8 21H10" fill="none" stroke="#f5f0de" strokeWidth="2" />
      <rect x="16" y="12" width="4" height="6" fill="#e49a60" />
      {projects.map((project) => <circle key={project.slug} cx={project.station.x} cy={project.station.z} r="1.3" fill="#4355f9" />)}
      {destinations.filter((item) => item.id !== "home").map((item) => <circle key={item.id} cx={item.x} cy={item.z} r="1.1" fill="#f5f0de" />)}
      {progress !== null && signals.map((point, index) => <circle key={index} cx={point.x} cy={point.z} r={index === progress ? 1 : 0.7} fill={index < progress ? "#7f976b" : index === progress ? "#4355f9" : "none"} stroke="#4355f9" strokeWidth="0.3" />)}
      <circle cx={position.x} cy={position.z} r="1.8" fill="#eeede8" stroke="#151515" strokeWidth="0.6" />
      <circle cx={position.x} cy={position.z} r="0.7" fill="#4355f9" />
    </svg>
  </div>;
}
