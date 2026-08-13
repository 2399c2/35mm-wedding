# 35mm Wedding — Guest Camera (Phase 1)

Guest disposable-camera experience for Dhani & Firda's wedding.

## What phase 1 is

This is a fully working Next.js app: camera (rear-default, flip to selfie),
a personal 15-frame roll with delete/restore, a locked/revealed gallery,
and a simple admin panel.

**Important limitation:** phase 1 stores everything in the browser's
`localStorage`. That means each guest's photos, and the admin's lock/reveal
setting, only exist on *that one device*. It is not yet shared across
guests. That real, cross-device sharing is exactly what Supabase (phase 2)
will add — the app is already structured so that swap is contained to
`lib/localStore.ts`.

## Deploying (Vercel, not GitHub Pages)

Next.js needs a real server, so GitHub Pages can't host it. Use Vercel instead:

1. Push this project to your GitHub repo (replace everything currently there).
2. Go to vercel.com, sign in with your GitHub account.
3. Click "Add New… → Project", select this repo.
4. Leave the default settings (Vercel auto-detects Next.js) and click Deploy.
5. You'll get a live URL like `35mm-wedding.vercel.app` within about a minute.

Every time you push to GitHub after this, Vercel redeploys automatically.

## Pages

- `/` — guest name entry
- `/preset` — film roll choice
- `/camera` — take photos (rear camera by default, tap the corner icon to flip)
- `/roll` — the guest's own 15-frame roll, with delete
- `/gallery` — "Foto Kamu" (always visible) / "Semua Foto" (locked until reveal)
- `/admin` — frame limit, lock/reveal, scheduled reveal, view/delete/recover
  photos (not password-protected yet — phase 2 adds that via Supabase Auth)
