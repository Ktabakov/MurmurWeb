# Murmur Website

Marketing site for [Murmur](https://murmurapps.com) — the iOS app for on-device AI instrumental music.

Live: **https://murmurapps.com**  
App Store: [Murmur: On-Device AI Music](https://apps.apple.com/de/app/murmur-on-device-ai-music/id6776807467?l=en-GB)

This repo is the website only. The iOS app lives elsewhere.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # static export → out/
npm run lint
```

## Deploy

Pushes to `main` build and deploy via GitHub Actions (`.github/workflows/deploy-pages.yml`).

In **Settings → Pages**, set the source to **GitHub Actions** — not “Deploy from branch”. If you point Pages at the repo root you’ll just get this README, not the site.

Custom domain is in `public/CNAME` (`murmurapps.com`).

## Stack

Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind v4, Framer Motion.

## Layout

```
src/app/           pages (home, privacy), layout, sitemap, robots
src/components/    SoundWaveBars, PlasmaOrb, StyleCategoryGrid, …
public/            CNAME, favicons, audio previews (public/audio/styles/)
.github/workflows/ deploy-pages.yml
```

Style preview MP3s go in `public/audio/styles/`. Source copies can live in `src/assets/styles/`.

App Store links use `APP_STORE_URL` in `src/app/page.tsx`.

## Favicons

Icons are in `public/`. After updating `src/assets/MurmurLogo.webp`:

```bash
sips -s format png -z 48 48 src/assets/MurmurLogo.webp --out public/favicon-48.png
sips -s format png -z 96 96 src/assets/MurmurLogo.webp --out public/favicon-96.png
sips -s format png -z 192 192 src/assets/MurmurLogo.webp --out public/icon-192.png
sips -s format png -z 180 180 src/assets/MurmurLogo.webp --out public/apple-icon.png
cp src/assets/MurmurLogo.webp public/MurmurLogo.webp
```

Keep `public/favicon.ico` small. Google wants at least a 48×48 favicon — `favicon-48.png` is listed first in metadata.
