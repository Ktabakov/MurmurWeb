# Murmur Website

Official marketing site for **Murmur** — an iPhone app that uses on-device AI to generate original instrumental music from moods and presets.

**Live site:** [www.murmurapps.site](https://www.murmurapps.site)

---

## What is Murmur?

Murmur is a pocket mood composer. Pick a curated style or describe how you want the music to feel — warm pads, lo-fi piano, cinematic strings — and Murmur generates a short instrumental piece **entirely on your iPhone**. No cloud rendering for the core flow; your prompts and audio stay on the device.

Powered by **Magenta RT** and accelerated on the **Apple Neural Engine**.

---

## What this repository is

This repo is the **public website** for the app (landing page, SEO, previews). It is **not** the iOS app source code.

The site includes:

- Product overview and “Compose your mood” positioning
- How it works (pick a mood → compose on-device → keep what you love)
- **170+ style categories** with tap-to-play audio previews
- Under the hood (Magenta RT, Neural Engine, privacy)
- Murmur Pro highlights
- Coming soon to the App Store

Visual design matches the app’s **Stitch** theme: dark glass UI, lilac glow, waveform bars, and the plasma orb.

---

## Tech stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, static export) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Motion | Framer Motion (hero waveform) |
| Hosting | GitHub Pages via GitHub Actions |
| Domain | `www.murmurapps.site` |

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # outputs static site to out/
npm run lint
```

### Style preview audio

Category samples live in `public/audio/styles/` (e.g. `ambient.mp3`, `focus.mp3`). Source files can be kept in `src/assets/styles/`. After adding or replacing MP3s, copy them into `public/audio/styles/` before deploy.

---

## Deployment (GitHub Pages)

The site **must** deploy with **GitHub Actions**, not “Deploy from a branch / root”. Serving `/` from the repo root only shows this README — not the built site.

1. Push to `main`.
2. **Settings → Pages → Build and deployment**
3. Set **Source** to **GitHub Actions** (not `main` / `/root`).
4. Confirm the workflow **Deploy to GitHub Pages** succeeds under the **Actions** tab.

The workflow runs `npm run build` and publishes the `out/` folder. Custom domain is configured in `public/CNAME`.

---

## Project layout

```
src/
  app/                 # pages, layout, SEO, robots, sitemap
  assets/              # MurmurLogo.webp, style MP3 sources
  components/          # PlasmaOrb, SoundWaveBars, StyleCategoryGrid, …
public/
  audio/styles/        # category preview MP3s (served on the site)
  favicon.ico          # tab icon
  MurmurLogo.webp
  CNAME                # www.murmurapps.site
.github/workflows/
  deploy-pages.yml
```

---

## Site icon

Replace `src/assets/MurmurLogo.webp`, then regenerate favicons:

```bash
sips -s format png -z 32 32 src/assets/MurmurLogo.webp --out public/favicon-32.png
sips -s format png -z 180 180 src/assets/MurmurLogo.webp --out public/apple-icon.png
cp src/assets/MurmurLogo.webp public/MurmurLogo.webp
# Small .ico only (avoid huge multi-size files — browsers may show "M" instead)
python3 -m venv .venv-favicon && .venv-favicon/bin/pip install pillow -q
.venv-favicon/bin/python -c "from PIL import Image; Image.open('public/favicon-32.png').save('public/favicon.ico', format='ICO', sizes=[(32,32)])"
```

Bump `FAVICON_VERSION` in `src/app/layout.tsx` if the browser still shows an old tab icon.

---

## App Store link

When the app is live, search for `Coming soon` in `src/app/page.tsx` and replace those CTAs with the real App Store URL.

---

## Related

The Murmur iOS app is maintained in a separate repository. This project is the web presence for discovery, sharing, and launch.
