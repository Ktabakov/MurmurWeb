import Link from "next/link";
import { SoundWaveBars } from "@/components/sound-wave-bars";
import { PlasmaOrb } from "@/components/plasma-orb";
import { MurmurMark } from "@/components/murmur-mark";
import { StyleCategoryGrid } from "@/components/style-category-grid";

const SITE_URL = "https://www.murmurapps.site";

// Structured data for richer search results (SoftwareApplication / music).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Murmur",
  applicationCategory: "MusicApplication",
  operatingSystem: "iOS",
  url: SITE_URL,
  description:
    "Private, on-device AI music generation for iPhone. Turn presets or your own words into original AI-generated instrumental music, composed entirely on-device with no cloud rendering. Powered by Magenta RT and accelerated by the Apple Neural Engine.",
  featureList: [
    "On-device AI music generation",
    "170+ curated instrumental presets",
    "Custom mood prompts via MusicCoCa style tokens",
    "Private — no cloud rendering",
    "Save, replay, and share generated audio",
  ],
  keywords:
    "AI generated music, AI music generation, on-device AI music, private music generation, instrumental music generator, Magenta RT, Apple Neural Engine",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const techStrip = [
  {
    label: "Powered by Magenta RT",
    detail: "Google's real-time music generation model, running locally.",
  },
  {
    label: "Boosted by the Apple Neural Engine",
    detail: "Core ML acceleration on the iPhone's ANE chip.",
  },
  {
    label: "100% on-device & private",
    detail: "Your prompts and audio never leave your phone.",
  },
];

const steps = [
  {
    step: "01",
    title: "Pick a mood",
    description:
      "Choose a curated preset or describe a feeling in your own words — a genre, an instrument, a texture, a tempo.",
    accent: "#c59aff",
  },
  {
    step: "02",
    title: "Compose on-device",
    description:
      "Murmur turns your words into musical style tokens and generates an original instrumental piece directly on your phone.",
    accent: "#a78bff",
  },
  {
    step: "03",
    title: "Keep what you love",
    description:
      "Play, save to your Library, turn a prompt into a reusable preset, then replay, share, or trim and fade.",
    accent: "#8b6eff",
  },
];

const categories = [
  { label: "Ambient", color: "#c59aff", sample: "/audio/styles/ambient.mp3" },
  { label: "Focus", color: "#00e5ff", sample: "/audio/styles/focus.mp3" },
  { label: "Sleep", color: "#4a90e2", sample: "/audio/styles/sleep.mp3" },
  { label: "Cinematic", color: "#ffb74d", sample: "/audio/styles/cinematic.mp3" },
  { label: "Jazz & Soul", color: "#ff8a65", sample: "/audio/styles/jazz.mp3" },
  { label: "Electronic", color: "#e040fb", sample: "/audio/styles/electronic.mp3" },
  { label: "Acoustic", color: "#aed581", sample: "/audio/styles/acoustic.mp3" },
  { label: "World", color: "#4db6ac", sample: "/audio/styles/world.mp3" },
];

const examplePrompts = [
  "warm dreamy synth pads with a slow pulse",
  "lo-fi piano with soft vinyl crackle, no drums",
  "spacious cinematic strings, slow and hopeful",
  "gentle acoustic guitar fingerpicking for focus",
];

const features = [
  {
    title: "170+ curated styles",
    description:
      "From Ambient and Lo-fi to Synthwave, Jazz, and Acoustic Guitar — each preset is tuned with its own sound recipe.",
  },
  {
    title: "Describe any mood",
    description:
      "Type a feeling, genre, or sonic texture. Murmur translates your description into musical style tokens.",
  },
  {
    title: "Private by design",
    description:
      "The core generation flow runs entirely on your iPhone using the Apple Neural Engine. No cloud rendering.",
  },
  {
    title: "Your songs, replayable",
    description:
      "Saved pieces become WAVs in your Library — rename, share, and pick up playback from the Lock Screen.",
  },
];

