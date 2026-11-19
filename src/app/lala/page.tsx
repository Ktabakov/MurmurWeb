import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PhoneShot } from "@/components/phone-shot";
import { SerenadaExamples, type SerenadaExample } from "@/components/serenada-examples";
import { SiteFooter } from "@/components/site-footer";
import { CONTACT_EMAIL, SERENADA, SITE_URL } from "@/lib/site";

const PAGE_URL = `${SITE_URL}/lala/`;

export const metadata: Metadata = {
  title: { absolute: "Lala: Custom Song Maker for iPhone. Text to song, private and offline" },
  description:
    "Type anything and hear it sung. Lala makes songs with real vocals on your iPhone: birthdays, pets, chats, your Monday. 23 languages. No account, no credits, pay once. iPhone 15 Pro and newer.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    siteName: "Lala",
    title: "Lala — Type anything. Hear it sung.",
    description:
      "Songs with real vocals about anyone or anything, written and sung on your iPhone. No credits, no account, your words stay on the phone.",
    url: PAGE_URL,
    images: [{ url: `${SITE_URL}/lala/icon-512.png`, width: 512, height: 512, alt: "Lala app icon" }],
  },
  twitter: { card: "summary", images: [`${SITE_URL}/lala/icon-512.png`] },
  icons: { apple: "/lala/apple-icon.png" },
  // Smart App Banner only once the app is live.
  ...(SERENADA.IS_RELEASED ? { itunes: { appId: SERENADA.appId } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#15120f" },
  ],
  colorScheme: "light dark",
};

/** Example songs made with the app's own engine and settings (1 minute, best of 3 takes by words actually sung;
 * long intros trimmed for the web). Sources: VocalSongApp/work/examples-v3/listen. */
