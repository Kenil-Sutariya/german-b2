# Kenil's German Roadmap

A focused personal learning dashboard for revising German B1 and progressing systematically to B2 in under one hour per day.

The project includes a complete 30-week roadmap, six study days per week, grammar and vocabulary libraries, official resource links, four-skill tracking, exam checkpoints, notes, recommendations, private password access, and cross-device progress through private Vercel Blob storage.

## Highlights

- 30 fully seeded weeks: B1 revision, B1+ bridge, B2 expansion, real-life German, four-skill training, and checkpoints
- Daily study plans capped at 55 minutes, plus an automatically shortened 30-minute setting
- 43 concise grammar topics with 344 questions, confidence ratings, Quick/Full practice, and mistake review
- 12 practical vocabulary themes with 72 questions, articles, patterns, meanings, and natural examples
- Original reading, synthetic listening, guided writing, and timed speaking practice
- First-run onboarding, searchable Help Center, contextual help, and useful empty states
- In-app notifications, browser permission handling, and installable PWA foundation
- Preferred official resources from Klett/Netzwerk and Hueber, plus Goethe exam materials
- Private Vercel Blob synchronization with a browser cache for offline fallback
- Server-validated password access with a signed, HttpOnly session cookie
- JSON export/import and confirmed reset
- Responsive desktop sidebar and mobile bottom navigation
- Vercel-ready Next.js App Router structure

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env.local
# Replace every placeholder in .env.local.
npm run dev
```

Generate the password hash with `npm run auth:hash -- "your private password"`; generate `AUTH_SECRET` with `openssl rand -base64 48`; and connect a private Vercel Blob store. Vercel supplies `BLOB_READ_WRITE_TOKEN` automatically. Open the local address printed by the development server. See the Vercel guide below for the full setup.

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
- `/notes` — personal synchronized notes
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

Private Vercel Blob storage is the source of truth. `lib/progress-store.ts` persists the complete versioned progress state through the authenticated `/api/progress` route, while `lib/storage.ts` maintains the browser key `kenil-german-roadmap:v2` as an offline cache. Existing v1/v2 browser data is migrated automatically when the Vercel store is empty. JSON export/import remains available in Settings.

The UI reports `Synced`, `Syncing…`, `Offline — saved on this device`, or `Sync error`. Changes made offline remain in the local cache and are uploaded after connectivity returns.

## Deploy to Vercel

This is a native Next.js deployment: `npm run build` runs `next build` and creates the real `.next` output. Follow [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) to create a private Blob store and configure `SITE_PASSWORD_HASH` and `AUTH_SECRET`. Do not configure a custom Vercel output directory.

## Product decisions

- English is used for concise guidance; German terminology and examples remain prominent.
- Recommendations are deterministic and transparent, based on confidence, low scores, missed work and skill balance.
- The curriculum links to official materials but does not reproduce textbook pages or answer keys.
- B2 readiness is shown across skills instead of inferred from checked grammar cards alone.

## Current boundaries

Browser notifications require explicit permission and platform support. Without a push backend they are not guaranteed when the browser and site are completely closed. Speaking practice uses a local timer and synchronizes only the self-rating; it deliberately does not record or upload audio. Dark mode and printable weeks are not included.