const proPerks = [
  "All 170+ presets",
  "Custom mood prompts",
  "Unlimited generation length",
  "Edit, trim & fade",
  "Advanced controls (CFG, temperature, top-K)",
  "Model choice: Base or Large",
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-murmur-base text-murmur-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(34,16,60,0.85),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(139,110,255,0.08),transparent_34%)]" />

      <nav className="fixed inset-x-0 top-0 z-50 bg-[linear-gradient(to_bottom,rgba(10,7,18,0.88)_0%,rgba(10,7,18,0)_100%)]">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <MurmurMark size={32} />
            <span className="text-base font-black tracking-[0.22em] text-lilac drop-shadow-[0_0_12px_rgba(197,154,255,0.35)] sm:text-2xl sm:tracking-[0.3em]">
              MURMUR
            </span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#how">
              How it works
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#presets">
              Presets
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#library">
              Library
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#pro">
              Pro
            </a>
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-lilac/30 bg-lilac/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-murmur-text shadow-[0_0_22px_rgba(139,110,255,0.15)] sm:px-5 sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lilac shadow-[0_0_8px_rgba(197,154,255,0.9)]" />
            Coming soon
          </span>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-6 sm:pt-36">
          <div className="relative mb-8 w-full">
            <SoundWaveBars />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-lilac/20 bg-lilac/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-lilac/85 sm:text-[11px] sm:tracking-[0.24em]">
              On-device AI music generation
            </p>
            <h1 className="mt-6 text-[2.75rem] font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
              Compose <span className="hero-gradient-text">your mood.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed tracking-tight text-murmur-text-2 sm:mt-6 sm:text-xl">
              Murmur transforms presets or your own words into original instrumental
              loops and soundscapes — generated privately, right on your iPhone.
            </p>
            <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-5">
              <span className="btn-generate flex cursor-default select-none items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-white sm:px-10">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                Coming soon to the App Store
              </span>
              <a
                href="#how"
                className="glass-card rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-murmur-text transition-all hover:bg-lilac/8 sm:px-10"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-murmur-muted sm:text-[11px] sm:tracking-[0.24em]">
              Free on iPhone · For moments, focus, sleep &amp; play
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto w-full max-w-screen-xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">From a feeling to music</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((card) => (
              <article key={card.step} className="glass-card relative flex flex-col overflow-hidden rounded-2xl p-8">
                <span className="text-4xl font-black tracking-tight" style={{ color: card.accent }}>
                  {card.step}
                </span>
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-murmur-text-2">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* UNDER THE HOOD */}
        <section className="mx-auto w-full max-w-screen-xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Under the hood</h2>
          </div>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-murmur-text-2 sm:mb-14 sm:text-lg">
            Murmur runs entirely on your iPhone — from style tokens to the final waveform, with no cloud in between.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {techStrip.map((item) => (
              <article
                key={item.label}
                className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center sm:items-start sm:text-left"
              >
                <span className="h-3 w-3 rounded-full bg-gradient-to-br from-lilac-fixed to-gen-end shadow-[0_0_14px_rgba(197,154,255,0.9)]" />
                <h3 className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                  {item.label}
                </h3>
                <p className="text-sm leading-relaxed text-murmur-text-2 sm:text-base">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CUSTOM PROMPTS */}
        <section className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-14 lg:py-28">
          <div>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Describe a mood,{" "}
              <span className="hero-gradient-text">hear it become music.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-murmur-text-2 sm:text-lg">
              Murmur turns your words into musical style tokens, then composes an
              original instrumental on-device. It responds best to descriptions of
              genre, instruments, rhythm, mood, tempo, and texture.
            </p>
            <div className="mt-8 space-y-3.5">
              {examplePrompts.map((prompt) => (
                <div
                  key={prompt}
                  className="group relative rounded-2xl bg-gradient-to-r from-lilac/40 via-gen-end/25 to-transparent p-px transition-all duration-300 hover:from-lilac/80 hover:via-gen-end/45 hover:shadow-[0_0_30px_rgba(139,110,255,0.25)]"
                >
                  <div className="flex items-center gap-4 rounded-2xl bg-murmur-card/85 px-5 py-4 backdrop-blur-xl">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-lilac/60 blur-[3px] transition group-hover:bg-lilac" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-lilac-fixed to-gen-end shadow-[0_0_10px_rgba(197,154,255,0.9)]" />
                    </span>
                    <p className="flex-1 text-sm leading-snug text-murmur-text">
                      <span className="text-lilac/70">&ldquo;</span>
                      {prompt}
                      <span className="text-lilac/70">&rdquo;</span>
                    </p>
                    <span className="flex h-7 items-end gap-[3px] opacity-60 transition-opacity group-hover:opacity-100">
                      <span className="w-[3px] rounded-full bg-lilac" style={{ height: "40%" }} />
                      <span className="w-[3px] rounded-full bg-lilac-fixed" style={{ height: "85%" }} />
                      <span className="w-[3px] rounded-full bg-gen-end" style={{ height: "55%" }} />
                      <span className="w-[3px] rounded-full bg-lilac" style={{ height: "70%" }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <PlasmaOrb size={260} className="sm:hidden" />
            <PlasmaOrb size={400} className="hidden sm:block" />
            <div className="absolute bottom-2 left-0 right-0 px-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lilac sm:text-sm sm:tracking-[0.22em]">
                Converting your mood to music…
              </p>
              <p className="mt-2 text-xs text-murmur-muted">
                Translating your description into musical style
              </p>
            </div>
          </div>
        </section>

        {/* PRESETS */}
        <section id="presets" className="mx-auto w-full max-w-screen-xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">170+ curated styles</h2>
            </div>
            <p className="max-w-md text-sm text-murmur-text-2">
              Tap a category to hear a short preview. Save favorites and create your own presets from prompts you love.
            </p>
          </div>

          <StyleCategoryGrid categories={categories} />
        </section>

        {/* FEATURES + LIBRARY */}
        <section id="library" className="mx-auto w-full max-w-screen-xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="glass-card rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-murmur-text-2">{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="glass-card mt-4 flex flex-col items-start gap-6 rounded-2xl p-6 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Your private collection of moments</h3>
              <p className="mt-2 max-w-xl text-sm text-murmur-text-2">
                Saved songs live in your Library with a mini player, waveform bars, and progress —
                with playback that continues on the Lock Screen and Dynamic Island.
              </p>
            </div>
            <div className="flex h-12 items-end gap-1.5">
              <div className="h-5 w-1.5 rounded-full bg-lilac/30" />
              <div className="h-10 w-1.5 rounded-full bg-lilac shadow-[0_0_10px_rgba(197,154,255,0.9)]" />
              <div className="h-7 w-1.5 rounded-full bg-gen-end/40" />
              <div className="h-9 w-1.5 rounded-full bg-gen-end shadow-[0_0_10px_rgba(139,110,255,0.9)]" />
              <div className="h-4 w-1.5 rounded-full bg-lilac/30" />
            </div>
          </div>
        </section>

        {/* PRO */}
        <section id="pro" className="mx-auto w-full max-w-screen-xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lilac/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
              <div>
                <p className="inline-flex rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  Murmur Pro
                </p>
                <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                  Compose <span className="hero-gradient-text">without limits.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-murmur-text-2">
                  Murmur is free to start — Ambient, Lo-fi, Peaceful, Synthwave and
                  Acoustic Guitar with short previews and loops. Pro unlocks the full studio.
                </p>
                <span className="btn-generate mt-8 inline-flex w-full cursor-default select-none items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-white sm:w-auto">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                  Coming soon
                </span>
              </div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {proPerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 rounded-xl border border-lilac/10 bg-lilac/5 px-4 py-3 text-sm text-murmur-text-2"
                  >
                    <span className="mt-0.5 text-success">✦</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-murmur-border bg-gradient-to-b from-transparent to-black/40 pb-12 pt-20">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-10 px-6 sm:px-8">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex items-center gap-3">
                <MurmurMark size={30} />
                <span className="text-lg font-black tracking-[0.3em] text-lilac">MURMUR</span>
              </div>
              <p className="mb-10 max-w-md text-center text-sm text-murmur-muted">
                A pocket mood composer. Pick a mood, generate music, keep the pieces you love.
              </p>
              <div className="mb-2 flex flex-wrap justify-center gap-8 sm:gap-12">
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#how">
                  How it works
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#presets">
                  Presets
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#pro">
                  Pro
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#">
                  Privacy
                </a>
              </div>
            </div>
            <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-murmur-muted/70">
              © 2026 Murmur. Compose your mood.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