const examples: SerenadaExample[] = [
  {
    id: "cat-en",
    title: "Luna, 5 AM",
    forName: "",
    style: "Pop",
    voice: "Female",
    language: "en",
    languageName: "English",
    about: "My cat Luna, who screams at 5 am. Upbeat pop, sung like a love song to a tiny alarm clock.",
    lyrics:
      "[verse]\nLuna screams at five a.m.\nEvery morning, here we go again\nShe wants her breakfast, wants it now\nA tiny tiger shouting meow\n\n[chorus]\nOh Luna, Luna, let me sleep\nFive more minutes, not a peep\nYou rule this house, we both know why\nMy little alarm clock with green eyes\n\n[verse]\nShe knocks the cup right off the shelf\nAnd looks so proud of her own self\nI give up, I'm out of bed\nThe queen is purring, she's been fed\n\n[chorus]\nOh Luna, Luna, let me sleep\nFive more minutes, not a peep",
    palette: ["#1F6F6B", "#F2B632", "#E8452C", "#F6EFE3"],
    src: "/lala/examples/cat-en.m4a",
  },
  {
    id: "pizza-en",
    title: "The Last Slice",
    forName: "",
    style: "Ballad",
    voice: "Female",
    language: "en",
    languageName: "English",
    about: "The last slice of pizza, as a heartbreak piano ballad.",
    lyrics:
      "[verse]\nThere it lies in the open box\nOne last slice, and the kitchen clock\nYou looked at me, I looked at you\nWe both knew what we had to do\n\n[chorus]\nOh, last slice of pizza\nYou were never meant to stay\nI said take it, I'm not hungry\nThen I cried and looked away\n\n[verse]\nPepperoni, cheese and gold\nSome love stories don't get old",
    palette: ["#E58FA0", "#E8452C", "#F2B632", "#1B1712"],
    src: "/lala/examples/pizza-en.m4a",
  },
  {
    id: "montag-de",
    title: "Montag",
    forName: "",
    style: "Rock",
    voice: "Male",
    language: "de",
    languageName: "German",
    about: "Monday. Again. A German rock song about a cold coffee, a missed bus and ten urgent emails.",
    lyrics:
      "[verse]\nMontag früh, der Wecker schreit\nIch bin noch lange nicht bereit\nDer Kaffee kalt, der Bus ist weg\nMein Hemd hat einen großen Fleck\n\n[chorus]\nMontag, Montag, lass mich in Ruh\nIch mach die Augen wieder zu\nMorgen wird es besser sein\nHeute bleib ich lieber klein\n\n[verse]\nIm Büro brennt schon das Licht\nDer Chef will heute ein Gesicht\nZehn Mails, die alle dringend sind\nUnd draußen pfeift ein kalter Wind\n\n[chorus]\nMontag, Montag, lass mich in Ruh\nIch mach die Augen wieder zu\nMorgen wird es besser sein",
    palette: ["#1B1712", "#E8452C", "#F2B632", "#F6EFE3"],
    src: "/lala/examples/montag-de.m4a",
  },
  {
    id: "pablo-es",
    title: "Ay, Pablo",
    forName: "",
    style: "Reggaeton",
    voice: "Male",
    language: "es",
    languageName: "Spanish",
    about: "My friend Pablo, who is always late. A Spanish reggaeton roast.",
    lyrics:
      "[verse]\nPablo siempre llega tarde\nDice que el tráfico arde\nSu reloj no sabe andar\nY el café se va a enfriar\n\n[chorus]\nAy Pablo, Pablo, dónde estás\nTe esperamos una hora más\nTe queremos, es verdad\nPero llega ya, por favor\n\n[verse]\nPierde llaves, pierde el tren\nPierde el móvil también\nSi la boda fuera hoy\nLlegaría mañana, yo me voy",
    palette: ["#F2B632", "#E8452C", "#1F6F6B", "#1B1712"],
    src: "/lala/examples/pablo-es.m4a",
  },
  {
    id: "legday-en",
    title: "Leg Day",
    forName: "",
    style: "Hip-hop",
    voice: "Male",
    language: "en",
    languageName: "English",
    about: "Leg day, no excuses. A hip-hop gym anthem for anyone who will take the lift tomorrow.",
    lyrics:
      "[verse]\nAlarm at six and I'm already up\nProtein shake in a plastic cup\nEverybody's skipping, I don't care\nSquat rack waiting, see me there\n\n[chorus]\nLeg day, no excuses\nHeavy on the bar and I don't lose this\nTomorrow every stair's a mountain\nToday I'm a legend, keep counting\n\n[verse]\nTen more reps and my legs are shaking\nCoach is yelling and the floor is quaking\nChicken legs are history",
    palette: ["#1B1712", "#F2B632", "#E8452C", "#F6EFE3"],
    src: "/lala/examples/legday-en.m4a",
  },
  {
    id: "anime-ja",
    title: "チャイムが鳴る前に",
    forName: "",
    style: "Anime",
    voice: "Female",
    language: "ja",
    languageName: "Japanese",
    about: "“Before the bell rings”: late for school with toast in your mouth, as an anime opening.",
    lyrics:
      "[verse]\n目覚ましが鳴らない朝\nパンをくわえて走り出す\n信号は全部赤なのに\n心はずっと青信号\n\n[chorus]\n遅刻ギリギリ 全力で\n風を切って 飛んでいけ\n今日の私は 止まらない\nチャイムが鳴る前に\n\n[verse]\n曲がり角で ぶつかって\n運命なんて 信じない\n宿題は家に忘れたけど\n夢だけは 持ってきた\n\n[chorus]\n遅刻ギリギリ 全力で\n風を切って 飛んでいけ\n今日の私は 止まらない\nチャイムが鳴る前に",
    palette: ["#E8452C", "#F6EFE3", "#1F6F6B", "#F2B632"],
    src: "/lala/examples/anime-ja.m4a",
  },
];

const steps = [
  {
    n: "1",
    title: "Type an idea",
    text: "One line is enough: your cat, your job, a birthday. Add a name and it gets sung in the chorus. Or tap one of the ready ideas, or paste a chat or a poem.",
    shot: "/lala/screens/03-create.webp",
    alt: "Lala create screen: 'What's the song about?' with an idea field and idea cards Birthday, Birthday roast, My pet, Text to song, Love song, My day",
  },
  {
    n: "2",
    title: "Lala writes and sings it",
    text: "Lyrics are drafted on your iPhone, and you can change every word. In some languages you write the words yourself. Then the song is sung with real vocals: female, male or a duet, in the style and language you pick.",
    shot: "/lala/screens/10-lyrics.webp",
    alt: "Lala lyrics screen: big serif lyric lines over the song's cover colour",
  },
  {
    n: "3",
    title: "Send it",
    text: "One tap makes a lyric video with the song's cover, ready for WhatsApp, Stories or Reels. Or send just the audio. Every song is saved in My Songs.",
    shot: "/lala/screens/06-player-example.webp",
    alt: "Lala player: 'Happy Birthday, Mia' on a turntable, with the lyrics and a 'Send to Mia' button",
  },
];

