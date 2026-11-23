import Link from "next/link";
import { Anchor, Compass, Gem, Paintbrush, Route } from "lucide-react";
import { CLUES, unlocks, type AdventureSave } from "@/lib/adventure";
import { profile, projects } from "@/lib/content";

type Gear = Pick<AdventureSave, "paint" | "rally" | "headlights">;

export function AdventureBar({ atCove, sailing, disabled, onFerry, onTour }: {
  atCove: boolean; sailing: boolean; disabled: boolean; onFerry: () => void; onTour: () => void;
}) {
  return <nav className="adventure-bar" aria-label="Workshop adventures">
    <a href="#treasure-hunt"><Gem size={16} /> Treasure hunt</a>
    <a href="#rover-garage"><Paintbrush size={16} /> Rover garage</a>
    <button disabled={disabled || sailing} onClick={onFerry}><Anchor size={16} />
      {sailing ? "Ferry crossing…" : atCove ? "Return to mainland" : "Ferry to Secret Cove"}
    </button>
    <button id="start-recruiter-tour" onClick={onTour}><Route size={16} /> Recruiter tour</button>
  </nav>;
}

export function ExpeditionPanel({ save, stamps, disabled, nearbyBottle, atCove, puzzle, onBottle, onAnswer, onGear }: {
  save: AdventureSave; stamps: number; disabled: boolean; nearbyBottle: boolean; atCove: boolean;
  puzzle: "closed" | "open" | "retry"; onBottle: () => void; onAnswer: (slug: string) => void;
  onGear: (gear: Partial<Gear>) => void;
}) {
  const earned = unlocks(save.found, stamps);
  return <div className="expedition-panels">
    <section id="treasure-hunt" aria-labelledby="treasure-heading">
      <h3 id="treasure-heading"><Compass size={19} /> Treasure hunt</h3>
      <p aria-live="polite" aria-label="Treasure progress">{save.found.length} / {CLUES.length} found</p>
      <ol className="treasure-list">
        {CLUES.map((clue) => <li key={clue.id} className={save.found.includes(clue.id) ? "discovered" : ""}>
          <strong>{save.found.includes(clue.id) ? `✓ ${clue.name}` : clue.hint}</strong>
        </li>)}
      </ol>
      {atCove && !earned.headlights && <>
        <button disabled={!nearbyBottle} onClick={onBottle}>Read the bottle message</button>
        {!nearbyBottle && <p>Drive to the golden marker along the path.</p>}
        {puzzle !== "closed" && nearbyBottle && <fieldset>
          <legend>Which project puts a code editor and an AI assistant side by side?</legend>
          {projects.map((project) => <button key={project.slug} onClick={() => onAnswer(project.slug)}>{project.name}</button>)}
          {puzzle === "retry" && <p aria-live="polite">Try again. The clue points to a developer workspace.</p>}
        </fieldset>}
      </>}
      {earned.headlights && <div className="bottle-story">
        <strong>The story in the bottle</strong>
        <p>{projects[1].sections[2].text} You unlocked headlights.</p>
        <Link href="/projects/codemate-x">Read the CodeMate-X case study ↗</Link>
      </div>}
    </section>
    <section id="rover-garage" aria-labelledby="garage-heading">
      <h3 id="garage-heading"><Paintbrush size={19} /> Rover garage</h3>
      <div className="garage-options">
        <button disabled={disabled} aria-pressed={save.paint === "stock"} onClick={() => onGear({ paint: "stock" })}>Stock paint</button>
        <button disabled={disabled || !earned.coral} aria-pressed={save.paint === "coral"} onClick={() => onGear({ paint: "coral" })}>Coral paint</button>
        <button disabled={disabled || !earned.sunset} aria-pressed={save.paint === "sunset"} onClick={() => onGear({ paint: "sunset" })}>Sunset paint</button>
        <button disabled={disabled || !earned.rally} aria-pressed={save.rally && earned.rally} onClick={() => onGear({ rally: !save.rally })}>Rally wheels</button>
        <button disabled={disabled || !earned.headlights} aria-pressed={save.headlights} onClick={() => onGear({ headlights: !save.headlights })}>Headlights</button>
      </div>
      <p>Find 1 clue for coral and 3 for sunset. Collect all project stamps for wheels. Solve the bottle for headlights.</p>
    </section>
  </div>;
}

export type Tour = { stop: number; paused: boolean; finished: boolean };

export function RecruiterTour({ tour, onStep, onPause, onClose }: {
  tour: Tour; onStep: (stop: number) => void; onPause: () => void; onClose: () => void;
}) {
  const project = projects[tour.stop];
  return <section className="recruiter-tour" aria-label="Recruiter tour" tabIndex={-1}>
    <div className="tour-copy" aria-live="polite">
      <span className="mono">{tour.finished ? "TOUR COMPLETE" : project ? `PROJECT ${tour.stop + 1} / ${projects.length}` : "CONNECT"}</span>
      <h2>{project?.name ?? "Meet Sukhmeet Singh"}</h2>
      <p>{project?.summary ?? "Software, systems and AI evaluation. Continue with the résumé or get in touch."}</p>
      {project && <p>{project.sections[1].text}</p>}
      {project ? <Link href={`/projects/${project.slug}`}>Read case study ↗</Link> : <div className="tour-links">
        <a href={profile.resume} download>Download résumé</a>
        <a href={`mailto:${profile.email}`}>Email Sukhmeet</a>
        <Link href="/#contact">Contact details</Link>
      </div>}
    </div>
    <div className="tour-buttons">
      <button disabled={tour.stop === 0} onClick={() => onStep(tour.stop - 1)}>Previous stop</button>
      {!tour.finished && <button onClick={onPause}>{tour.paused ? "Resume tour" : "Pause tour"}</button>}
      <button disabled={!project} onClick={() => onStep(tour.stop + 1)}>Next stop</button>
      <button onClick={onClose}>End tour</button>
    </div>
  </section>;
}
