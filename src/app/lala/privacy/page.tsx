import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { CONTACT_EMAIL, SERENADA, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Lala" },
  description:
    "How Lala handles your data. Songs are written and sung on your iPhone: no account, and names, lyrics and songs never leave your device. Optional anonymous usage statistics only.",
  alternates: { canonical: `${SITE_URL}/lala/privacy/` },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#15120f" },
  ],
  colorScheme: "light dark",
};

/**
 * Written from the app's code (2026-11-13; RevenueCat + signed download links added 2026-11-19): Model/Analytics.swift, Engine/ModelStore.swift, Model/Purchases.swift,
 * Model/LyricsHelper.swift, Engine/SongEngine.swift, Screens/ShareVideo.swift. Update it whenever the app starts
 * sending or storing anything new (new SDK, crash reporting, accounts, notifications, cloud features).
 */
const LAST_UPDATED = "November 19, 2026";

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="mt-10 scroll-mt-20" id={id}>
      <h2 className="font-serif text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-sr-ink-soft sm:text-base [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-sr-ink [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="font-semibold text-sr-verm underline-offset-2 hover:underline"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function SerenadaPrivacyPage() {
  return (
    <div className="theme-serenada flex min-h-screen flex-col bg-sr-paper text-sr-ink">
      <header className="border-b border-sr-line">
        <div className="page-shell flex items-center justify-between gap-4 py-3">
          <Link href={SERENADA.path} className="flex items-center gap-2.5">
            <img src="/lala/icon.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-[28%]" />
            <span className="font-serif text-xl font-extrabold tracking-tight">Lala</span>
          </Link>
          <Link href={SERENADA.path} className="text-sm font-semibold text-sr-ink-soft transition-colors hover:text-sr-verm">
            ← Back to Lala
          </Link>
        </div>
      </header>

      <main className="page-shell max-w-3xl flex-1 py-14 sm:py-20">
        <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-wider text-sr-ink-soft">
          Lala for iPhone · Last updated: {LAST_UPDATED}
        </p>

        <p className="mt-8 text-base leading-relaxed text-sr-ink-soft">
          Lala (&ldquo;the app&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) writes and sings songs on your
          iPhone. This policy explains what the app handles and what, if anything, leaves your device.
          The website murmurapps.com is covered in the{" "}
          <A href="/privacy/#website">Murmur privacy policy</A>, section &ldquo;This website&rdquo;.
        </p>

        <Section title="Who is responsible">
          <p>
            The controller under the EU General Data Protection Regulation (GDPR) is Konstantin Tabakov,
            the independent developer of Lala and Murmur. Contact details: see the{" "}
            <A href="/impressum/">Impressum</A>. Email: <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
          </p>
        </Section>

        <Section title="The short version">
          <ul>
            <li>There is no account. We never ask for your name, email address or phone number.</li>
            <li>
              The names you type, the things you write about someone, the lyrics and the songs are made
              and stored on your iPhone. They are never uploaded to us or anyone else.
            </li>
            <li>
              The app can send anonymous usage statistics so a one-person studio can see what breaks. You
              can switch that off in Settings at any time.
            </li>
            <li>
              No ads, no ad tracking, no data sold. Purchases go through Apple and are recorded
              anonymously with RevenueCat.
            </li>
          </ul>
        </Section>

        <Section title="What stays on your iPhone">
          <p>
            Everything you put into a song: the person&rsquo;s name, the occasion, the facts you add, your
            own words and lyrics, and your style, voice and language choices. The song itself, its cover,
            its lyric timing and any lyric video are created on the device by the app&rsquo;s music model
            and saved in the app&rsquo;s storage on your iPhone. Deleting a song, or the app, deletes them.
          </p>
          <p>
            <strong>Lyrics drafting.</strong> When Lala drafts lyrics for you, it uses built-in
            templates or, where your iPhone supports it, Apple&rsquo;s on-device language model (Apple
            Intelligence). Both run on the device; the text is not sent to us.
          </p>
          <p>
            <strong>Sharing.</strong> When you tap Send or Share, iOS shows its share sheet and you decide
            where the song or video goes (for example WhatsApp or Messages). From then on, that app&rsquo;s
            own privacy policy applies. We don&rsquo;t receive a copy.
          </p>
          <p>
            <strong>Live Activities.</strong> Download and song progress on the Lock Screen and in the
            Dynamic Island are local; no push server is involved.
          </p>
        </Section>

        <Section title="Anonymous usage statistics (optional)" id="analytics">
          <p>
            To find failed downloads, failed songs and confusing screens, Lala sends usage events to
            PostHog, hosted in the EU (Frankfurt). This is on by default and you can switch it off at any
            time under <strong>Settings → Privacy → &ldquo;Share anonymous usage data&rdquo;</strong>. After
            that, nothing more is sent. The only thing stored for this is your on/off choice.
          </p>
          <p>Each event carries:</p>
          <ul>
            <li>
              <strong>A random ID for this app launch.</strong> It exists only in memory and is new every
              time the app starts, so events from different days can&rsquo;t be linked to each other or to
              you. No user profile is created.
            </li>
            <li>
              <strong>Device and app facts:</strong> iPhone model, memory size, iOS version, app version and
              build, region and language settings, the install channel (App Store or TestFlight) and
              whether the app has been unlocked.
            </li>
            <li>
              <strong>The event itself,</strong> for example &ldquo;download started&rdquo;, &ldquo;song
              finished&rdquo; (with a rounded duration), &ldquo;song failed&rdquo;, &ldquo;paywall shown&rdquo;,
              &ldquo;purchase completed&rdquo; or &ldquo;shared&rdquo;, with simple details such as the chosen
              style, voice, language and length, how many songs are in the app, free storage space in GB,
              download progress, and a shortened technical error message when something fails.
            </li>
          </ul>
          <p>
            <strong>Events never carry</strong> names, the things you write about someone, lyrics, any
            free text, audio, videos, your contacts or your location. PostHog discards IP addresses and
            does not store them with the events. The app identifies itself with a User-Agent header naming
            the app version, device model and iOS version. Statistics are not used for advertising or
            profiling, and not sold or shared with data brokers.
          </p>
        </Section>

        <Section title="Crash reports">
          <p>
            Lala contains no third-party crash-reporting software. If you have chosen to share
            analytics with app developers in your iPhone&rsquo;s settings (Settings → Privacy &amp;
            Security → Analytics &amp; Improvements), Apple may give us anonymous crash reports, under
            Apple&rsquo;s privacy policy.
          </p>
        </Section>

        <Section title="Downloading the music studio">
          <p>
            The music model (about 2.6 GB) is downloaded once after install instead of being shipped in
            the app. The app first asks our download server (Google Cloud Run) for time-limited download
            links, sending only the list of model files it needs. The files then come from Cloudflare R2
            object storage over an encrypted connection. Like any web server, Google Cloud and Cloudflare
            see your IP address and standard request data (time, file, app version) while answering.
            Nothing about you or your songs is sent. You choose whether the download may use mobile data.
          </p>
        </Section>

        <Section title="Purchases">
          <p>
            The one-time unlock is sold through Apple&rsquo;s App Store (StoreKit). Apple handles payment
            and your Apple Account; we never see your name, email or payment details. The app checks
            the purchase with Apple on the device to unlock features and to restore them on a new iPhone.
            Apple sends us anonymous sales reports.
          </p>
          <p>
            We also use <strong>RevenueCat</strong> to keep track of sales. When you buy or restore the
            unlock, the app sends RevenueCat the App Store purchase record (product, price, currency, date,
            store country) together with a random ID that RevenueCat creates for this installation. That ID
            is not linked to your name, email or Apple Account, and it is not used for advertising or
            tracking. The unlock itself is still checked with Apple on your iPhone, so it works offline.
          </p>
        </Section>

        <Section title="AI-generated content">
          <p>
            Every song is made by an AI model (ACE-Step 1.5) running on your iPhone. To be open about
            that, as the EU AI Act asks of AI-generated content, Lala marks it: the audio file&rsquo;s
            metadata says it is AI-generated, and lyric videos show a visible &ldquo;AI-generated song&rdquo;
            label and carry the same note in their metadata. Please keep these marks when you share songs,
            and don&rsquo;t present them as recordings of real people.
          </p>
          <p>
            The app blocks requests to sing &ldquo;in the voice of&rdquo; real artists. These checks run on
            the device; your text is not sent anywhere.
          </p>
        </Section>

        <Section title="What Lala doesn&rsquo;t do">
          <ul>
            <li>It doesn&rsquo;t upload your names, lyrics, songs or videos.</li>
            <li>It doesn&rsquo;t ask for your contacts, photos, microphone, location or calendar.</li>
            <li>It contains no advertising SDKs and shows no ads.</li>
            <li>
              It doesn&rsquo;t track you across other companies&rsquo; apps or websites; there is no App
              Tracking Transparency prompt because there is nothing to ask.
            </li>
            <li>It doesn&rsquo;t sell or rent your data.</li>
          </ul>
        </Section>

        <Section title="Service providers">
          <ul>
            <li>Apple: App Store, in-app purchase, Live Activities and the on-device language model.</li>
            <li>
              RevenueCat: records of in-app purchases.{" "}
              <A href="https://www.revenuecat.com/privacy">Their privacy policy</A>.
            </li>
            <li>
              Google Cloud: the server that hands out download links for the music model.{" "}
              <A href="https://cloud.google.com/terms/cloud-privacy-notice">Their privacy notice</A>.
            </li>
            <li>
              PostHog: anonymous usage statistics, hosted in the EU.{" "}
              <A href="https://posthog.com/privacy">Their privacy policy</A>.
            </li>
            <li>
              Cloudflare: storage and delivery of the music model files.{" "}
              <A href="https://www.cloudflare.com/privacypolicy/">Their privacy policy</A>.
            </li>
          </ul>
        </Section>

        <Section title="Legal bases (GDPR Art. 6)">
          <ul>
            <li>
              <strong>Downloading the model, unlocking purchases and recording them:</strong> providing the app you asked
              for (Art. 6(1)(b)); keeping sales records: legal obligations under tax law (Art. 6(1)(c)).
            </li>
            <li>
              <strong>Usage statistics:</strong> our legitimate interest in finding and fixing problems
              (Art. 6(1)(f)). No identifier is stored on your device for this, and you can switch it off at
              any time (Art. 21).
            </li>
          </ul>
        </Section>

        <Section title="Transfers outside the EU">
          <p>
            Cloudflare, Google, RevenueCat and Apple are based in the United States, so data may be processed there. These
            transfers rely on the EU–U.S. Data Privacy Framework where the provider is certified, and
            otherwise on the European Commission&rsquo;s Standard Contractual Clauses (Art. 46 GDPR).
            PostHog data is hosted in the EU.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            Your songs stay on your iPhone until you delete them. Usage events are kept only as long as
            needed to improve the app; Cloudflare keeps standard delivery logs for a short time under its
            own policy. Purchase records are kept as long as tax law requires.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Lala isn&rsquo;t directed to children under 13 and doesn&rsquo;t knowingly collect personal
            information from children.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under the GDPR you have the right to access your data (Art. 15), to have it corrected (Art. 16)
            or deleted (Art. 17), to restrict its processing (Art. 18), to data portability (Art. 20), to
            object to processing based on legitimate interests (Art. 21), and to withdraw consent at any
            time (Art. 7(3)). Email us to use any of them. Because there is no account and usage events
            carry no lasting ID, we usually can&rsquo;t tell which data is yours; we will still answer
            every request.
          </p>
          <p>
            You can also lodge a complaint with a data protection supervisory authority (Art. 77), in
            particular in the EU country where you live or work.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If the app starts handling data differently, we will update this page and the date at the top
            before that version is released.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Email <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
          </p>
        </Section>
      </main>

      <SiteFooter variant="serenada" />
    </div>
  );
}
