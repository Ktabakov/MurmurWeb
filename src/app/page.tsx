import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { MurmurMark } from "@/components/murmur-mark";
import { PhoneShot } from "@/components/phone-shot";
import { ReviewList } from "@/components/review-list";
import { SiteFooter } from "@/components/site-footer";
import { reviews } from "@/lib/reviews";
import { CONTACT_EMAIL, MURMUR, SERENADA, SITE_URL, STUDIO_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Murmur Apps — Music apps that run on your iPhone" },
  description:
    "Murmur Apps is a one-person studio in Germany. Murmur composes royalty-free instrumental music on your iPhone; Lala (coming soon) sings a song about anyone or anything you type. No cloud, no account, pay once.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "Murmur Apps — Music apps that run on your iPhone",
    description:
      "Murmur for royalty-free instrumentals, Lala for songs with real vocals about anything. Made on the iPhone, no cloud, no subscription.",
    url: `${SITE_URL}/`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0c12" },
  ],
  colorScheme: "light dark",
};

/** Old links like murmurapps.com/#faq pointed at sections of the Murmur page, which now lives at /murmur/. */
const MURMUR_SECTION_IDS = ["how", "score", "moments", "story-worlds", "live", "presets", "use-cases", "export", "library", "pro", "faq"];
const legacyHashRedirect = `(function(){var h=location.hash.slice(1);if(${JSON.stringify(MURMUR_SECTION_IDS)}.indexOf(h)>-1)location.replace("/murmur/#"+h);})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: STUDIO_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-192.png`,
  email: CONTACT_EMAIL,
  sameAs: [MURMUR.appStoreUrl, "https://www.tiktok.com/@murmur0827", "https://www.instagram.com/murmurmusicai"],
};

const reasons = [
  {
    title: "Your words stay yours",
    text: "Prompts, names, lyrics and the music itself are made and kept on your iPhone. Nothing is uploaded to make a song.",
  },
  {
    title: "Works offline",
    text: "After a one-time download of the music model, you can make music on a plane, in the woods, anywhere.",
  },
  {
    title: "Pay once",
    text: "No cloud GPUs to rent means no subscription to cover them. Try for free, unlock once, keep it.",
  },
];

