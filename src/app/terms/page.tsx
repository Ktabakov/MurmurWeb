import type { Metadata } from "next";
import Link from "next/link";
import { MurmurMark } from "@/components/murmur-mark";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you download or use Murmur, including how royalty-free generated music works and what Murmur Pro unlocks.",
  alternates: { canonical: "https://murmurapps.com/terms/" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "July 10, 2026";
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

export default function TermsPage() {
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
          <span className="hero-gradient-text">Terms of Service</span>
        </h1>
        <p className="mt-3 text-sm text-murmur-muted">Last updated: {LAST_UPDATED}</p>

        <p className="mt-8 text-sm leading-relaxed text-murmur-text-2 sm:text-base">
          These Terms govern your download and use of Murmur (&ldquo;the app,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;). By downloading, installing, or using Murmur, you agree to these Terms —
          there is no separate in-app acceptance step. If you don&rsquo;t agree, don&rsquo;t use the app.
        </p>

        <Section title="What Murmur does">
          <p>
            Murmur generates original instrumental music on your device using on-device AI models,
            including Magenta RealTime, Magenta RealTime 2, MusicCoCa, and SpectroStream — released by
            Google LLC and used here under their published license terms (CC-BY-4.0 for model weights;
            full attribution is listed in the app under Settings → Open Source Licenses). Generation
            happens locally on your iPhone; we don&rsquo;t render your music on a server.
          </p>
        </Section>

        <Section title="Ownership and rights in the music you generate">
          <p>
            Neither Murmur nor the underlying model providers claim any ownership over the tracks you
            generate. You&rsquo;re free to use them.
          </p>
          <p>
            &ldquo;Royalty-free&rdquo; means no one is owed a licensing fee for the music you generate
            with Murmur — not us, not the model providers. It does not mean you automatically hold
            exclusive copyright in the output. Under current copyright law in the United States and
            similar frameworks elsewhere, a musical work generated primarily from a prompt or preset,
            without meaningful further human creative work on top of it, generally isn&rsquo;t eligible
            for copyright protection on its own. If you want to claim authorship over a track, you
            should meaningfully edit, arrange, or build on the generated audio yourself.
          </p>
          <p>
            Because Murmur&rsquo;s models are trained on large collections of real music, there is a
            small possibility that a generated track closely resembles an existing composition, or
            resembles output another Murmur user separately generated. We don&rsquo;t control, and
            can&rsquo;t promise the behavior of, third-party content-matching systems (like YouTube&rsquo;s
            Content ID) that other services apply to your uploads. A false or mistaken match from such a
            system is a third-party platform issue, not a rights violation by you, and is typically
            disputable through that platform&rsquo;s own process. You are solely responsible for how you
            use anything you generate, and for resolving any dispute a third-party platform raises about
            it.
          </p>
        </Section>

        <Section title="Free tier and Murmur Pro">
          <ul className="list-disc space-y-2 pl-5 marker:text-lilac/60">
            <li>
              <span className="font-semibold text-murmur-text">Every track you generate is
              royalty-free</span> — free tier and Pro alike. There is no difference in the rights status
              of the audio itself between the two.
            </li>
            <li>
              <span className="font-semibold text-murmur-text">Murmur Pro</span> is a one-time,
              lifetime purchase that unlocks unlimited track length, the full preset library, custom
              scene prompts, Live mode, WAV export, and advanced generation controls. It is a feature
              unlock, not a change in the legal status of your output.
            </li>
            <li>
              Purchases are processed by Apple and managed through our payments provider, RevenueCat, as
              described in our{" "}
              <Link href="/privacy/" className="text-lilac underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              . Refunds are handled by Apple under the App Store&rsquo;s own refund policy — we don&rsquo;t
              process refunds directly.
            </li>
          </ul>
        </Section>

        <Section title="Acceptable use">
          <p>
            Use Murmur responsibly. Don&rsquo;t use it to generate content that infringes or violates the
            rights of others, and don&rsquo;t attempt to circumvent, reverse-engineer, or abuse the app,
            its models, or its purchase system.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            Murmur and the music it generates are provided &ldquo;as is,&rdquo; without warranties of any
            kind, express or implied, including any warranty that generated output is free of any
            third-party rights or that it will be accepted without dispute on any platform you upload it
            to.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, Murmur is not liable for any indirect, incidental, or
            consequential damages arising from your use of the app or of any music you generate with it,
            including demonetization, takedowns, or disputes on third-party platforms.
          </p>
        </Section>

        <Section title="Changes to these Terms">
          <p>
            We may update these Terms from time to time; material changes will be reflected by the
            &ldquo;Last updated&rdquo; date above. Continued use of the app after a change means you
            accept the updated Terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these Terms? Email{" "}
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
