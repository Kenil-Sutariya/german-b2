# Feature Guide

## Developer map

| Feature                            | Route                                                                                 | Main implementation                                                   | Data/storage                                                                | Important edge cases                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Today and light session            | `/`                                                                                   | `Dashboard` in `components/learning-app.tsx`                          | `completedTasks`, `totalMinutes`, `lastStudyDate`, `streak`, study settings | Same-day work increments the streak once; undo never makes minutes negative.         |
| Roadmap and weeks                  | `/roadmap`, `/week/[weekId]`                                                          | `Roadmap`, `WeekView`; `data/curriculum.ts`                           | `completedTasks`, `dayStatuses`, `currentWeek`                              | Unknown week IDs fall back to the current week; all percentages are clamped.         |
| Grammar                            | `/grammar`, `/grammar/[slug]`                                                         | `GrammarLibrary`, `GrammarDetail`                                     | `confidence`, `exerciseProgress`, `testScores`                              | Empty search has a reset action; unknown slugs fall back safely.                     |
| Exercise engine                    | `/practice/[topicId]`                                                                 | lazy-loaded `PracticeEntry` and `ExercisePlayer`; `data/exercises.ts` | grammar/vocabulary result records and incorrect IDs                         | Empty mistake sets and empty difficulty sets show explanatory disabled/empty states. |
| Vocabulary                         | `/vocabulary`                                                                         | `Vocabulary`, `ExercisePlayer`                                        | `difficultWords`, `settings.showEnglish`, `vocabularyProgress`              | English visibility and difficult-word state persist across reloads.                  |
| Reading/listening/writing/speaking | `/practice/reading`, `/practice/listening`, `/practice/writing`, `/practice/speaking` | skill workspaces in `components/practice.tsx`                         | writing drafts persist; other skill state is session-local                  | Speech synthesis is capability-checked; no audio is recorded or uploaded.            |
| Progress and recommendations       | `/progress` and dashboard cards                                                       | `Progress`; `lib/recommendations.ts`                                  | completed tasks, scores, attempts, confidence, streak, minutes              | Quiz scores are planning signals, never presented as certification.                  |
| Notes                              | `/notes`                                                                              | `Notes`                                                               | `notes`                                                                     | Empty title cannot save; delete requires confirmation.                               |
| Notifications                      | global bell, `/settings`                                                              | `NotificationCenter`, `SettingsView`                                  | notifications and notification settings                                     | Permission is only requested after a click; closed-browser delivery is not promised. |
| Onboarding and help                | first visit, `/help`                                                                  | `Onboarding`; `components/help-center.tsx`                            | `onboardingComplete`                                                        | Five-screen maximum, keyboard-contained dialogs, reopen from Settings.               |
| Backup and migration               | `/settings`                                                                           | `lib/storage.ts`, `SettingsView`                                      | v2 key plus v1 migration                                                    | Corrupt/unsupported imports are rejected without overwriting current progress.       |
| PWA                                | global                                                                                | `public/manifest.webmanifest`, `public/sw.js`, layout metadata        | browser Cache Storage for navigation shell                                  | Static modules use normal HTTP caching to avoid Firefox/WebKit import failures.      |

## Learning workflow

- **Today:** current-week summary, completion toggles, light-session mode, streak and a recommendation driven by confidence and quiz history.
- **Roadmap:** 30 weeks from B1 revision to B2 exam preparation. Open a week, complete its tasks, and mark each day done, partial, skipped, moved, or repeat.
- **Grammar:** 43 searchable topics with confidence labels, explanations, examples, Quick Practice, Full Practice, and Review Mistakes.
- **Vocabulary:** 12 categories with themed word lists, difficult-word marking, and category practice.
- **Skills:** reading texts with comprehension questions, synthetic browser speech for listening, locally saved writing drafts, and timed speaking prompts.
- **Progress:** stored quiz attempts, best/latest scores, review needs, completed work, study minutes, and confidence.
- **Notes:** create, search, edit, and delete personal notes.

## Practice and review

Every grammar topic has eight questions across multiple exercise types and difficulty levels. Each submitted answer shows whether it is correct, the correct answer, an explanation, and the relevant rule. Incorrect question IDs are saved and power Review Mistakes. Results below 60% feed the Needs Review recommendation.

Every vocabulary category has six questions. The practice hub also links to four-question reading tasks, synthetic listening, checklist-guided writing, and speaking workspaces.

## Guidance and settings

- First-run onboarding introduces the main workflow and can be reopened from Settings.
- The searchable Help Center documents 30 features and includes contextual guidance.
- Empty states explain why a feature has no content and what to do next.
- Settings control daily target, study days, English explanations, Sunday mode, in-app reminders, browser notification permission, export/import, and reset.

## Data, notifications, and PWA

Progress is browser-local under schema version 2. Existing version-1 data is migrated without deleting completed work. JSON export/import provides a portable backup.

The notification bell supports unread status, marking read, and clearing items. Browser notifications require explicit permission. The manifest and service worker provide an installable PWA foundation and navigation fallback; there is no push backend, so notifications are not guaranteed when the browser and site are completely closed.
