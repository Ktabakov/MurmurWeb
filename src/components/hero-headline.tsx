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
const STAGGER_WINDOW = 0.18;

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
        {segments.map((segment, segmentIndex) => (
          <span key={segmentIndex} className={segment.gradient ? "hero-gradient-text" : undefined}>
            {segmentIndex > 0 ? " " : ""}
            {segment.chars.map(({ char, delay }, charIndex) => (
              <motion.span
                key={charIndex}
                className="inline-block whitespace-pre"
                initial={shouldReduceMotion ? false : { opacity: 0, y: "0.35em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: EASE,
                  delay: shouldReduceMotion ? 0 : delay,
                }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
