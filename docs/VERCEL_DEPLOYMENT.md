# Vercel deployment

This project uses a native Next.js build and Vercel's own private Blob storage. It does not require Neon, Supabase, PostgreSQL, Cloudflare, or any other third-party database account.

Vercel discontinued its first-party Postgres product. Private Blob storage is a good fit here because this is a single-user app whose synchronized state is one small JSON document. The private object cannot be read without the Vercel store token, and the browser can access it only through the app's authenticated API.

## 1. Import the repository

1. In Vercel, choose **Add New → Project**.
2. Import `Kenil-Sutariya/german-b2`.
3. Keep **Framework Preset** set to **Next.js**.
4. Keep **Build Command** as `npm run build`, or leave the detected default.
5. Leave **Output Directory** empty. Vercel detects the real `.next` output automatically.
6. Select Node.js 22.x.

The first deployment can be completed before storage and secrets are configured. It will show the password page, but login and synchronization will not work until the following steps are complete.

## 2. Create private Vercel storage

1. Open the Vercel project.
2. Open **Storage**.
3. Select **Create Database**, then select **Blob**.
4. Select **Continue**.
5. Set access to **Private**. Do not create a public store.
6. Name it `german-roadmap-progress`.
7. Create the store and connect it to this project.
8. Enable it for **Production**. Enable **Preview** too only if preview deployments should share a store.

Vercel automatically adds this server-only environment variable:

```text
BLOB_READ_WRITE_TOKEN
```

Do not copy that token into source code. The app writes one private object at `roadmap/kenil-progress.json`; there is no schema or SQL migration to run.

## 3. Generate the private site password hash

Choose the password that you will type on the site's Unlock page. Generate its bcrypt hash locally without committing the plaintext password:

```bash
cd "/path/to/german-b2"
read -s "SITE_PASS?Enter your website password: "; echo
npm run auth:hash -- "$SITE_PASS"
unset SITE_PASS
```

Copy the complete output beginning with `$2b$12$`. In Vercel, open **Project → Settings → Environment Variables** and add it as a Sensitive value:

```text
SITE_PASSWORD_HASH=<the complete bcrypt hash>
```

The original password is what you type into the website. The hash is never used as the login password and must not be stored in GitHub, client code, localStorage, or a `NEXT_PUBLIC_*` variable.

## 4. Generate the session secret

Generate a separate random signing secret:

```bash
openssl rand -base64 48
```

Add it to Vercel as another Sensitive environment variable:

```text
AUTH_SECRET=<the generated random value>
```

Use the same values for Production and, if required, Preview. Changing `AUTH_SECRET` signs every device out because existing session cookies can no longer be verified.

## 5. Required Vercel configuration

| Variable | How it is created | Purpose |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Added automatically by the connected private Blob store | Server-only access to synchronized progress. |
| `SITE_PASSWORD_HASH` | Generate locally with `npm run auth:hash` | Server-only bcrypt verification of the site password. |
| `AUTH_SECRET` | Generate locally with `openssl rand -base64 48` | Signs the Secure, HttpOnly session cookie. |

All three values are secrets. None should use the `NEXT_PUBLIC_` prefix.

## 6. Redeploy and verify

Environment-variable changes apply only to new deployments. Open **Deployments**, use the three-dot menu on the latest deployment, and choose **Redeploy**.

Verify the production site:

1. Opening any learning URL redirects to `/login`.
2. A wrong password is rejected.
3. The original password unlocks the site.
4. The header changes to **Synced**.
5. Complete a task and wait for **Synced** again.
6. Sign in from another device and confirm the same task is complete.
7. Use **Sign out** and confirm protected pages return to the password screen.

## Existing browser progress

If private Vercel storage is empty, the first authenticated browser uploads its existing v1/v2 local progress automatically. This preserves tasks, attempts, scores, Review Mistakes, vocabulary state, confidence, notes, writing drafts, settings, skill progress, and notification preferences. Vercel storage is authoritative afterward, while localStorage remains the offline cache.

## Troubleshooting

- **Private access is not configured:** confirm both `SITE_PASSWORD_HASH` and `AUTH_SECRET` exist in the deployment environment, then redeploy.
- **Sync error:** confirm the Blob store is Private, connected to this exact project, and supplied `BLOB_READ_WRITE_TOKEN` to the deployment environment.
- **Build cannot find `.next`:** remove any custom Vercel output-directory setting. The build script is `next build`; never create `.next` manually.
- **All devices were signed out:** `AUTH_SECRET` changed. Sign in again with the original site password.
- **Forgotten site password:** generate a new bcrypt hash, replace `SITE_PASSWORD_HASH`, and redeploy.
