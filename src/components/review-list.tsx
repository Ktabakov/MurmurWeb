import { clsx } from "clsx";
import type { Review } from "@/lib/reviews";

type Variant = "studio" | "murmur";

const styles: Record<Variant, { card: string; title: string; body: string; meta: string; star: string; starOff: string; details: string }> = {
  studio: {
    card: "border border-st-line bg-st-surface shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-18px_rgba(23,20,27,0.25)]",
    title: "text-st-ink",
    body: "text-st-ink-2",
    meta: "text-st-muted",
    star: "text-[#e0a100]",
    starOff: "text-st-line",
    details: "text-st-muted marker:text-st-muted",
  },
  murmur: {
    card: "glass-card",
    title: "text-white",
    body: "text-murmur-text-2",
    meta: "text-murmur-muted",
    star: "text-lilac",
    starOff: "text-murmur-container",
    details: "text-murmur-muted",
  },
};

function Stars({ rating, on, off }: { rating: number; on: string; off: string }) {
  return (
    <span className="flex gap-0.5 text-base leading-none" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden="true" className={i <= rating ? on : off}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Real App Store reviews (see src/lib/reviews.ts), shown as written; translations are marked. */
export function ReviewList({ items, variant = "studio" }: { items: Review[]; variant?: Variant }) {
  const s = styles[variant];
  return (
    <ul className="columns-1 gap-5 md:columns-2 xl:columns-3">
      {items.map((r) => (
        <li key={r.author + r.date} className={clsx("mb-5 break-inside-avoid rounded-2xl p-6", s.card)}>
          <figure>
            <div className="flex items-center justify-between gap-3">
              <Stars rating={r.rating} on={s.star} off={s.starOff} />
              <span className={clsx("text-xs font-medium", s.meta)}>{r.app} · App Store</span>
            </div>
            <blockquote className="mt-4">
              <p className={clsx("text-base font-bold leading-snug", s.title)}>{r.title}</p>
              <p className={clsx("mt-2 whitespace-pre-line text-sm leading-relaxed sm:text-[15px]", s.body)}>{r.body}</p>
            </blockquote>
            {r.original && (
              <details className={clsx("mt-3 text-xs", s.details)}>
                <summary className="cursor-pointer select-none">
                  Translated from {r.original.language} by us · show original
                </summary>
                <div lang={r.original.lang} className="mt-2 whitespace-pre-line leading-relaxed">
                  <p className="font-semibold">{r.original.title}</p>
                  <p className="mt-1">{r.original.body}</p>
                </div>
              </details>
            )}
            {r.note && <p className={clsx("mt-3 text-xs italic", s.meta)}>{r.note}</p>}
            <figcaption className={clsx("mt-4 text-xs", s.meta)}>
              <span className="font-semibold">{r.author}</span> · {r.country} · {r.date}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
