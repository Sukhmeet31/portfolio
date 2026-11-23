import { useMemo, useSyncExternalStore } from "react";
import { readAdventure, type AdventureSave } from "./adventure";

const key = "workshop-adventures-v1";
const changed = "workshop-adventures-change";
let memory = "{}";
let unavailable = false;

function snapshot() {
  if (!unavailable) {
    try { memory = localStorage.getItem(key) ?? "{}"; }
    catch { unavailable = true; }
  }
  return memory;
}

function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) notify();
  };
  window.addEventListener("storage", storage);
  window.addEventListener(changed, notify);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener(changed, notify);
  };
}

export function updateAdventure(update: (save: AdventureSave) => AdventureSave) {
  const current = readAdventure(snapshot());
  const next = update(current);
  if (next === current) return;
  memory = JSON.stringify(next);
  try { if (!unavailable) localStorage.setItem(key, memory); }
  catch { unavailable = true; }
  window.dispatchEvent(new Event(changed));
}

export function useAdventure() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "{}");
  return useMemo(() => readAdventure(raw), [raw]);
}
