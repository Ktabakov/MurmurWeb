"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const SEGMENTS = [
  { text: "Compose", gradient: false },
  { text: "your scene.", gradient: true },
];

const EASE = [0.16, 1, 0.3, 1] as const;
// Both words stagger across this same window so a longer phrase doesn't
// trail on after a shorter one finishes — they reveal and settle together.
const STAGGER_WINDOW = 0.28;

export function HeroHeadline() {
  const shouldReduceMotion = useReducedMotion();

  const segments = useMemo(() => {
    return SEGMENTS.map((segment) => {
      const chars = Array.from(segment.text);
      return {
        ...segment,
        chars: chars.map((char, i) => ({
          char,
          delay: chars.length > 1 ? (i / (chars.length - 1)) * STAGGER_WINDOW : 0,
        })),
      };
    });
  }, []);

  return (
    <h1
      aria-label="Compose your scene."
      className="mt-6 text-[2.75rem] font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
    >
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          // Group chars into words so a line break can only land between
          // words, not between the per-character inline-block spans within
          // a word — adjacent inline-block boxes otherwise get an implicit
          // wrap opportunity, which can split a word mid-letter on narrow
          // viewports.
          const words: { char: string; delay: number }[][] = [[]];
          segment.chars.forEach((entry) => {
            if (entry.char === " ") {
              words.push([]);
            } else {
              words[words.length - 1].push(entry);
            }
          });

          return (
            <span key={segmentIndex}>
              {segmentIndex > 0 ? " " : ""}
              {words.map((word, wordIndex) => (
                <span key={wordIndex}>
                  {wordIndex > 0 ? " " : ""}
                  <span className="inline-block whitespace-nowrap">
                    {word.map(({ char, delay }, charIndex) => (
                      <motion.span
                        key={charIndex}
                        className={
                          segment.gradient
                            ? "hero-gradient-text inline-block"
                            : "inline-block"
                        }
                        initial={shouldReduceMotion ? false : { opacity: 0, y: "0.35em" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: EASE,
                          delay: shouldReduceMotion ? 0 : delay,
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
