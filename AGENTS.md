# AGENTS.md — Base44 dev notes

Non-obvious findings for running this repo in the Base44 sandbox.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind 3.4.
- Backend is a **hosted Supabase** project (Postgres + Auth + RLS) — there is no
  local database. The app cannot function without real Supabase credentials.
- Optional external integrations (only used by specific API routes, degrade
  gracefully with a 500 when unset): Cloudinary (`/api/upload-image`,
  `/api/upload-ktp`) and OCR.space (`/api/ocr-ktp`).

## Required env vars
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required to
  render. The root page `/` and `middleware.ts` both call `supabase.auth.getUser()`
  on every request; with placeholder creds `getUser` returns no user and the app
  redirects to `/login` (the login form renders fine, but login will fail).
- Cloudinary (`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`) and `OCR_SPACE_API_KEY`
  are optional.

## How it boots here
- `docker-compose.base44.yml` runs `node:22` with the repo bind-mounted at `/app`,
  `npm ci` on startup, then `next dev -H 0.0.0.0 -p 3000` (live reload).
- Env precedence: `.env.base44-defaults` (placeholders, committed) is listed first;
  `/run/base44/app.env` (platform secrets) is listed last and always wins. Never
  put user-supplied secrets under compose `environment:` — they'd override the
  dashboard permanently.
- `next.config.mjs` adds `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so
  the preview origin can load dev assets/HMR. `BASE44_PUBLIC_HOST_SUFFIX` is
  passed into the service `environment:`.

## Verifying it works
- `docker compose -f docker-compose.base44.yml ps` then `curl -I localhost:3000/login`.
- With placeholder Supabase creds the preview shows the login page. To actually
  log in and use the dashboard, the user must supply their real Supabase project
  URL + anon key (and the `supabase/schema.sql` must be applied to that project,
  with an admin user created in Supabase Auth).
- The DB schema lives in `supabase/schema.sql` (run it in the Supabase SQL editor
  on the real project — it is idempotent).

## Notes
- All UI/docs are in Bahasa Indonesia; code/commits follow standard conventions.
- PWA: `manifest.json` + `sw.js` are served from `public/`.
