"use client";

import { useState } from "react";
import { clsx } from "clsx";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: FaqItem[];
};

export function FaqSection({ items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className={clsx(
              "glass-card overflow-hidden rounded-2xl transition-all duration-300",
              isOpen && "border-lilac/20 shadow-[0_0_28px_rgba(173,99,255,0.12)]"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
            >
              <span
                className={clsx(
                  "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                  isOpen
                    ? "border-lilac/50 bg-lilac/20 text-lilac"
                    : "border-lilac/20 bg-lilac/5 text-murmur-muted"
                )}
                aria-hidden="true"
              >
                {isOpen ? "−" : "+"}
              </span>
              <span className="flex-1">
                <h3 className="text-base font-bold leading-snug tracking-tight text-white sm:text-lg">
                  {item.question}
                </h3>
              </span>
            </button>

            <div
              className={clsx(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-lilac/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-murmur-text-2 sm:px-6 sm:pb-6 sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
