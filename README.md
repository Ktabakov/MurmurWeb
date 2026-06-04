# Murmur — Marketing Website

Landing site for **[Murmur](https://www.murmurapps.site)** — a private, on-device AI music generator for iPhone.

**Compose your mood.** Murmur turns presets or your own words into original instrumental loops and soundscapes, generated entirely on your phone with no cloud rendering.

Live site: [www.murmurapps.site](https://www.murmurapps.site)

## About the site

This repo is the public marketing website (not the iOS app). It covers:

- On-device AI music generation and privacy
- How it works: pick a mood → compose on-device → keep what you love
- 170+ curated style presets and custom mood prompts
- **Under the hood:** Magenta RT, Apple Neural Engine, fully on-device
- Murmur Pro features
- Coming soon to the App Store (no account/login flow on the site)

Design follows the app’s **Stitch** theme: dark glassy UI, lilac/purple glow, waveform motif, and the plasma orb on the “describe your mood” section.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (animated waveform bars)
- Deployed via **GitHub Pages** (GitHub Actions)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # static export → out/
npm run lint
```

## Project structure

```
src/
  app/              # pages, layout, SEO (robots, sitemap), icons
  assets/           # source MurmurLogo.webp
  components/       # PlasmaOrb, SoundWaveBars, MurmurMark, etc.
public/
  MurmurLogo.webp   # logo copy for static hosting / OG
  CNAME             # www.murmurapps.site
.github/workflows/
  deploy-pages.yml  # build + deploy to GitHub Pages
```

## Deployment (GitHub Pages)

1. Push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (not “Deploy from branch / root”).
3. The workflow builds a static site (`output: "export"`) and publishes the `out/` folder.

Custom domain: `www.murmurapps.site` (see `public/CNAME`).

## Updating the site icon

Replace `src/assets/MurmurLogo.webp`, then regenerate PNG icons:

```bash
sips -s format png -z 512 512 src/assets/MurmurLogo.webp --out src/app/icon.png
sips -s format png -z 180 180 src/assets/MurmurLogo.webp --out src/app/apple-icon.png
cp src/assets/MurmurLogo.webp public/MurmurLogo.webp
```

## When the App Store listing is live

Search for `Coming soon` in `src/app/page.tsx` and swap the non-link CTAs for your real App Store URL.

## Related

The Murmur iOS app is a separate codebase. This website is the public face for discovery, SEO, and launch.
