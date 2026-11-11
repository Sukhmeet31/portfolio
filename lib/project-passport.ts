import { useSyncExternalStore } from "react";
import { projects } from "./content";

const storageKey = "workshop-passport-v1";
const changeEvent = "workshop-passport-change";
let memory = "[]";
let storageUnavailable = false;

function readStamps(raw: string): string[] {
  try {
    const values: unknown = JSON.parse(raw);
    if (!Array.isArray(values)) return [];
    return projects.filter((project) => values.includes(project.slug)).map((project) => project.slug);
  } catch {
    return [];
  }
}

function snapshot() {
  if (!storageUnavailable) {
    try {
      memory = localStorage.getItem(storageKey) ?? "[]";
    } catch {
      storageUnavailable = true;
    }
  }
  return memory;
}

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) notify();
  };
  window.addEventListener(changeEvent, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function stampProject(slug: string) {
  if (!projects.some((project) => project.slug === slug)) return;
  const stamps = readStamps(snapshot());
  if (stamps.includes(slug)) return;
  memory = JSON.stringify([...stamps, slug]);
  try {
    if (!storageUnavailable) localStorage.setItem(storageKey, memory);
  } catch {
    storageUnavailable = true;
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useProjectPassport() {
  return readStamps(useSyncExternalStore(subscribe, snapshot, () => "[]"));
}