const languages = [
  "English", "German", "Bulgarian", "Spanish", "French", "Italian", "Portuguese", "Dutch", "Polish",
  "Romanian", "Greek", "Turkish", "Ukrainian", "Russian", "Swedish", "Japanese", "Korean", "Chinese",
  "Hindi", "Indonesian", "Vietnamese", "Thai", "Arabic",
];

const faq: { q: string; a: React.ReactNode }[] = [
  {
    q: "Does it really run on my iPhone?",
    a: (
      <>
        Yes. The singing model runs on your iPhone&rsquo;s chip; no server makes your song. On first
        launch Lala downloads its music studio once (about 2.6 GB, Wi-Fi recommended; the app
        tells you the size before it starts). After that it works offline. On an iPhone 17 Pro a
        1-minute song takes about 20 seconds.
      </>
    ),
  },
  {
    q: "Which iPhones does it work on?",
    a: (
      <>
        iPhone 15 Pro and newer, with iOS 26 or later. Singing a song needs the memory and chip of
        these iPhones, so the App Store won&rsquo;t offer Lala on older models.
      </>
    ),
  },
  {
    q: "Is it private?",
    a: (
      <>
        Yes. There is no account. Names, the things you write about someone, lyrics and songs are
        made and kept on your iPhone and are never uploaded. The app can send anonymous usage
        statistics (a new random ID each launch, never your words or songs), and you can switch that
        off in Settings. Details in the{" "}
        <Link href={SERENADA.privacyPath} className="font-semibold text-sr-verm underline-offset-2 hover:underline">
          privacy policy
        </Link>
        .
      </>
    ),
  },
  {
    q: "How long can a song be?",
    a: (
      <>
        Free songs are up to 1 minute. With the one-time unlock you can make songs of 2, 3, 5 or 10
        minutes. Long songs take a few minutes to make, and Lala needs to stay open while it sings.
      </>
    ),
  },
  {
    q: "Does it sing my lyrics word for word?",
    a: (
      <>
        Mostly, but not always. Like every AI singer, it sometimes skips or changes a few words, and
        every take is a little different. If a line matters, make another take or keep the lyrics short.
      </>
    ),
  },
  {
    q: "Are my chats uploaded?",
    a: (
      <>
        No. Text you type or paste is turned into a song on your iPhone. No server reads it. You can
        check: switch on airplane mode and make a song.
      </>
    ),
  },
  {
    q: "Which languages can it sing?",
    a: <>Lala sings in 23 languages: {languages.join(", ")}. You can also write your own lyrics in any of them.</>,
  },
  {
    q: "How much does it cost?",
    a: (
      <>
        Free: 3 new songs a day, up to 1 minute each, forever. New takes and redos of a song
        don&rsquo;t count. One purchase of {SERENADA.price} (or the local price in your country)
        unlocks unlimited songs up to 10 minutes and lyric videos without the Lala end card. No
        subscription, no credits.
      </>
    ),
  },
  {
    q: "Can I use the songs anywhere?",
    a: (
      <>
        The songs are yours to share and use. They are marked as AI-generated in the audio file and
        in the lyric videos. Please don&rsquo;t use them to imitate real artists or pass them off as
        human recordings; Lala won&rsquo;t sing &ldquo;in the voice of&rdquo; a real singer.
      </>
    ),
  },
  {
    q: "Which AI model sings?",
    a: (
      <>
        ACE-Step 1.5, an open-source music model. Its makers say it was trained on licensed,
        royalty-free and synthetic music. Lala runs it on your iPhone, adapted for Apple silicon.
      </>
    ),
  },
  {
    q: "When can I get it?",
    a: SERENADA.IS_RELEASED ? (
      <>It&rsquo;s on the App Store now.</>
    ) : (
      <>
        Lala is in testing now. Want to try it early on TestFlight? Email{" "}
        <a href={SERENADA.waitlistMailto} className="font-semibold text-sr-verm underline-offset-2 hover:underline">
          {CONTACT_EMAIL}
        </a>{" "}
        with your iPhone model and you&rsquo;ll get an invite when testing opens up.
      </>
    ),
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: SERENADA.storeName,
  applicationCategory: "MusicApplication",
  operatingSystem: "iOS 26 or later",
  url: PAGE_URL,
  description:
    "Type anything and hear it sung. Songs with real vocals, made fully on your iPhone. 23 languages, no account, no credits, one-time purchase.",
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "Murmur Apps", url: `${SITE_URL}/` },
};

