import type { Metadata } from "next";
import Link from "next/link";
import { MurmurMark } from "@/components/murmur-mark";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Murmur handles your data. Music generation runs entirely on your device. We collect anonymous usage analytics and crash reports — never your prompts or your audio — and never for advertising.",
  alternates: { canonical: "https://murmurapps.com/privacy/" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "July 29, 2026";
const CONTACT_EMAIL = "murmurapps@gmail.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold tracking-tight text-lilac sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-murmur-text-2 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-murmur-border">
        <div className="page-shell flex items-center justify-between py-4 sm:py-5">
          <Link href="/" className="flex items-center gap-3">
            <MurmurMark size={32} />
            <span className="text-base font-black tracking-[0.3em] text-lilac">MURMUR</span>
          </Link>
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-murmur-muted transition-colors hover:text-lilac"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="page-shell max-w-3xl flex-1 py-14 sm:max-w-4xl sm:py-20 xl:max-w-5xl">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          <span className="hero-gradient-text">Privacy Policy</span>
        </h1>
        <p className="mt-3 text-sm text-murmur-muted">Last updated: {LAST_UPDATED}</p>

        <p className="mt-8 text-sm leading-relaxed text-murmur-text-2 sm:text-base">
          Murmur (“the app,” “we,” “us”) is an on-device AI music generation app, built to keep your
          creativity on your device. This policy explains what data the app handles.
        </p>

        <Section title="The short version">
          <p>
            Your music stays on your device. Every note Murmur generates is generated on your
            iPhone — your prompts, your style choices, and your saved tracks are never uploaded
            anywhere.
          </p>
          <p>
            Murmur <em>is</em> a normal app in one respect: it collects anonymous usage analytics
            and crash reports, so a one-person developer can see which features get used and what is
            breaking. That data is about <em>how the app is used</em>, never about{" "}
            <em>what you make</em>. There is no advertising, no ad tracking, and nothing is sold or
            shared with data brokers.
          </p>
        </Section>

        <Section title="What stays on your device">
          <p>
            Music generation runs entirely on your iPhone. The prompts you type, the moods you
            describe, the music you create, and the settings you choose are processed and stored on
            your device. We don’t collect, transmit, or store your prompts or generated audio on our
            servers. Deleting the app removes all of it.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            Murmur sends anonymous product-analytics events to PostHog, hosted in the EU. This
            exists so we can answer questions like “how many people give up during the first-run
            model download?” and “does anyone ever finish the tutorial?”
          </p>
          <p className="font-semibold text-murmur-text">Each event carries:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>
              <span className="font-semibold text-murmur-text">An anonymous device identifier</span>{" "}
              — a random string, not tied to your name, email, Apple ID, or any account. It’s stored
              in the iOS Keychain, which means it survives deleting and reinstalling the app. That’s
              deliberate: it stops one person’s reinstall from being counted as a dozen different
              people.
            </li>
            <li>
              <span className="font-semibold text-murmur-text">A session identifier</span>,
              regenerated every time the app launches.
            </li>
            <li>
              <span className="font-semibold text-murmur-text">Device and build facts</span> —
              device name and hardware model, iOS version, app version and build number, and whether
              the app is running in a simulator.
            </li>
            <li>
              <span className="font-semibold text-murmur-text">The event itself</span> — app opens;
              onboarding completion; the model download’s start, completion or failure (with
              duration and, on failure, a truncated error message); model load failures; Neural
              Engine compatibility fallbacks; storage fallbacks; paywall and upsell impressions;
              purchases, cancellations and restores; preset selections; generation and Live-session
              start and end; each step of the first-run tutorial; and taps on the demo sound bubbles
              during the download screen.
            </li>
          </ul>
          <p>
            <span className="font-semibold text-murmur-text">Events never carry</span> your prompt
            text, your generated audio, your saved library, file names, your location, or your
            contacts.
          </p>
          <p>
            As with any web request, PostHog’s servers see the IP address of the request, and the
            app identifies itself with a User-Agent header naming the app version, device and iOS
            version.
          </p>
          <p>
            <span className="font-semibold text-murmur-text">What it isn’t used for:</span>{" "}
            advertising, ad targeting, audience building, or profiling. There is no ad SDK in
            Murmur, no IDFA or App Tracking Transparency prompt, and no cross-app or cross-site
            tracking. Analytics data is not sold, rented, or shared with data brokers.
          </p>
        </Section>

        <Section title="Crash reporting">
          <p>
            Murmur uses Sentry for crash and error reporting, so crashes get fixed instead of going
            unnoticed. When the app crashes or hits an unhandled error, Sentry receives a diagnostic
            report: the error message and stack trace, the device model and iOS version, the app
            version, and the thread the error happened on.
          </p>
          <p>
            Performance tracing is switched off — Murmur sends crashes and errors, not a trace of
            your session. Sentry never receives your audio, your prompts, your library, or your
            files.
          </p>
        </Section>

        <Section title="Purchases and device verification">
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>
              <span className="font-semibold text-murmur-text">Purchases.</span> When you buy
              Murmur, the purchase is processed by Apple and managed through our payments provider,
              RevenueCat, to deliver and restore your purchase. This includes the transaction and a
              non-personal app-user identifier. It isn’t linked to your name or email.
            </li>
            <li>
              <span className="font-semibold text-murmur-text">Device verification.</span> To confirm
              the app is a genuine, unmodified copy and to protect our AI models from abuse, the app
              uses Apple’s App Attest service, which provides a per-installation device identifier.
              It’s used only to authorize model downloads and prevent misuse.
            </li>
          </ul>
          <p>
            We don’t require an account, and we don’t collect your name, email address, or contacts.
          </p>
        </Section>

        <Section title="Microphone and speech">
          <p>
            If you choose to dictate a prompt, Murmur uses your microphone and Apple’s speech
            recognition to convert your speech to text. We don’t store or upload your voice
            recordings. Note that Apple’s speech recognition may process the audio on Apple’s
            servers rather than on-device, under Apple’s own privacy policy — that step is Apple’s,
            not ours.
          </p>
        </Section>

        <Section title="Model downloads">
          <p>
            The AI models are large and are downloaded after install rather than shipped inside the
            app. The app asks a small server for a temporary signed download link, then downloads
            the model files from object storage over an encrypted connection. The servers involved
            see your IP address and standard request metadata, as any web server does. No prompt, no
            audio, and no library content is ever sent.
          </p>
        </Section>

        <Section title="Notifications">
          <p>
            Murmur can notify you when a long generation or the first-run download finishes. These
            are local notifications, scheduled on your device — there is no push server and no push
            token sent anywhere.
          </p>
        </Section>

        <Section title="Opting out">
          <p>
            There is currently{" "}
            <span className="font-semibold text-murmur-text">
              no in-app toggle to turn off analytics or crash reporting
            </span>
            . That’s an honest gap rather than a policy — it’s on the list to add. In the meantime,
            if you’d like your device’s analytics data deleted, email us and we’ll remove it.
          </p>
        </Section>

        <Section title="What Murmur doesn’t do">
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>It doesn’t record, upload, or analyze any audio you generate or save.</li>
            <li>It doesn’t read your prompts on a server — prompts never leave the device.</li>
            <li>It doesn’t track your location. There is no location permission.</li>
            <li>It doesn’t access your contacts, calendar, health data, or browsing history.</li>
            <li>It contains no advertising SDKs and shows no ads.</li>
            <li>It doesn’t track you across other companies’ apps or websites.</li>
            <li>It doesn’t sell or rent your data.</li>
          </ul>
        </Section>

        <Section title="Third-party services">
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>Apple — App Store, in-app purchases, App Attest, and speech recognition.</li>
            <li>
              RevenueCat — purchase management.{" "}
              <a
                href="https://www.revenuecat.com/privacy"
                className="text-lilac underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Their privacy policy
              </a>
              .
            </li>
            <li>
              PostHog — anonymous product analytics, EU-hosted.{" "}
              <a
                href="https://posthog.com/privacy"
                className="text-lilac underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Their privacy policy
              </a>
              .
            </li>
            <li>
              Sentry — crash and error reporting.{" "}
              <a
                href="https://sentry.io/privacy/"
                className="text-lilac underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Their privacy policy
              </a>
              .
            </li>
            <li>
              Google Cloud and Cloudflare — hosting for the model-download service and model file
              storage.
            </li>
          </ul>
        </Section>

        <Section title="Data retention">
          <p>
            Analytics events, crash reports, and purchase and device-verification records are kept
            only as long as needed to operate and improve the app and to meet legal and accounting
            requirements.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Murmur isn’t directed to children under 13 and doesn’t knowingly collect personal
            information from children.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on your region, you may have rights to access or delete data associated with
            your purchase, your device identifier, or your analytics events. Contact us and we’ll
            assist.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update this policy; material changes will be reflected by the “Last updated” date
            above.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-lilac underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>

      <footer className="border-t border-murmur-border bg-gradient-to-b from-transparent to-black/40">
        <div className="page-shell flex items-center justify-between py-8">
          <Link href="/" className="flex items-center gap-2">
            <MurmurMark size={24} />
            <span className="text-xs font-black tracking-[0.3em] text-lilac">MURMUR</span>
          </Link>
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-murmur-muted/70">
            © 2026 Murmur
          </p>
        </div>
      </footer>
    </div>
  );
}
