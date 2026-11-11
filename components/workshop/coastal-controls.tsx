import { Flag, Moon, Sun, Waves, Zap, Map, CircleDot, Cone, Trees, Home } from "lucide-react";
import { destinations, type DestinationId } from "@/lib/workshop-world";
import type { RaceState } from "@/lib/coastal-games";

export const destinationIcons = { home: Home, race: Flag, bowling: Cone, stunts: Trees, coast: Waves };

export function IslandTravel({ disabled, night, boost, onTravel, onNight, onBoost, onOverview }: {
  disabled: boolean; night: boolean; boost: boolean;
  onTravel: (id: DestinationId) => void; onNight: () => void; onBoost: () => void; onOverview: () => void;
}) {
  return <nav className="workshop-travel" aria-label="Island quick travel">
    <div className="island-title"><span className="mono">THE COASTAL PLAYGROUND</span><span>10× the room to roam</span></div>
    <div className="travel-stops">{destinations.map((destination) => {
      const Icon = destinationIcons[destination.id];
      return <button key={destination.id} disabled={disabled} aria-label={`Visit ${destination.name.toLowerCase()}`} onClick={() => onTravel(destination.id)}><Icon size={14} /><span>{destination.name}</span></button>;
    })}</div>
    <div className="island-options">
      <button disabled={disabled} onClick={onOverview}><Map size={14} /> Island overview</button>
      <button disabled={disabled} aria-pressed={boost} onClick={onBoost}><Zap size={14} /> Boost</button>
      <button disabled={disabled} aria-pressed={night} onClick={onNight}>{night ? <Sun size={14} /> : <Moon size={14} />} Night mode</button>
    </div>
  </nav>;
}

export function CoastalGames({ disabled, race, pins, waves, onRace, onBowling, onWaves }: {
  disabled: boolean; race: RaceState | null; pins: number; waves: number;
  onRace: () => void; onBowling: () => void; onWaves: () => void;
}) {
  return <section className="coastal-games" aria-label="Island activities">
    <article>
      <span className="coastal-game-icon"><Flag size={18} /><span className="mono">01 / WEST CIRCUIT</span></span>
      <h3>A lap by the sea.</h3>
      <p>Six glowing gates. Stay on the asphalt and chase a clean lap.</p>
      <strong aria-label="Race progress">{!race ? "Your starting grid is ready." : race.invalid ? "Off track · Restart for a clean lap" : race.finished ? `Lap complete · ${race.elapsed.toFixed(1)}s` : `${race.next} / 6 gates · ${race.elapsed.toFixed(1)}s`}</strong>
      <button disabled={disabled} aria-label={race ? "Restart coastal lap" : "Start coastal lap"} onClick={onRace}><Flag size={13} />{race ? "Restart lap" : "Start a lap"}<span>↗</span></button>
    </article>
    <article>
      <span className="coastal-game-icon"><CircleDot size={18} /><span className="mono">02 / ROVER BOWLING</span></span>
      <h3>Make a little mess.</h3>
      <p>Drive straight into the pins. Try a different angle, or boost for a bigger hit.</p>
      <strong aria-label="Bowling score">{pins} / 10 pins</strong>
      <button disabled={disabled} aria-label="Reset bowling pins" onClick={onBowling}><Cone size={13} />Re-rack & drive<span>↗</span></button>
    </article>
    <article>
      <span className="coastal-game-icon"><Waves size={18} /><span className="mono">03 / THE WATERFRONT</span></span>
      <h3>Take the scenic route.</h3>
      <p>Roll over the orange ramp, visit the lighthouse, or tap the ocean to send ripples.</p>
      <strong aria-label="Coast feedback">{waves ? "A little wave, sent out to sea." : "A sea breeze and no deadlines."}</strong>
      <button disabled={disabled} aria-label="Make waves" onClick={onWaves}><Waves size={13} />Make waves<span aria-hidden="true">↗</span></button>
    </article>
  </section>;
}
