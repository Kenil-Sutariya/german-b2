"use client";

import type { ProgressState } from "@/types/learning";
import {
  defaultProgress,
  isSupportedProgress,
  migrateProgress,
} from "@/lib/progress-data";

export { defaultProgress } from "@/lib/progress-data";

export const PROGRESS_KEY = "kenil-german-roadmap:v2";
const PENDING_SYNC_KEY = "kenil-german-roadmap:pending-sync";
const LEGACY_KEY = "kenil-german-roadmap:v1";

export function hasStoredProgress() {
  return Boolean(
    localStorage.getItem(PROGRESS_KEY) ?? localStorage.getItem(LEGACY_KEY),
  );
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return structuredClone(defaultProgress);
    const migrated = migrateProgress(JSON.parse(raw));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return structuredClone(defaultProgress);
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function hasPendingSync() {
  return localStorage.getItem(PENDING_SYNC_KEY) === "1";
}

export function markPendingSync() {
  localStorage.setItem(PENDING_SYNC_KEY, "1");
}

export function clearPendingSync() {
  localStorage.removeItem(PENDING_SYNC_KEY);
}

export function exportProgress(state: ProgressState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "kenil-german-progress.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importProgress(file: File): Promise<ProgressState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result));
        if (!isSupportedProgress(parsed)) throw new Error("invalid");
        resolve(migrateProgress(parsed));
      } catch {
        reject(
          new Error(
            "Diese Datei enthält keine gültigen Roadmap-Fortschrittsdaten.",
          ),
        );
      }
    };
    reader.onerror = () =>
      reject(new Error("Die Datei konnte nicht gelesen werden."));
    reader.readAsText(file);
  });
}
