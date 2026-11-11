"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";
import { WorkshopAudio } from "@/lib/workshop-audio";

export function WorkshopMusic() {
  const engine = useRef<WorkshopAudio | null>(null);
  const enabled = useRef(true);
  const operation = useRef(0);
  const mounted = useRef(true);
  const [requested, setRequested] = useState(true);
  const [notice, setNotice] = useState("Soft Circuit · explore to start");
  const syncPlayback = useCallback(async () => {
    const id = ++operation.current;
    try {
      const current = engine.current ?? (engine.current = new WorkshopAudio());
      const running = await current.setPlaying(
        enabled.current && !document.hidden,
      );
      if (mounted.current && id === operation.current) {
        setNotice(running ? "Soft Circuit · playing in the background" : enabled.current ? "Soft Circuit · explore to start" : "Soft Circuit · paused");
      }
    } catch (error) {
      if (mounted.current && id === operation.current) {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setNotice("Soft Circuit · explore to start");
        } else {
          enabled.current = false;
          setRequested(false);
          setNotice("Audio unavailable here. You can still explore.");
          engine.current?.destroy();
          engine.current = null;
        }
      }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    // A browser may keep resume() pending until a trusted interaction. Keep
    // controls available so a later request can supersede that attempt.
    // Start after mount; cleanup cancels this if the route exits immediately.
    const startup = window.setTimeout(() => { void syncPlayback(); }, 0);
    const visibility = () => {
      void syncPlayback();
    };
    const explore = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(".workshop-layout, .workshop-activity-bar, .workshop-travel") || target.closest(".radio-toggle")) return;
      if (event instanceof KeyboardEvent && (event.repeat || event.ctrlKey || event.metaKey || event.altKey)) return;
      if (enabled.current && !document.hidden && !engine.current?.isPlaying) void syncPlayback();
    };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("pointerup", explore, true);
    document.addEventListener("keydown", explore, true);
    return () => {
      mounted.current = false;
      window.clearTimeout(startup);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("pointerup", explore, true);
      document.removeEventListener("keydown", explore, true);
      engine.current?.destroy();
      engine.current = null;
    };
  }, [syncPlayback]);
  return (
    <section className="workshop-radio" aria-label="Workshop music">
      <Music2 size={17} aria-hidden="true" />
      <div className="radio-copy">
        <span className="mono">WORKSHOP RADIO</span>
        <p aria-live="polite">{notice}</p>
      </div>
      <button
        className="radio-toggle"
        aria-label={requested ? "Pause workshop music" : "Play workshop music"}
        onClick={() => {
          enabled.current = !enabled.current;
          setRequested(enabled.current);
          void syncPlayback();
        }}
      >
        {requested ? <Pause size={15} /> : <Play size={15} />}
      </button>
    </section>
  );
}
