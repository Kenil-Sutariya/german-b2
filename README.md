# Kenil's German Roadmap

A focused personal learning dashboard for revising German B1 and progressing systematically to B2 in under one hour per day.

The project includes a complete 30-week roadmap, six study days per week, grammar and vocabulary libraries, official resource links, four-skill tracking, exam checkpoints, notes, recommendations, and device-local progress. No account, database, paid API, or AI service is required.

## Highlights

- 30 fully seeded weeks: B1 revision, B1+ bridge, B2 expansion, real-life German, four-skill training, and checkpoints
- Daily study plans capped at 55 minutes, plus an automatically shortened 30-minute setting
- 43 concise grammar topics with 344 questions, confidence ratings, Quick/Full practice, and mistake review
- 12 practical vocabulary themes with 72 questions, articles, patterns, meanings, and natural examples
- Original reading, synthetic listening, guided writing, and timed speaking practice
- First-run onboarding, searchable Help Center, contextual help, and useful empty states
- In-app notifications, browser permission handling, and installable PWA foundation
- Preferred official resources from Klett/Netzwerk and Hueber, plus Goethe exam materials
- Device-local completion, confidence, difficult words, scores, settings, and notes
- JSON export/import and confirmed reset
- Responsive desktop sidebar and mobile bottom navigation
- Vercel-ready Next.js App Router structure

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by the development server.

For a production check:

```bash
npm run typecheck
npm run lint
npm run validate:content
npm run test:e2e
npm run build
```

## Main routes

- `/` — Today dashboard
- `/roadmap` — complete 30-week learning path
- `/week/[weekId]` — daily weekly plan, tasks, status and resources
- `/grammar` and `/grammar/[slug]` — grammar library and focused lessons
- `/vocabulary` — themed vocabulary and Redemittel
- `/practice` and `/practice/[topicId]` — grammar, vocabulary, and four-skill practice
- `/skills` — Lesen, Hören, Schreiben and Sprechen
- `/resources` — official resource library
- `/exam` — B1/B2 checkpoint and exam practice
- `/progress` — learning metrics and confidence overview
- `/notes` — personal device-local notes
- `/settings` — study rhythm, export/import and reset
- `/help` — complete feature, progress, privacy, notification, and PWA guidance

## Content and data

Core curriculum content lives in `data/curriculum.ts`; exercise banks live in `data/exercises.ts`. Shared TypeScript models live in `types/learning.ts`. Run `npm run validate:content` after content changes.

### Add a week

Add one item to `weekSeeds` in `data/curriculum.ts`. The standard six-day rhythm and daily tasks are generated consistently, keeping each study day below 60 minutes. For a custom daily plan, extend the generated `RoadmapWeek` entry after creation.

### Add a grammar topic

Add a tuple to `grammarSeeds` with a unique URL-safe slug, title, level, category, and concise explanation. Then add its topic-specific seed in `data/exercises.ts`; validation requires at least eight questions and three exercise types.

### Add a resource

Add a typed object to the exported `resources` array. Keep links official and set `access` to either `free` or `book-or-license`. Topic-to-resource mappings use resource IDs.

### Add vocabulary

Add a theme to `vocabularyThemes`. For nouns, include article and useful plural. For verbs, include the preposition and case when relevant.

## Progress storage

`lib/storage.ts` is the versioned device-local storage abstraction. The current browser key is `kenil-german-roadmap:v2`; valid v1 state is migrated automatically. Progress survives refreshes on the same browser and can be moved with the JSON export/import tools in Settings.

This is intentionally local-only for the MVP, as specified in the product brief. Clearing browser storage removes progress unless an export exists.

## Deploy to Vercel

1. Create a GitHub repository without changing the existing local Git identity.
2. Push this project to the repository.
3. In Vercel, choose **Add New → Project** and import that repository.
4. Keep the detected framework and build command (`npm run build`).
5. Deploy. No environment variables or external services are required.

Because all learner data is device-local, each browser starts with its own progress. Use export/import to transfer it.

## Product decisions

- English is used for concise guidance; German terminology and examples remain prominent.
- Recommendations are deterministic and transparent, based on confidence, low scores, missed work and skill balance.
- The curriculum links to official materials but does not reproduce textbook pages or answer keys.
- B2 readiness is shown across skills instead of inferred from checked grammar cards alone.

## Current boundaries

Browser notifications require explicit permission and platform support. Without a push backend they are not guaranteed when the browser and site are completely closed. Speaking practice uses a local timer and self-rating; it deliberately does not record or upload audio. Dark mode and printable weeks are not included.
