import Link from "next/link";
import { clsx } from "clsx";
import { CONTACT_EMAIL, MURMUR, SERENADA, STUDIO_NAME } from "@/lib/site";

type Variant = "studio" | "serenada" | "murmur";

/** Per-theme classes: the footer sits on three different page themes. */
const styles: Record<Variant, { wrap: string; head: string; link: string; text: string; line: string }> = {
  studio: {
    wrap: "border-st-line bg-st-surface-2/60",
    head: "text-st-ink",
    link: "text-st-ink-2 hover:text-st-accent",
    text: "text-st-muted",
    line: "border-st-line",
  },
  serenada: {
    wrap: "border-sr-line bg-sr-card",
    head: "text-sr-ink font-serif",
    link: "text-sr-ink-soft hover:text-sr-verm",
    text: "text-sr-ink-soft",
    line: "border-sr-line",
  },
  murmur: {
    wrap: "border-murmur-border bg-gradient-to-b from-transparent to-black/40",
    head: "text-white",
    link: "text-murmur-muted hover:text-lilac",
    text: "text-murmur-muted",
    line: "border-murmur-border",
  },
};

/** Shared footer for every page on murmurapps.com: both apps, every legal page, contact. */
export function SiteFooter({ variant = "studio" }: { variant?: Variant }) {
  const s = styles[variant];
  const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: "Apps",
      links: [
        { label: "Murmur", href: MURMUR.path },
        { label: SERENADA.IS_RELEASED ? "Lala" : "Lala (coming soon)", href: SERENADA.path },
        { label: "All apps", href: "/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Murmur privacy", href: MURMUR.privacyPath },
        { label: "Lala privacy", href: SERENADA.privacyPath },
        { label: "Murmur terms", href: "/terms/" },
        { label: "Impressum", href: "/impressum/" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, external: true },
        { label: "TikTok", href: "https://www.tiktok.com/@murmur0827", external: true },
        { label: "Instagram", href: "https://www.instagram.com/murmurmusicai", external: true },
      ],
    },
  ];

  return (
    <footer className={clsx("w-full border-t", s.wrap)}>
      <div className="page-shell grid grid-cols-1 gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr_1fr] sm:gap-8">
        <div>
          <Link href="/" className={clsx("text-sm font-black tracking-[0.3em]", s.head)}>
            {STUDIO_NAME.toUpperCase()}
          </Link>
          <p className={clsx("mt-3 max-w-xs text-sm leading-relaxed", s.text)}>
            Music apps that run on your iPhone, made by one developer in Germany. No cloud, no
            subscriptions.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className={clsx("text-xs font-bold uppercase tracking-[0.18em]", s.head)}>{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      className={clsx("text-sm transition-colors", s.link)}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className={clsx("text-sm transition-colors", s.link)}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={clsx("border-t", s.line)}>
        <p className={clsx("page-shell py-5 text-xs", s.text)}>
          © 2026 {STUDIO_NAME}. App Store is a service mark of Apple Inc.
        </p>
      </div>
    </footer>
  );
}
