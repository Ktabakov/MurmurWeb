import Link from "next/link";
import { SoundWaveBars } from "@/components/sound-wave-bars";
import { PlasmaOrb } from "@/components/plasma-orb";
import { MurmurMark } from "@/components/murmur-mark";
import { StyleCategoryGrid } from "@/components/style-category-grid";
import { MoodPromptList } from "@/components/mood-prompt-list";
import { FaqSection } from "@/components/faq-section";

const SITE_URL = "https://murmurapps.site";

// Structured data for richer search results (SoftwareApplication / music).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Murmur",
  applicationCategory: "MusicApplication",
  operatingSystem: "iOS",
  url: SITE_URL,
  description:
    "Compose your scene on iPhone — or go Live and stream instrumental music in real time with the knob deck. Royalty-free, copyright-free soundtracks for YouTube, TikTok, indie games, and podcasts. Export-ready WAV, fully on-device, no subscription.",
  audience: {
    "@type": "Audience",
    audienceType: "Content creators, video editors, and indie game developers",
  },
  featureList: [
    "100% royalty-free commercial use with Murmur Pro",
    "Pure instrumental — no vocals or lyrics",
    "On-device AI soundtrack generation",
    "Live mode — continuous instrumental music streamed in real time",
    "Live knob deck — DJ the mix with layer knobs while the music plays",
    "Export high-quality WAV files",
    "170+ curated instrumental presets",
    "Custom scene prompts via MusicCoCa style tokens",
    "One-time purchase — no subscription",
    "Private — no cloud rendering",
  ],
  keywords:
    "royalty-free AI music, copyright-free soundtrack, instrumental AI music, live AI music, real-time AI music generator, AI DJ, scene music generator, YouTube background music, TikTok music app, indie game music, WAV export, on-device AI music, no vocals AI music, content creator music app, Magenta RT, Apple Neural Engine",
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
    detail: "Your prompts and audio never leave your phone — with no expensive cloud data servers generating your music.",
  },
];

const steps = [
  {
    step: "01",
    title: "Define the scene",
    description:
      "Choose a curated preset or describe the scene in your own words — genre, instrument, texture, or tempo.",
    accent: "#c59aff",
  },
  {
    step: "02",
    title: "Generate the soundtrack",
    description:
      "Murmur turns your prompt into musical style tokens and composes an original instrumental track directly on your phone.",
    accent: "#d4a8ff",
  },
  {
    step: "03",
    title: "Export to your edit",
    description:
      "Save as high-quality WAV, then AirDrop to Final Cut Pro, Premiere, or Unity — or share straight to TikTok and Instagram Reels.",
    accent: "#ad63ff",
  },
];

