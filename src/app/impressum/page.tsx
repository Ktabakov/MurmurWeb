import type { Metadata } from "next";
import Link from "next/link";
import { MurmurMark } from "@/components/murmur-mark";

export const metadata: Metadata = {
  title: "Impressum · Legal notice",
  description: "Impressum (legal notice) for murmurapps.com and the Murmur app, according to § 5 DDG.",
  alternates: { canonical: "https://murmurapps.com/impressum/" },
  // Required to exist and be reachable, not to rank. Keeps the name/address out of search results.
  robots: { index: false, follow: true },
};

const NAME = "Konstantin Tabakov";
/**
 * Must be an address where legal documents can be served ("ladungsfähige Anschrift"): a street
 * address, NOT a P.O. box. A business-address / Impressum service is fine if it accepts and forwards
 * post for you. The page must not go live while this is empty.
 */
const ADDRESS_LINES: string[] = [
  // "c/o <Service name>",
  // "<Street and number>",
  // "<Postal code> <City>",
  // "Germany",
];
/** Optional: only if you have one (not needed as a Kleinunternehmer without a VAT ID). */
const VAT_ID: string | null = null;
const CONTACT_EMAIL = "murmurapps@gmail.com";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-bold tracking-tight text-lilac sm:text-lg">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-murmur-text-2 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function Address() {
  return (
    <p>
      {NAME}
      {ADDRESS_LINES.map((line) => (
        <span key={line}>
          <br />
          {line}
        </span>
      ))}
    </p>
  );
}

function Email() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-lilac underline-offset-2 hover:underline">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function ImpressumPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
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

      <main className="page-shell max-w-3xl flex-1 py-14 sm:py-20" lang="de">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          <span className="hero-gradient-text">Impressum</span>
        </h1>

        <Block title="Angaben gemäß § 5 DDG">
          <Address />
        </Block>

        <Block title="Kontakt">
          <p>
            E-Mail: <Email />
          </p>
        </Block>

        {VAT_ID && (
          <Block title="Umsatzsteuer-ID">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {VAT_ID}</p>
          </Block>
        )}

        <Block title="Verbraucherstreitbeilegung">
          <p>
            Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Block>

        <div lang="en" className="mt-14 border-t border-murmur-border pt-10">
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Legal notice</h2>
          <Block title="Provider (§ 5 DDG, German Digital Services Act)">
            <Address />
          </Block>
          <Block title="Contact">
            <p>
              Email: <Email />
            </p>
          </Block>
          <Block title="Consumer dispute resolution">
            <p>
              I am neither willing nor obliged to take part in dispute resolution proceedings before a
              consumer arbitration board.
            </p>
          </Block>
          <p className="mt-8 text-sm text-murmur-muted">
            See also the{" "}
            <Link href="/privacy/" className="text-lilac underline-offset-2 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms/" className="text-lilac underline-offset-2 hover:underline">
              Terms
            </Link>
            .
          </p>
        </div>
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
