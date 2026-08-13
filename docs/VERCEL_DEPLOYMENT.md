# Vercel deployment

This project now uses the native Next.js build. Vercel must run `npm run build`, which executes `next build` and creates the real `.next` output directory. Vinext, Wrangler, Nitro, Cloudflare Workers, and the former `.openai/hosting.json` configuration are no longer part of the deployment.

## 1. Connect the GitHub repository

1. In Vercel, choose **Add New → Project**.
2. Import `Kenil-Sutariya/german-b2`.
3. Keep **Framework Preset** set to **Next.js**.
4. Keep **Build Command** as `npm run build` (or leave the detected default).
5. Do not set a custom output directory. Vercel detects `.next` automatically.
6. Use Node.js 22.x.

## 2. Create and connect Neon PostgreSQL

1. In the Vercel project, open **Storage** or **Marketplace** and create/connect a **Neon Postgres** database.
2. Link it to this project and allow Vercel to add `DATABASE_URL` to Production, Preview, and Development environments.
3. If you already have Neon, copy its pooled PostgreSQL connection string into a Vercel environment variable named `DATABASE_URL`.
4. The connection must use TLS (`sslmode=require`).

The app creates the `roadmap_progress` table on the first authenticated sync. The equivalent SQL is committed at `db/schema.sql` if you prefer to run it manually in the Neon SQL Editor.

## 3. Configure the private password

Choose the private password locally. Never commit it or paste it into a `NEXT_PUBLIC_*` variable.

Generate a bcrypt hash:

```bash
npm install
npm run auth:hash -- "your private password"
```

Copy only the resulting `$2b$...` hash into Vercel:

```text
SITE_PASSWORD_HASH=<the bcrypt hash>
```

Apply it to Production, Preview, and Development as needed. The plaintext password is never stored by the application.

## 4. Configure the session secret

Generate a separate random secret:

```bash
openssl rand -base64 48
```

Add the result to Vercel as:

```text
AUTH_SECRET=<the generated random value>
```

Use at least 32 random characters. Changing `AUTH_SECRET` signs everyone out, because existing cookies can no longer be verified.

## 5. Deploy and verify

After all three variables are present, redeploy the latest `main` commit. Verify:

1. Opening the deployment redirects to `/login` before any learning content is returned.
2. A wrong password remains on the login page.
3. The correct password creates a Secure, HttpOnly, SameSite=Lax session cookie.
4. The header shows **Synced** after the initial cloud request.
5. Complete one task on one device, wait for **Synced**, then open the site on another signed-in device and confirm the same completion appears.
6. Use **Sign out** to confirm protected pages return to the password screen.

## Required Vercel environment variables

| Variable | Secret? | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon/PostgreSQL connection used as the progress source of truth. |
| `SITE_PASSWORD_HASH` | Yes | Server-only bcrypt hash checked by the login endpoint. |
| `AUTH_SECRET` | Yes | Signs the HttpOnly session cookie. |

None of these values belongs in GitHub, client code, localStorage, or a `NEXT_PUBLIC_*` variable. `.env.example` contains placeholders only. Local `.env*` files are ignored by Git.

## Existing browser progress

On the first successful cloud connection, if the database has no progress row, the app uploads the existing v1/v2 browser progress to Neon. This preserves completed tasks, exercise results, mistakes, vocabulary state, confidence, notes, writing drafts, settings, skill data, and notification preferences. Afterward, PostgreSQL is authoritative and localStorage remains an offline cache.

## Troubleshooting

- **Login says private access is not configured:** `SITE_PASSWORD_HASH` or `AUTH_SECRET` is missing/too short.
- **Sync error:** confirm `DATABASE_URL` exists in the deployed environment and the Neon project is active.
- **Build cannot find `.next`:** remove any Vercel custom output-directory setting. The committed build script is `next build`; never create `.next` manually.
- **All devices were signed out:** `AUTH_SECRET` changed. Sign in again with the same private password.