function PrimaryCta({ className = "" }: { className?: string }) {
  const base =
    "inline-flex items-center justify-center rounded-full bg-sr-verm px-7 py-4 text-base font-bold text-sr-on-verm transition-opacity hover:opacity-90";
  return SERENADA.IS_RELEASED ? (
    <a href={SERENADA.appStoreUrl} target="_blank" rel="noopener noreferrer" className={`${base} ${className}`}>
      Download on the App Store
    </a>
  ) : (
    <a href={SERENADA.waitlistMailto} className={`${base} ${className}`}>
      Join the TestFlight
    </a>
  );
}

export default function SerenadaPage() {
  return (
    <div className="theme-serenada flex min-h-screen flex-col bg-sr-paper text-sr-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-40 border-b border-sr-line bg-sr-paper/90 backdrop-blur-md">
        <div className="page-shell flex items-center justify-between gap-4 py-3">
          <Link href={SERENADA.path} className="flex items-center gap-2.5">
            <img src="/lala/icon.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-[28%]" />
            <span className="font-serif text-xl font-extrabold tracking-tight">Lala</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-sr-ink-soft sm:gap-6" aria-label="Lala">
            <Link href="/" className="hidden transition-colors hover:text-sr-verm md:inline">
              ← All apps
            </Link>
            <a href="#examples" className="hidden transition-colors hover:text-sr-verm sm:inline">
              Examples
            </a>
            <a href="#how" className="hidden transition-colors hover:text-sr-verm sm:inline">
              How it works
            </a>
            <a href="#faq" className="hidden transition-colors hover:text-sr-verm sm:inline">
              FAQ
            </a>
            <a
              href={SERENADA.IS_RELEASED ? SERENADA.appStoreUrl : SERENADA.waitlistMailto}
              className="rounded-full bg-sr-verm px-4 py-2 text-sm font-bold text-sr-on-verm transition-opacity hover:opacity-90"
            >
              {SERENADA.IS_RELEASED ? "Get the app" : "Join TestFlight"}
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="page-shell grid grid-cols-1 items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="sr-stamp-sm inline-flex -rotate-1 rounded-md border-2 border-sr-ink bg-sr-mari px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#1b1712]">
              Sung on your iPhone
            </p>
            <h1 className="mt-6 font-serif text-[2.9rem] font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
              Type anything. Hear it sung.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sr-ink-soft sm:text-xl">
              Your cat, your Monday, your best friend&rsquo;s birthday. Type one line and Lala sings
              it, with real vocals, right on your iPhone. No credits, no account, and your words never
              leave the phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta />
              <a
                href="#examples"
                className="inline-flex items-center justify-center rounded-full border-2 border-sr-ink px-7 py-3.5 text-base font-bold transition-colors hover:bg-sr-ink/5"
              >
                Hear example songs
              </a>
            </div>
            <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-sr-ink-soft">
              {SERENADA.IS_RELEASED ? "On the App Store" : "Coming soon to the App Store"} · iPhone 15 Pro and newer
            </p>
            {!SERENADA.IS_RELEASED && (
              <p className="mt-1.5 text-xs text-sr-ink-soft">Join the TestFlight opens an email. Tell us your iPhone model.</p>
            )}
          </div>
          <div className="mx-auto w-full max-w-[300px] lg:max-w-[340px]">
            <PhoneShot
              src="/lala/screens/01-welcome.webp"
              alt="Lala welcome screen: 'A song about anything. Or anyone.', with example songs for Mia, Lena and others, and a 'Make my first song' button"
              className="rotate-2 shadow-[10px_10px_0_0_var(--sr-ink)]"
              priority
            />
          </div>
        </section>

        {/* EXAMPLES */}
        <section id="examples" className="scroll-mt-20 border-y border-sr-line bg-sr-card/60">
          <div className="page-shell py-16 sm:py-24">
            <div className="mb-10 max-w-2xl sm:mb-14">
              <h2 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Hear what it makes</h2>
              <p className="mt-4 text-lg leading-relaxed text-sr-ink-soft">
                Real songs made with Lala&rsquo;s engine on a Mac, with the same settings as the app:
                a cat, a pizza, a Monday, a late friend, leg day and an anime-style school morning.
              </p>
            </div>
            <SerenadaExamples examples={examples} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="page-shell scroll-mt-20 py-16 sm:py-24">
          <h2 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Three steps to a song</h2>
          <ol className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col">
                <span className="sr-stamp-sm flex h-11 w-11 items-center justify-center rounded-full border-2 border-sr-ink bg-sr-mari font-serif text-xl font-extrabold text-[#1b1712]">
                  {s.n}
                </span>
                <h3 className="mt-5 font-serif text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-sr-ink-soft sm:text-base">{s.text}</p>
                <PhoneShot src={s.shot} alt={s.alt} className="mx-auto mt-8 w-full max-w-[260px]" />
              </li>
            ))}
          </ol>
        </section>

        {/* TEXT TO SONG */}
        <section className="border-y border-sr-line bg-sr-card/60">
          <div className="page-shell grid grid-cols-1 items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-sr-verm">Text to song</p>
              <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Paste a chat. Hear it sung.</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-sr-ink-soft">
                Paste a chat, a poem or a note and Lala sings it. Other song apps send your text to
                their servers. Lala can&rsquo;t: the song is made on your iPhone, even in airplane mode.
              </p>
            </div>
            <ul className="space-y-3 text-[15px] leading-relaxed text-sr-ink-soft">
              <li className="rounded-2xl border border-sr-line bg-sr-paper p-4"><span className="font-semibold text-sr-ink">Sam:</span> did you take my charger again</li>
              <li className="rounded-2xl border border-sr-line bg-sr-paper p-4"><span className="font-semibold text-sr-ink">Alex:</span> borrowed. big difference</li>
              <li className="rounded-2xl border border-sr-line bg-sr-paper p-4"><span className="font-semibold text-sr-ink">Sam:</span> that&rsquo;s the third one this month</li>
            </ul>
          </div>
        </section>

        {/* PRICE */}
        <div className="pt-16 sm:pt-24" />
        <section className="page-shell pb-16 sm:pb-24">
          <div className="sr-stamp grid grid-cols-1 gap-8 rounded-[28px] border-2 border-sr-ink bg-sr-card p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-sr-verm">No credits. No subscription.</p>
              <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">
                Pay once. Sing forever.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-sr-ink-soft">
                Most song apps sell credits or subscriptions, because their servers cost money for
                every song. Lala sings on your iPhone, so there is nothing to meter.
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sr-line bg-sr-paper p-5">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-sr-ink-soft">Free</dt>
                <dd className="mt-2 font-serif text-2xl font-extrabold">€0</dd>
                <dd className="mt-2 text-sm leading-relaxed text-sr-ink-soft">
                  3 new songs a day, up to 1 minute each. Forever.
                </dd>
              </div>
              <div className="rounded-2xl border-2 border-sr-verm bg-sr-paper p-5">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-sr-verm">Unlock, once</dt>
                <dd className="mt-2 font-serif text-2xl font-extrabold">{SERENADA.price}</dd>
                <dd className="mt-2 text-sm leading-relaxed text-sr-ink-soft">
                  Unlimited songs up to 10 minutes, and lyric videos without the end card. One payment.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-sr-line bg-sr-card/60">
          <div className="page-shell max-w-4xl py-16 sm:py-24">
            <h2 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Questions</h2>
            <div className="mt-10 divide-y divide-sr-line border-y border-sr-line">
              {faq.map((item, i) => (
                <details key={item.q} className="group py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-bold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-sr-ink text-lg leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-3 max-w-3xl text-base leading-relaxed text-sr-ink-soft">{item.a}</div>
                </details>
              ))}
            </div>

            <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-2xl font-bold">Want it before everyone else?</p>
              <PrimaryCta />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="serenada" />
    </div>
  );
}
