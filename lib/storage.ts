"use client";
import type { AppNotification, ProgressState } from "@/types/learning";

const KEY = "kenil-german-roadmap:v2";
const LEGACY_KEY = "kenil-german-roadmap:v1";

const initialNotifications: AppNotification[] = [
  {
    id: "daily-study",
    category: "Study",
    title: "Zeit für Deutsch 🇩🇪",
    body: "Heute sind bis zu 55 Minuten geplant.",
    timestamp: "2026-08-13T07:30:00.000Z",
    read: false,
  },
  {
    id: "light-session",
    category: "Study",
    title: "Wenig Zeit?",
    body: "Deine 20-Minuten-Einheit ist noch offen.",
    timestamp: "2026-08-13T12:00:00.000Z",
    read: false,
  },
  {
    id: "unfinished-week",
    category: "Study",
    title: "Offene Wochenaufgaben",
    body: "Du hast noch Aufgaben aus dieser Woche offen.",
    timestamp: "2026-08-13T15:00:00.000Z",
    read: false,
  },
  {
    id: "welcome-review",
    category: "Review",
    title: "Relativsätze wiederholen",
    body: "Deine Markierung „Unsicher“ bringt dieses Thema zurück in den Fokus.",
    timestamp: "2026-08-13T08:00:00.000Z",
    read: false,
  },
  {
    id: "weekly-review",
    category: "Study",
    title: "Wochenreview",
    body: "Nimm dir heute 15 Minuten für schwierige Themen.",
    timestamp: "2026-08-12T17:00:00.000Z",
    read: false,
  },
  {
    id: "b1-milestone",
    category: "Milestone",
    title: "B1 Core Refreshed 🎯",
    body: "Ein wichtiger Roadmap-Abschnitt ist geschafft. Nutze den nächsten Checkpoint zur Festigung.",
    timestamp: "2026-08-12T12:00:00.000Z",
    read: true,
  },
  {
    id: "privacy-note",
    category: "System",
    title: "Deine Daten bleiben lokal",
    body: "Fortschritt, Entwürfe und Erinnerungen werden nur in diesem Browser gespeichert.",
    timestamp: "2026-08-11T10:00:00.000Z",
    read: true,
  },
];

export const defaultProgress: ProgressState = {
  version: 2,
  completedTasks: [],
  dayStatuses: {},
  confidence: {
    "wortstellung-hauptsatz": "okay",
    adjektivdeklination: "unsicher",
    "relativ-mit-praeposition": "unsicher",
  },
  difficultWords: [],
  testScores: { "b1-diagnostic": 72 },
  exerciseProgress: {},
  vocabularyProgress: {},
  notes: [],
  writingDrafts: {},
  currentWeek: 7,
  streak: 4,
  lastStudyDate: "",
  totalMinutes: 385,
  onboardingComplete: false,
  notifications: initialNotifications,
  settings: {
    dailyTarget: 55,
    studyDays: 6,
    showEnglish: true,
    sundayMode: "catch-up",
    notifications: {
      enabled: true,
      dailyReminder: false,
      reminderTime: "18:30",
      weeklyReview: true,
      weeklyReviewDay: 6,
      reviewReminders: true,
      milestoneNotifications: true,
      browserNotifications: false,
    },
  },
};

type LegacyProgress = Partial<Omit<ProgressState, "version" | "settings">> & {
  version?: number;
  settings?: Partial<ProgressState["settings"]>;
};

function migrate(input: unknown): ProgressState {
  if (!input || typeof input !== "object")
    return structuredClone(defaultProgress);
  const old = input as LegacyProgress;
  const settings = old.settings ?? {};
  const notifications = settings.notifications ?? {};
  return {
    ...structuredClone(defaultProgress),
    ...old,
    version: 2,
    completedTasks: Array.isArray(old.completedTasks) ? old.completedTasks : [],
    dayStatuses:
      old.dayStatuses && typeof old.dayStatuses === "object"
        ? old.dayStatuses
        : {},
    confidence:
      old.confidence && typeof old.confidence === "object"
        ? old.confidence
        : defaultProgress.confidence,
    difficultWords: Array.isArray(old.difficultWords) ? old.difficultWords : [],
    testScores:
      old.testScores && typeof old.testScores === "object"
        ? old.testScores
        : defaultProgress.testScores,
    exerciseProgress:
      old.exerciseProgress && typeof old.exerciseProgress === "object"
        ? old.exerciseProgress
        : {},
    vocabularyProgress:
      old.vocabularyProgress && typeof old.vocabularyProgress === "object"
        ? old.vocabularyProgress
        : {},
    notes: Array.isArray(old.notes) ? old.notes : [],
    writingDrafts:
      old.writingDrafts && typeof old.writingDrafts === "object"
        ? old.writingDrafts
        : {},
    notifications: Array.isArray(old.notifications)
      ? old.notifications
      : initialNotifications,
    settings: {
      ...defaultProgress.settings,
      ...settings,
      notifications: {
        ...defaultProgress.settings.notifications,
        ...notifications,
      },
    },
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return structuredClone(defaultProgress);
    const migrated = migrate(JSON.parse(raw));
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return structuredClone(defaultProgress);
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state));
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
        const parsed = JSON.parse(String(reader.result));
        if (
          !parsed ||
          typeof parsed !== "object" ||
          ![1, 2].includes(parsed.version)
        )
          throw new Error("invalid");
        resolve(migrate(parsed));
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