export default function StudioHome() {
  return (
    <div className="theme-studio flex min-h-screen flex-col bg-st-bg text-st-ink">
      <script dangerouslySetInnerHTML={{ __html: legacyHashRedirect }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-st-line">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <Link href="/" className="whitespace-nowrap text-sm font-black tracking-[0.2em] text-st-ink sm:text-base sm:tracking-[0.3em]">
            MURMUR APPS
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-st-ink-2 sm:gap-7" aria-label="Main">
            <a href="#apps" className="hidden transition-colors hover:text-st-accent sm:inline">
              Apps
            </a>
            <a href="#reviews" className="transition-colors hover:text-st-accent">
              Reviews
            </a>
            <Link href={MURMUR.path} className="transition-colors hover:text-st-accent">
              Murmur
            </Link>
            <Link href={SERENADA.path} className="transition-colors hover:text-st-accent">
              Lala
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="page-shell pb-10 pt-14 sm:pb-14 sm:pt-20 lg:pt-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-st-muted">
            An indie app studio in Germany
          </p>
          <h1 className="mt-4 max-w-4xl text-[2.6rem] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Music apps that run on your iPhone.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-st-ink-2 sm:text-xl">
            {STUDIO_NAME} is one developer making apps that compose music on the phone itself.
            Instrumentals for your videos with Murmur, and soon songs with real vocals about anything
            you type with Lala.
          </p>
        </section>

        {/* APPS */}
        <section id="apps" className="page-shell scroll-mt-6 pb-16 sm:pb-24" aria-label="Our apps">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <MurmurCard />
            <SerenadaCard />
          </div>
        </section>

        {/* WHY ON-DEVICE */}
        <section className="border-y border-st-line bg-st-surface-2/60">
          <div className="page-shell grid grid-cols-1 gap-8 py-14 sm:py-16 md:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title}>
                <h2 className="text-lg font-extrabold tracking-tight">{r.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-st-ink-2">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="page-shell scroll-mt-6 py-16 sm:py-24">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">What people say</h2>
            <p className="max-w-md text-[15px] leading-relaxed text-st-muted">
              Real App Store reviews of Murmur, as written. Translations are ours and marked.
              Lala&rsquo;s reviews will join them after launch.
            </p>
          </div>
          <ReviewList items={reviews} />

          <div className="mt-6 flex flex-col gap-6 rounded-3xl border border-st-line bg-st-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Using Murmur? Tell other people.</h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-st-ink-2">
                For a one-person studio, one honest review helps more than any ad. Ideas, bugs and
                wishes go straight to the developer by email.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href={MURMUR.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-st-ink px-6 py-3 text-center text-sm font-bold text-st-bg transition-opacity hover:opacity-85"
              >
                Write a review
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Feedback`}
                className="rounded-full border border-st-line px-6 py-3 text-center text-sm font-bold text-st-ink transition-colors hover:border-st-ink/40"
              >
                Send feedback
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="studio" />
    </div>
  );
}

function MurmurCard() {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[2rem] bg-[#0a0712] p-6 text-murmur-text ring-1 ring-black/5 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(173,99,255,0.28),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(220,99,255,0.14),transparent_45%)]" />
      <div className="relative flex items-start gap-4">
        <MurmurMark size={64} className="shrink-0" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black tracking-[0.18em] text-lilac sm:text-3xl">MURMUR</h2>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
              On the App Store
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-murmur-muted">On-Device AI Music</p>
        </div>
      </div>
      <p className="relative mt-5 text-lg font-semibold leading-snug text-white sm:text-xl">
        Royalty-free instrumental music for your videos, photos, Reels and games, composed on your
        iPhone.
      </p>
      <ul className="relative mt-4 space-y-1.5 text-[15px] text-murmur-text-2">
        <li>Score a photo or video with music that fits it</li>
        <li>Live mode: steer the mix in real time</li>
        <li>170+ styles, WAV export, one-time Pro unlock</li>
      </ul>

      <div className="relative mt-7 grid grid-cols-3 gap-3 sm:gap-4">
        <PhoneShot
          src="/images/murmur-score-video.webp"
          alt="Murmur Score on iPhone: a lake video with its new soundtrack 'Sunlit Fiddle Whispers' playing, with Try again, Other ideas and Export"
          frameClassName="border-black bg-black"
        />
        <PhoneShot
          src="/images/murmur-moments.webp"
          alt="Murmur Moments screen: ready-made soundtracks for everyday scenes like Birthday Confetti, Graduation Day and Pool Party"
          frameClassName="border-black bg-black"
          className="translate-y-4"
        />
        <PhoneShot
          src="/images/live-mode.webp"
          alt="Murmur Live mode: a knob deck for beat, bass, keys, synth and more"
          frameClassName="border-black bg-black"
        />
      </div>

      <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={MURMUR.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-generate rounded-full px-6 py-3.5 text-center text-sm font-black text-white transition-opacity hover:opacity-90"
        >
          Download on the App Store
        </a>
        <Link
          href={MURMUR.path}
          className="rounded-full border border-lilac/25 bg-lilac/5 px-6 py-3.5 text-center text-sm font-bold text-murmur-text transition-colors hover:bg-lilac/10"
        >
          Explore Murmur →
        </Link>
      </div>
      <p className="relative mt-4 text-xs text-murmur-muted">Free to try · Pro is a one-time purchase · iPhone</p>
    </article>
  );
}

function SerenadaCard() {
  return (
    <article className="theme-serenada relative flex flex-col overflow-hidden rounded-[2rem] bg-sr-paper p-6 text-sr-ink ring-1 ring-sr-line sm:p-8">
      <div className="relative flex items-start gap-4">
        <img
          src="/lala/icon.webp"
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-[28%]"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">Lala</h2>
            <span className="sr-stamp-sm rounded-md border-2 border-sr-ink bg-sr-mari px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#1b1712]">
              {SERENADA.IS_RELEASED ? "New" : "Coming soon"}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-sr-ink-soft">Custom Song Maker</p>
        </div>
      </div>
      <p className="relative mt-5 font-serif text-xl font-bold leading-snug sm:text-[1.4rem]">
        Type anything and hear it sung: your cat, your Monday, a friend&rsquo;s birthday. Real vocals,
        written and sung on your iPhone.
      </p>
      <ul className="relative mt-4 space-y-1.5 text-[15px] text-sr-ink-soft">
        <li>One line, a ready idea, or a pasted chat</li>
        <li>Sings in 23 languages, no credits, no account</li>
        <li>Send it as a lyric video · pay once, {SERENADA.price}</li>
      </ul>

      <div className="relative mt-7 grid grid-cols-3 gap-3 sm:gap-4">
        <PhoneShot
          src="/lala/screens/01-welcome.webp"
          alt="Lala welcome screen: 'A song about anything. Or anyone.', with example songs for Mia, Lena and others"
        />
        <PhoneShot
          src="/lala/screens/03-create.webp"
          alt="Lala create screen: 'What's the song about?' with an idea field and idea cards Birthday, Birthday roast, My pet, Text to song, Love song, My day"
          className="translate-y-4"
        />
        <PhoneShot
          src="/lala/screens/06-player-example.webp"
          alt="Lala player: 'Happy Birthday, Mia' on a turntable, with lyrics and a 'Send to Mia' button"
        />
      </div>

      <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
        {SERENADA.IS_RELEASED ? (
          <a
            href={SERENADA.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sr-verm px-6 py-3.5 text-center text-sm font-bold text-sr-on-verm transition-opacity hover:opacity-90"
          >
            Download on the App Store
          </a>
        ) : (
          <a
            href={SERENADA.waitlistMailto}
            className="rounded-full bg-sr-verm px-6 py-3.5 text-center text-sm font-bold text-sr-on-verm transition-opacity hover:opacity-90"
          >
            Join the TestFlight
          </a>
        )}
        <Link
          href={SERENADA.path}
          className="rounded-full border-2 border-sr-ink px-6 py-3 text-center text-sm font-bold transition-colors hover:bg-sr-ink/5"
        >
          Explore Lala →
        </Link>
      </div>
      <p className="relative mt-4 text-xs text-sr-ink-soft">For iPhone 15 Pro and newer</p>
    </article>
  );
}
