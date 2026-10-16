import Link from "next/link";
import { ScoreHero } from "@/components/score-hero";
import { PlasmaOrb } from "@/components/plasma-orb";
import { MurmurMark } from "@/components/murmur-mark";
import { StyleCategoryGrid } from "@/components/style-category-grid";
import { MoodPromptList } from "@/components/mood-prompt-list";
import { FaqSection } from "@/components/faq-section";
import { EngineSampleProvider, EngineToggle } from "@/components/engine-samples";
import { BADGE_2_2, BADGE_2_2_SHORT, INLINE_2_2, after2_2 } from "@/lib/release";

const SITE_URL = "https://murmurapps.com";
// Geo-neutral App Store link: Apple redirects each visitor to their own country's
// storefront. Do NOT hardcode a country segment (e.g. /de/) — that forced every
// visitor onto the German store regardless of where they live.
const APP_STORE_URL = "https://apps.apple.com/app/id6776807467";
const APP_STORE_NAME = "Murmur: On-Device AI Music";
const YOUTUBE_DEMO_URL = "https://youtube.com/shorts/6yVzCr-LWgo?si=XNPmg6FgI9V3HBCs";

// Structured data for richer search results (SoftwareApplication / music).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: APP_STORE_NAME,
  applicationCategory: "MusicApplication",
  operatingSystem: "iOS",
  url: SITE_URL,
  downloadUrl: APP_STORE_URL,
  description:
    "Compose your scene on iPhone — or go Live and stream instrumental music in real time with the knob deck. Royalty-free, copyright-free soundtracks for YouTube, TikTok, indie games, and podcasts. Export-ready WAV, fully on-device, no subscription.",
  audience: {
    "@type": "Audience",
    audienceType: "Content creators, video editors, and indie game developers",
  },
  featureList: [
    "100% royalty-free — every track, free or Pro",
    "Pure instrumental — no vocals or lyrics",
    "On-device AI soundtrack generation",
    "Live mode — continuous instrumental music streamed in real time",
    "Live knob deck — DJ the mix with layer knobs while the music plays",
    "Export high-quality WAV files",
    "170+ curated instrumental presets",
    "Custom scene prompts in your own words",
    ...after2_2([
      "Score mode — on-device soundtracks for your photos and videos",
      "Moments — 31 ready-made soundtracks for everyday scenes",
      "Story Worlds search — 40+ film and game moods by place, mood or scene",
    ]),
    "App in English, German, French, Spanish, Portuguese and Japanese",
    "One-time purchase — no subscription",
    "Private — no cloud rendering",
  ],
  keywords:
    "royalty-free AI music, copyright-free soundtrack, AI music for videos, video soundtrack generator, music for photos, background music for Reels, instrumental AI music, live AI music, real-time AI music generator, AI DJ, scene music generator, YouTube background music, TikTok music app, indie game music, WAV export, on-device AI music, no vocals AI music, content creator music app, Orpheus engine, Stability AI, Magenta RT, Apple Neural Engine",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["en", "de", "fr", "es", "pt-BR", "ja"],
  publisher: {
    "@type": "Organization",
    name: "Murmur",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-192.png`,
  },
  sameAs: [APP_STORE_URL, YOUTUBE_DEMO_URL.split("?")[0]],
};

const techStrip = [
  {
    label: "Orpheus engine · Powered by Stability AI",
    detail: "Full tracks in seconds — up to 6 minutes — composed right on your iPhone.",
  },
  {
    label: "Built for Apple silicon",
    detail: "Core ML on the iPhone's GPU and Neural Engine. Live mode runs Google's Magenta RT.",
  },
  {
    label: "100% on-device & private",
    detail: "Your prompts and audio never leave your phone — with no expensive cloud data servers generating your music.",
  },
];

const steps = [
  {
    step: "01",
    title: "Start from your scene",
    description:
      "Pick a photo or video, or describe the scene in your own words. Presets, Moments and Story Worlds are one tap away.",
    accent: "#c59aff",
  },
  {
    step: "02",
    title: "Murmur composes it",
    description:
      "Orpheus writes an original instrumental in seconds, right on your iPhone, exactly as long as your video. Prompts in German, French, Spanish, Portuguese or Japanese are translated on the device first.",
    accent: "#d4a8ff",
  },
  {
    step: "03",
    title: "Export to your edit",
    description:
      "Save the video with its new music, share it or post it to Instagram, or export the track as a high-quality WAV for Final Cut Pro, Premiere or Unity.",
    accent: "#ad63ff",
  },
];

const useCases = [
  {
    title: "Vloggers & YouTubers",
    description:
      "Generate background tracks with no royalties owed — nothing to license.",
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
  { label: "Ambient", color: "#c59aff", sample: "/audio/styles/ambient.mp3", sampleOrpheus: "/audio/orpheus/style-ambient.m4a" },
  { label: "Focus", color: "#00e5ff", sample: "/audio/styles/focus.mp3", sampleOrpheus: "/audio/orpheus/style-focus.m4a" },
  { label: "Sleep", color: "#4a90e2", sample: "/audio/styles/sleep.mp3", sampleOrpheus: "/audio/orpheus/style-sleep.m4a" },
  { label: "Cinematic", color: "#ffb74d", sample: "/audio/styles/cinematic.mp3", sampleOrpheus: "/audio/orpheus/style-cinematic.m4a" },
  { label: "Jazz & Soul", color: "#ff8a65", sample: "/audio/styles/jazz.mp3", sampleOrpheus: "/audio/orpheus/style-jazz.m4a" },
  { label: "Electronic", color: "#e040fb", sample: "/audio/styles/electronic.mp3", sampleOrpheus: "/audio/orpheus/style-electronic.m4a" },
  { label: "Acoustic", color: "#aed581", sample: "/audio/styles/acoustic.mp3", sampleOrpheus: "/audio/orpheus/style-acoustic.m4a" },
  { label: "World", color: "#4db6ac", sample: "/audio/styles/world.mp3", sampleOrpheus: "/audio/orpheus/style-world.m4a" },
];

const scoreModePoints = [
  "Music exactly as long as your video",
  "Feelings: Epic, Chill, Dark, Playful…",
  "Takes: retry without losing a result",
  "Export video with music (9:16 or 1:1)",
  "Mix in the original sound, or replace it",
  "Save it, share it, or post it to Instagram",
];

// A few of the 31 Moments and 40+ Story Worlds (the app's own names, colours and moods).
const momentSamples = [
  { name: "Birthday Confetti", mood: "Candles, balloons and a room full of cheering.", accent: "#ff5fa2" },
  { name: "Dog Park Zoomies", mood: "Zoomies, fetch and a very good, very silly day.", accent: "#f59e5b" },
  { name: "Window Seat", mood: "Floating above the clouds, calm and weightless.", accent: "#a5b4fc" },
];

const storyWorldSamples = [
  { name: "Left Bank Midnight", mood: "Rain on cobblestones and a saxophone after midnight.", accent: "#e0a458" },
  { name: "Imperial Ballroom", mood: "Candlelight on gold and a waltz that never misses a step.", accent: "#e8c27a" },
  { name: "High Seas Chase", mood: "Cannon smoke, a stolen map and a ship outrunning the storm.", accent: "#38bdf8" },
];

const momentSections = [
  "Celebrations",
  "Love & Weddings",
  "Family & Pets",
  "Travel & Outdoors",
  "Seasons & Holidays",
  "Food & Home",
  "Sport & Action",
  "Creators",
];

const liveModePoints = [
  "Instrument knobs — fade layers in and out as it plays",
  "Wild knob: dial in surprise when the jam gets too safe",
  "Generated in real time, fully on-device",
  "Keep the jam: save the session as a track",
];

const examplePrompts = [
  {
    label: "Calm and weightless",
    prompt: "Calm and weightless — warm ambient pads drifting over a slow, deep sub bass",
    sample: "/audio/moods/calm-weightless.mp3",
    sampleOrpheus: "/audio/orpheus/calm-weightless.m4a",
  },
  {
    label: "Focused and steady",
    prompt: "Focused and steady — mellow lo-fi beat with soft Rhodes keys and faint vinyl warmth",
    sample: "/audio/moods/focused-steady.mp3",
    sampleOrpheus: "/audio/orpheus/focused-steady.m4a",
  },
  {
    label: "Hopeful and cinematic",
    prompt: "Hopeful and cinematic — slow strings swelling with gentle piano and spacious reverb",
    sample: "/audio/moods/hopeful-cinematic.mp3",
    sampleOrpheus: "/audio/orpheus/hopeful-cinematic.m4a",
  },
  {
    label: "Dreamy and nostalgic",
    prompt: "Dreamy and nostalgic — shimmering synth pads, very slow tempo, gentle tape hiss",
    sample: "/audio/moods/dreamy-nostalgic.mp3",
    sampleOrpheus: "/audio/orpheus/dreamy-nostalgic.m4a",
    promptOrpheus: "Dreamy and nostalgic — shimmering dreamy synth pads, very slow tempo, warm nostalgic chords",
  },
  {
    label: "Serene and sleepy",
    prompt: "Serene and sleepy — soft drones and distant chimes, no drums, barely moving",
    sample: "/audio/moods/serene-sleepy.mp3",
    sampleOrpheus: "/audio/orpheus/serene-sleepy.m4a",
  },
  {
    label: "Bright and uplifting",
    prompt: "Bright and uplifting — lively acoustic guitar with light percussion and a warm groove",
    sample: "/audio/moods/bright-uplifting.mp3",
    sampleOrpheus: "/audio/orpheus/bright-uplifting.m4a",
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
      "Type a genre, tempo, instruments, or a mood for your scene. Orpheus turns your words into music, on-device.",
  },
  {
    title: "Private by design",
    description:
      "Generation runs entirely on your iPhone. No cloud rendering, no upload wait, no internet needed after setup.",
  },
  {
    title: "Your library, organized",
    description:
      "Saved tracks live in your Library with waveform playback, rename, trim, fade — ready when your edit needs them.",
  },
];

const proPerks = [
  "All 170+ presets",
  "Live mode — Go Live & DJ with the knob deck",
  "Extended Live sessions",
  "Custom scene prompts",
  "Unlimited tracks, up to 6 minutes each",
  "Export high-quality WAV files",
  "Edit, trim & fade",
  ...after2_2(["Score full-length videos, no watermark"]),
  "Advanced controls (CFG, temperature, top-K)",
  "Model choice: Small, Base, and Large",
];

const faqItems = [
  {
    question: "What is the Orpheus engine?",
    answer:
      "Orpheus is Murmur's newest music engine, powered by Stability AI. It composes a full 30-second track in seconds on recent iPhones and goes up to about 6 minutes per track — right on your iPhone, with no internet needed after a one-time download. Its model was trained on licensed and Creative Commons audio. Murmur's original Magenta RT engines are still there: they power Live mode and stay selectable as the Classic engine in Settings. Orpheus needs iOS 18 or later.",
  },
  {
    question: "How much does Murmur cost? Is there a free version?",
    answer:
      "Murmur is free to download, and you get free tracks every day: with the Orpheus engine, three tracks a day up to 30 seconds, plus one free long track. Every track is royalty-free, free tier or Pro. Murmur Pro is a one-time purchase (a lifetime unlock, not a subscription) that opens the full studio: unlimited tracks up to 6 minutes each, all 170+ presets, custom scene prompts, Live mode, WAV export, and advanced controls. No monthly fees, ever — check the current price on the App Store.",
  },
  {
    question: "Can Murmur make music for my videos and photos?",
    answer:
      `Yes, with Score mode, ${INLINE_2_2}. Pick a photo or video and Murmur composes a soundtrack for it on your iPhone, exactly as long as your video. On iPhones with Apple Intelligence (iPhone 15 Pro or newer, iOS 27), Apple's on-device model looks at the scene and suggests three musical ideas that fit it. On other iPhones, Score still works: start from presets, Moments, Story Worlds, or your own words. You can keep or mix in the original sound, then save the finished video to Photos, share it, or post it to Instagram. Free scores cover photos and videos up to 30 seconds and carry a small "Made with Murmur" mark; Pro scores full-length videos without it. Your photos and videos never leave your iPhone. Score uses the Orpheus engine (iOS 18 or later).`,
  },
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
      "Yes. Every track you generate with Murmur, free tier or Pro, is royalty-free and can be used commercially — nothing to license, and neither Murmur nor its model providers claim rights over what you generate. As with any AI-generated audio, an automated system like YouTube's Content ID could in rare cases flag a false match; that's a third-party detection issue, not a rights issue, and is disputable.",
  },
  {
    question: "Can I generate AI music locally on my phone?",
    answer:
      "Yes. Murmur generates AI music entirely on your iPhone — with the Orpheus engine (powered by Stability AI) and Google's Magenta RT models, accelerated by Apple silicon. Your prompts and generated audio are processed locally — not sent to a cloud server for rendering.",
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
      "You pick a preset or describe a scene in your own words. The Orpheus engine (powered by Stability AI) turns that text into an original instrumental track with a diffusion model running on your iPhone's GPU — a 30-second track takes seconds. Live mode uses Google's Magenta RT on the Apple Neural Engine to compose music in real time.",
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
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-murmur-muted transition-colors hover:text-lilac" href="#score">
              Score
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
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full border border-lilac/30 bg-lilac/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-murmur-text shadow-[0_0_22px_rgba(173,99,255,0.15)] transition-colors hover:border-lilac/50 hover:bg-lilac/15 sm:px-5 sm:tracking-[0.2em]"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lilac shadow-[0_0_8px_rgba(197,154,255,0.9)]" />
            Get the app
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO: the lake clip scored in Murmur; tap "Compose score" to hear it, pick a style to switch the score */}
        <ScoreHero
          intro={
            <>
              {/* The h1 stays the keyword line (what the page is about); the big line is the visual headline. */}
              <h1 className="inline-flex rounded-full border border-lilac/20 bg-lilac/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-lilac/85 backdrop-blur-sm sm:text-[11px] sm:tracking-[0.24em]">
                Royalty-free AI music for creators
              </h1>
              <p className="mt-4 text-[2.75rem] font-black leading-[0.95] tracking-tight text-white sm:mt-6 sm:text-6xl xl:text-7xl">
                <span className="block">Your scene.</span>
                <span className="hero-gradient-text block pb-1">Your sound.</span>
              </p>
              <p className="mt-4 max-w-xl text-base font-medium leading-relaxed tracking-tight text-murmur-text-2 sm:mt-6 sm:text-lg">
                Original, royalty-free music composed right on your iPhone, for your photos, videos,
                Reels and games. No cloud, no subscription.
              </p>
            </>
          }
          actions={
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-generate flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                Download on the App Store
              </a>
              <a
                href="#how"
                className="glass-card rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-murmur-text transition-all hover:bg-lilac/8"
              >
                See how it works
              </a>
            </div>
          }
        />

        {/* HOW IT WORKS */}
        <section id="how" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">From scene to export-ready soundtrack</h2>
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

        {/* SCORE MODE (2.2) */}
        <section id="score" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-lilac/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-center lg:gap-14">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  {BADGE_2_2}
                </p>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Score your photos and videos.
                </h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-snug text-murmur-text-2 sm:text-xl">
                  Pick a clip, get music made for it.{" "}
                  <span className="text-murmur-muted">Analyzed and composed right on your iPhone.</span>
                </p>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-murmur-text-2">
                  Choose a photo or video and Murmur suggests music that fits it: three ideas for the
                  scene, matching presets, Moments, and Story Worlds. Pick one, set a feeling, and
                  Orpheus composes a soundtrack exactly as long as your video. Try again or try another
                  idea without losing a take, then save the video with its new music, share it, or post
                  it to Instagram.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-murmur-muted">
                  Your photos and videos never leave your iPhone. Scene ideas need Apple Intelligence
                  (iPhone 15 Pro or newer, iOS 27). On other iPhones, Score works with presets,
                  Moments, Story Worlds, or your own words.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {scoreModePoints.map((point) => (
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
              <figure className="mx-auto w-full max-w-[300px] lg:max-w-none">
                <picture>
                  <source srcSet="/images/score-photo.webp" type="image/webp" />
                  <img
                    src="/images/score-photo.png"
                    alt="Murmur's Score screen on iPhone: a photo of a small white dog in the grass, Feeling chips (Auto, Epic, Uplifting, Chill), and the suggested music below it, with Dog Park Zoomies as the best match and Acoustic pop as another idea"
                    width={720}
                    height={1347}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
                <figcaption className="mt-3 text-center text-sm leading-snug text-murmur-text-2">
                  Photo in: ideas that fit the scene.{" "}
                  <span className="text-murmur-muted">Scene ideas need Apple Intelligence.</span>
                </figcaption>
              </figure>
            </div>

            <div className="relative mt-10 grid grid-cols-1 gap-5 lg:mt-12 lg:grid-cols-2">
              <div id="moments" className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Moments</h3>
                  <span className="rounded-full border border-lilac/20 bg-lilac/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-lilac">
                    {BADGE_2_2_SHORT}
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-murmur-text-2">
                  31 ready-made soundtracks for the scenes people film most: birthdays, weddings, the
                  dog park, travel, holidays and more. Pick a moment and Murmur scores it, no
                  description needed.
                </p>
                <SampleCards label="Some of the Moments" items={momentSamples} />
                <p className="mt-4 text-xs leading-relaxed text-murmur-muted">
                  8 sections: {momentSections.join(" · ")}
                </p>
              </div>

              <div id="story-worlds" className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Story Worlds</h3>
                  <span className="rounded-full border border-lilac/20 bg-lilac/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-lilac">
                    {BADGE_2_2_SHORT}
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-murmur-text-2">
                  40+ cinematic film and game moods, now searchable in the app by place, mood or
                  scene. Pick one and Murmur scores it, for your photo, your video, or on its own.
                </p>
                <SampleCards label="Some of the Story Worlds" items={storyWorldSamples} />
                <p className="mt-4 text-xs leading-relaxed text-murmur-muted">
                  Plus new regional styles from 30+ countries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE MODE */}
        <section id="live" className="page-shell scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lilac/15 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start lg:gap-14">
              <div className="order-1 lg:col-start-1 lg:row-start-1">
                <p className="inline-flex items-center gap-2 rounded-full border border-lilac/20 bg-lilac/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                  <span className="live-pulse-dot" aria-hidden="true" />
                  Live mode
                </p>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Go live.
                </h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-snug text-murmur-text-2 sm:text-xl">
                  DJ the mix in real time.{" "}
                  <span className="text-murmur-muted">Composed second-by-second on-device.</span>
                </p>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-murmur-text-2">
                  Pick a starting instrument, tap Go Live, and Murmur streams an instrumental
                  set on your iPhone. Turn the knobs to bring layers like beat, bass, keys, pads,
                  guitar, synth, strings, brass, and arps in and out — the music morphs without
                  ever stopping. Like the jam? Save it straight to your Library.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-murmur-muted">
                  Live sessions run for a few minutes — real-time generation heats up your
                  iPhone, and thermals can slow the engine to protect the chip. As future
                  iPhones get faster, Live mode will only improve.
                </p>
              </div>
              <figure className="order-2 mx-auto w-full max-w-[280px] sm:max-w-[300px] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none">
                <img
                  src="/images/live-mode.webp"
                  alt="Murmur Live mode on iPhone — knob deck for beat, bass, keys, synth, and more with End and End & keep controls"
                  width={1242}
                  height={2688}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
                />
              </figure>
              <div className="order-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-start-1 lg:row-start-2">
                {liveModePoints.map((point) => (
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

        {/* Engine switch (Under the hood) drives every example player below it. */}
        <EngineSampleProvider>
        {/* UNDER THE HOOD */}
        <section className="page-shell py-16 sm:py-24 lg:py-28">
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-lilac to-gen-end" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Under the hood</h2>
          </div>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-murmur-text-2 sm:mb-14 sm:text-lg">
            Murmur runs entirely on your iPhone — from your prompt to the final waveform, with no cloud in between.
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
          <EngineToggle />
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
              into an original instrumental soundtrack on-device — genre, instruments, rhythm,
              tempo, and texture.
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
        </EngineSampleProvider>

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
                  <span className="hero-gradient-text">Royalty-free, no strings.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-murmur-text-2">
                  Download Murmur free and start creating with the core presets.
                  One Pro unlock opens the full studio — a single one-time purchase, with no
                  monthly fees to cover cloud GPU costs.
                </p>

                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:gap-8">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-murmur-muted">
                      Free to start
                    </span>
                    <p className="text-sm leading-relaxed text-murmur-text-2">
                      Core presets with{" "}
                      <span className="font-semibold text-white">unlimited generations</span>{" "}
                      at a fixed track length.
                    </p>
                  </div>
                  <div className="hidden w-px self-stretch bg-murmur-border sm:block" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lilac">
                      Murmur Pro · one-time
                    </span>
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black tracking-tight text-white">Pay once</span>
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-murmur-muted">
                        yours forever
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed text-murmur-text-2">
                      <span className="font-semibold text-white">Unlimited length</span>, all 170+
                      presets, and custom scene prompts — no subscription.
                    </p>
                  </div>
                </div>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-generate mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 sm:w-auto"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                  Download on the App Store
                </a>
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
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="/terms/">
                  Terms
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac" href="/impressum/">
                  Impressum
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

function SampleCards({
  label,
  items,
}: {
  label: string;
  items: { name: string; mood: string; accent: string }[];
}) {
  return (
    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3" aria-label={label}>
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-xl border border-white/10 bg-black/25 px-3.5 py-3"
          style={{ boxShadow: `inset 3px 0 0 ${item.accent}` }}
        >
          <p className="text-sm font-bold text-white">{item.name}</p>
          <p className="mt-0.5 text-xs leading-snug text-murmur-muted">{item.mood}</p>
        </li>
      ))}
    </ul>
  );
}
