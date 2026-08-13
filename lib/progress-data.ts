import type { AppNotification, ProgressState } from "@/types/learning";

const initialNotifications: AppNotification[] = [
  { id: "daily-study", category: "Study", title: "Zeit für Deutsch 🇩🇪", body: "Heute sind bis zu 55 Minuten geplant.", timestamp: "2026-08-13T07:30:00.000Z", read: false },
  { id: "light-session", category: "Study", title: "Wenig Zeit?", body: "Deine 20-Minuten-Einheit ist noch offen.", timestamp: "2026-08-13T12:00:00.000Z", read: false },
  { id: "unfinished-week", category: "Study", title: "Offene Wochenaufgaben", body: "Du hast noch Aufgaben aus dieser Woche offen.", timestamp: "2026-08-13T15:00:00.000Z", read: false },
  { id: "welcome-review", category: "Review", title: "Relativsätze wiederholen", body: "Deine Markierung „Unsicher“ bringt dieses Thema zurück in den Fokus.", timestamp: "2026-08-13T08:00:00.000Z", read: false },
  { id: "weekly-review", category: "Study", title: "Wochenreview", body: "Nimm dir heute 15 Minuten für schwierige Themen.", timestamp: "2026-08-12T17:00:00.000Z", read: false },
  { id: "b1-milestone", category: "Milestone", title: "B1 Core Refreshed 🎯", body: "Ein wichtiger Roadmap-Abschnitt ist geschafft. Nutze den nächsten Checkpoint zur Festigung.", timestamp: "2026-08-12T12:00:00.000Z", read: true },
  { id: "privacy-note", category: "System", title: "Deine Daten bleiben privat", body: "Dein Fortschritt wird verschlüsselt übertragen und in deiner privaten Cloud-Datenbank gespeichert.", timestamp: "2026-08-11T10:00:00.000Z", read: true },
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
  skillProgress: {},
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

export function isSupportedProgress(input: unknown): input is LegacyProgress {
  return Boolean(
    input &&
      typeof input === "object" &&
      [1, 2].includes(Number((input as { version?: unknown }).version)),
  );
}

export function migrateProgress(input: unknown): ProgressState {
  if (!input || typeof input !== "object")
    return structuredClone(defaultProgress);
  const old = input as LegacyProgress;
  const settings = old.settings ?? {};
  const notificationSettings = settings.notifications ?? {};
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
    skillProgress:
      old.skillProgress && typeof old.skillProgress === "object"
        ? old.skillProgress
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
        ...notificationSettings,
      },
    },
  };
}
