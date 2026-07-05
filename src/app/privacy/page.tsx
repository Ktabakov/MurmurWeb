import type { Metadata } from "next";
import Link from "next/link";
import { MurmurMark } from "@/components/murmur-mark";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Murmur handles your data. Music generation runs entirely on your device; we collect only what is needed to deliver your purchase and protect our models.",
  alternates: { canonical: "https://murmurapps.com/privacy/" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 5, 2026";
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

        <Section title="On-device by default">
          <p>
            Music generation runs entirely on your iPhone. The prompts you type, the moods you
            describe, and the music you create are processed and stored on your device. We don’t
            collect, transmit, or store your prompts or generated audio on our servers.
          </p>
        </Section>

        <Section title="Information we collect">
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>
              <span className="font-semibold text-murmur-text">Purchases.</span> When you buy Murmur
              Pro, the purchase is processed by Apple and managed through our payments provider,
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
            recognition to convert your speech to text. We don’t store your voice recordings.
          </p>
        </Section>

        <Section title="Model downloads">
          <p>
            The first time you generate music, the app downloads AI model files from our content
            servers over an encrypted connection. These are standard network requests and contain no
            personal information beyond the device verification described above.
          </p>
        </Section>

        <Section title="How we use data">
          <p>
            We use this limited data only to operate the app: to deliver and restore your Pro
            purchase, and to protect and deliver our models. We don’t use your data for advertising
            or tracking, and we don’t sell your data.
          </p>
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
          </ul>
        </Section>

        <Section title="Data retention">
          <p>
            Purchase and device-verification records are kept only as long as needed to provide the
            service and to meet legal and accounting requirements.
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
            your purchase or device identifier. Contact us and we’ll assist.
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