const useCases = [
  {
    title: "Vloggers & YouTubers",
    description:
      "Generate seamless background tracks that never trigger Content ID strikes. Every loop is original to you.",
    accent: "#c59aff",
  },
  {
    title: "Indie game devs",
    description:
      "Create dynamic ambient soundscapes and looping menu music on the fly — without hunting for stock audio.",
    accent: "#d4a8ff",
  },
  {
    title: "Travel creators",
    description:
      "Need a track for a reel while editing on a plane? Generate offline, anywhere in the world.",
    accent: "#ad63ff",
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
  {
    label: "Calm and weightless",
    prompt: "Calm and weightless — warm ambient pads drifting over a slow, deep sub bass",
    sample: "/audio/moods/calm-weightless.mp3",
  },
  {
    label: "Focused and steady",
    prompt: "Focused and steady — mellow lo-fi beat with soft Rhodes keys and faint vinyl warmth",
    sample: "/audio/moods/focused-steady.mp3",
  },
  {
    label: "Hopeful and cinematic",
    prompt: "Hopeful and cinematic — slow strings swelling with gentle piano and spacious reverb",
    sample: "/audio/moods/hopeful-cinematic.mp3",
  },
  {
    label: "Dreamy and nostalgic",
    prompt: "Dreamy and nostalgic — shimmering synth pads, very slow tempo, gentle tape hiss",
    sample: "/audio/moods/dreamy-nostalgic.mp3",
  },
  {
    label: "Serene and sleepy",
    prompt: "Serene and sleepy — soft drones and distant chimes, no drums, barely moving",
    sample: "/audio/moods/serene-sleepy.mp3",
  },
  {
    label: "Bright and uplifting",
    prompt: "Bright and uplifting — lively acoustic guitar with light percussion and a warm groove",
    sample: "/audio/moods/bright-uplifting.mp3",
  },
];

const features = [
  {
    title: "170+ curated styles",
    description:
      "From Cinematic and Electronic to Jazz and Ambient — each preset is tuned for background loops, menus, and reels.",
  },
  {
    title: "Prompt any style",
    description:
      "Type a genre, tempo, or sonic texture for your scene. Murmur translates your prompt into musical style tokens on-device.",
  },
  {
    title: "Private by design",
    description:
      "Generation runs entirely on your iPhone using the Apple Neural Engine. No cloud rendering, no upload wait.",
  },
  {
    title: "Your library, organized",
    description:
      "Saved tracks live in your Library with waveform playback, rename, trim, fade — ready when your edit needs them.",
  },
];

const proPerks = [
  "100% royalty-free commercial use",
  "All 170+ presets",
  "Extended Live sessions",
  "Custom scene prompts",
  "Unlimited generation length",
  "Export high-quality WAV files",
  "Edit, trim & fade",
  "Advanced controls (CFG, temperature, top-K)",
  "Model choice: Base or Large",
];

const faqItems = [
  {
    question: "Can Murmur play music live, as it's being generated?",
    answer:
      "Yes. Live mode streams a continuous instrumental set, composed second-by-second on your iPhone by a dedicated fast on-device engine. Pick a starting instrument, tap Go Live, and the music starts within seconds — then steer it like a DJ with the knob deck, fading layers like beat, bass, keys, pads, guitar, synth, strings, brass, and arps in and out while it plays. You can save the jam to your Library when you're done.",
  },
  {
    question: "How long can Live mode run?",
    answer:
      "Live sessions are limited to a few minutes at a time. Real-time generation is intensive — as your iPhone warms up, thermals can slow the engine to protect the chip. Murmur is built for jamming and capturing a take, not hour-long sets. Save your session to the Library before it ends. As future iPhones get faster and more efficient, Live mode will only get better.",
  },
  {
    question: "Does Murmur generate vocals or lyrics?",
    answer:
      "No. Murmur is a pure instrumental music generator. It is designed specifically to create high-quality background soundscapes, lo-fi beats, and cinematic loops that fit seamlessly under video production and indie games without vocal clutter.",
  },
  {
    question: "Can I use the music on YouTube or in my commercial game?",
    answer:
      "Yes. All music generated with Murmur Pro is 100% royalty-free and cleared for commercial use. Because the AI generates raw audio locally on your device, every track is completely unique to you — meaning zero copyright claims or Content ID strikes.",
  },
  {
    question: "Can I generate AI music locally on my phone?",
    answer:
      "Yes. Murmur generates AI music entirely on your iPhone using Magenta RT and the Apple Neural Engine. Your prompts and generated audio are processed locally — not sent to a cloud server for rendering.",
  },
  {
    question: "Is Murmur private? Does my music go to the cloud?",
    answer:
      "Murmur is built for privacy. The core music generation flow runs on-device, so your prompts and generated instrumentals stay on your phone. We don't collect your audio, and there's no cloud rendering step.",
  },
  {
    question: "What's the best offline AI music app for iPhone?",
    answer:
      "Murmur is designed for private, on-device AI music generation on iPhone. Once the AI models are downloaded, you can compose instrumental tracks from presets or your own scene prompts without relying on cloud generation.",
  },
  {
    question: "How does on-device AI music generation work?",
    answer:
      "You pick a preset or describe a scene in your own words. Murmur translates that text into musical style tokens, then Magenta RT composes an original instrumental track directly on your iPhone — accelerated by the Apple Neural Engine.",
  },
  {
    question: "Do I need an internet connection to make music?",
    answer:
      "You need a connection the first time to download the AI models. After that, generation runs locally on your phone. Murmur doesn't require cloud rendering for each new piece of music you create.",
  },
  {
    question: "What makes Murmur different from other AI music generators?",
    answer:
      "Most AI music tools render in the cloud, which means expensive GPU servers and costly monthly subscriptions. Murmur generates music on your iPhone instead — no cloud rendering, no expensive data servers to run, and no pricey subscription just to cover infrastructure. You get private, local generation with instrumental output, 170+ curated presets, and custom scene prompts powered by on-device AI.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-murmur-base text-murmur-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(34,16,60,0.85),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(173,99,255,0.08),transparent_34%)]" />

      <nav className="fixed inset-x-0 top-0 z-50 bg-[linear-gradient(to_bottom,rgba(10,7,18,0.88)_0%,rgba(10,7,18,0)_100%)]">
        <div className="page-shell flex items-center justify-between py-4 sm:py-5">
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
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#live">
              Live
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#presets">
              Presets
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#use-cases">
              Use cases
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#library">
              Library
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#pro">
              Pro
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#faq">
              FAQ
            </a>
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-lilac/30 bg-lilac/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-murmur-text shadow-[0_0_22px_rgba(173,99,255,0.15)] sm:px-5 sm:tracking-[0.2em]">
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

          <div className="relative mx-auto max-w-3xl text-center xl:max-w-4xl 2xl:max-w-5xl">
            <p className="inline-flex rounded-full border border-lilac/20 bg-lilac/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-lilac/85 sm:text-[11px] sm:tracking-[0.24em]">
              Royalty-free AI music for creators
            </p>
            <h1 className="mt-6 text-[2.75rem] font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
              Compose <span className="hero-gradient-text">your scene.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed tracking-tight text-murmur-text-2 sm:mt-6 sm:text-xl">
              Generate 100% original, copyright-free instrumental loops directly on your iPhone.
              Perfect for YouTube, TikTok, indie games, and podcasts. No cloud, no internet
              required, and no subscription fees.
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
              Free on iPhone · Royalty-free instrumental music for creators, editors, and devs
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">From idea to export-ready audio</h2>
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

        {/* LIVE MODE */}
        <section id="live" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lilac/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lilac shadow-[0_0_8px_rgba(197,154,255,0.9)]" />
                  Live mode
                </p>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Go live.{" "}
                  <span className="hero-gradient-text">Shape the mix.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-murmur-text-2">
                  Pick a starting instrument, tap Go Live, and Murmur streams an instrumental
                  set composed second-by-second on your iPhone. Then DJ the mix in real time:
                  turn the knobs to bring layers like beat, bass, keys, pads, guitar, synth,
                  strings, brass, and arps in and out — the music morphs without ever stopping.
                  Like the jam? Save it straight to your Library.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-murmur-muted">
                  Live sessions run for a few minutes — real-time generation heats up your
                  iPhone, and thermals can slow the engine to protect the chip. As future
                  iPhones get faster, Live mode will only improve.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Instrument knobs — fade layers in and out as it plays",
                  "Wild knob: dial in surprise when the jam gets too safe",
                  "Generated in real time, fully on-device",
                  "Keep the jam: save the session as a track",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-xl border border-lilac/10 bg-lilac/5 px-4 py-3 text-sm text-murmur-text-2"
                  >
                    <span className="text-lilac">●</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UNDER THE HOOD */}
        <section className="page-shell py-16 sm:py-24 lg:py-28">
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
                className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center"
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
        <section className="page-shell grid grid-cols-1 items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-14 lg:py-28">
          <div>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Define the scene.{" "}
              <span className="hero-gradient-text">Score the project.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-murmur-text-2 sm:text-lg">
              Describe the vibe of your B-roll, menu screen, or reel. Murmur turns your prompt
              into musical style tokens and composes an original instrumental soundtrack on-device —
              genre, instruments, rhythm, tempo, and texture.
            </p>
            <MoodPromptList prompts={examplePrompts} />
          </div>

          <div className="relative flex items-center justify-center">
            <PlasmaOrb size={260} className="sm:hidden" />
            <PlasmaOrb size={400} className="hidden sm:block" />
            <div className="absolute bottom-2 left-0 right-0 px-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lilac sm:text-sm sm:tracking-[0.22em]">
                Scoring your project…
              </p>
              <p className="mt-2 text-xs text-murmur-muted">
                Turning your scene prompt into a soundtrack
              </p>
            </div>
          </div>
        </section>

        {/* PRESETS */}
        <section id="presets" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">170+ curated styles</h2>
            </div>
            <p className="max-w-md text-sm text-murmur-text-2">
              Tap a category to hear a short preview. Cinematic, electronic, jazz, and more — built for background loops and edits.
            </p>
          </div>

          <StyleCategoryGrid categories={categories} />
        </section>

        {/* USE CASES */}
        <section id="use-cases" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Built for <span className="hero-gradient-text">creators</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-murmur-text-2">
              Original background music for the workflows that actually need it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {useCases.map((item) => (
              <article key={item.title} className="glass-card flex flex-col items-center rounded-2xl p-8 text-center">
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_14px_rgba(197,154,255,0.9)]"
                  style={{ background: item.accent }}
                />
                <h3 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-murmur-text-2 sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* EXPORT */}
        <section id="export" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-gen-end/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
              <div>
                <p className="inline-flex rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  Export ready
                </p>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  High-quality WAVs,{" "}
                  <span className="hero-gradient-text">straight into your edit.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-murmur-text-2">
                  Export high-quality WAV files instantly. AirDrop straight to Final Cut Pro,
                  Premiere, or Unity — or share directly to TikTok and Instagram Reels. No
                  re-encoding, no upload queue, no stock-site licensing maze.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {["Final Cut Pro & Premiere", "Unity & game engines", "TikTok & Instagram Reels", "Podcasts & vlogs"].map(
                  (target) => (
                    <div
                      key={target}
                      className="flex items-center gap-3 rounded-xl border border-lilac/10 bg-lilac/5 px-4 py-3 text-sm text-murmur-text-2"
                    >
                      <span className="text-lilac">→</span>
                      <span>{target}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES + LIBRARY */}
        <section id="library" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-12">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Everything in one pocket studio</h2>
          </div>

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
              <h3 className="text-xl font-bold tracking-tight text-white">Library built for production</h3>
              <p className="mt-2 max-w-xl text-sm text-murmur-text-2">
                Organize generated tracks with waveform playback, rename for your project,
                trim and fade — then export when the cut is ready.
              </p>
            </div>
            <div className="flex h-12 items-end gap-1.5">
              <div className="h-5 w-1.5 rounded-full bg-lilac/30" />
              <div className="h-10 w-1.5 rounded-full bg-lilac shadow-[0_0_10px_rgba(197,154,255,0.9)]" />
              <div className="h-7 w-1.5 rounded-full bg-gen-end/40" />
              <div className="h-9 w-1.5 rounded-full bg-gen-end shadow-[0_0_10px_rgba(173,99,255,0.9)]" />
              <div className="h-4 w-1.5 rounded-full bg-lilac/30" />
            </div>
          </div>
        </section>

        {/* PRO */}
        <section id="pro" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lilac/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
              <div>
                <p className="inline-flex rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  Murmur Pro · One-time purchase
                </p>
                <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                  Zero subscriptions.{" "}
                  <span className="hero-gradient-text">Full commercial rights.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-murmur-text-2">
                  Murmur is free to start with core presets and short previews. Pro unlocks
                  the full studio — one-time purchase, no monthly fees to cover cloud GPU costs.
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

        {/* FAQ */}
        <section id="faq" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Frequently asked <span className="hero-gradient-text">questions</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-murmur-text-2">
              Royalty-free AI music, on-device generation, and commercial use — answered.
            </p>
          </div>

          <FaqSection items={faqItems} />
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-murmur-border bg-gradient-to-b from-transparent to-black/40 pb-12 pt-20">
          <div className="page-shell flex flex-col items-center gap-10">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex items-center gap-3">
                <MurmurMark size={30} />
                <span className="text-lg font-black tracking-[0.3em] text-lilac">MURMUR</span>
              </div>
              <p className="mb-10 max-w-md text-center text-sm text-murmur-muted">
                Royalty-free AI music for creators. Generate on iPhone, export to your edit.
              </p>
              <div className="mb-2 flex flex-wrap justify-center gap-8 sm:gap-12">
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#how">
                  How it works
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#live">
                  Live
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#presets">
                  Presets
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#use-cases">
                  Use cases
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#pro">
                  Pro
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="#faq">
                  FAQ
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="/privacy/">
                  Privacy
                </a>
              </div>
            </div>
            <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-murmur-muted/70">
              © 2026 Murmur. Original music for creators.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
