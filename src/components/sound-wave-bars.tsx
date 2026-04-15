"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

export function SoundWaveBars() {
  const bars = useMemo(() => Array.from({ length: 37 }, (_, i) => i), []);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    setHoverProgress(progress);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoverProgress(null);
  }, []);

  return (
    <div
      className="relative mx-auto flex h-[240px] w-full max-w-none items-center justify-center sm:h-[300px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-x-10 top-1/2 h-11 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(125,249,255,0.35),rgba(56,189,248,0.35),transparent)] blur-xl mix-blend-screen" />

      <div className="flex h-full w-full items-center justify-center gap-[6px] sm:gap-2">
        {bars.map((index) => {
          const centerDistance = Math.abs(index - (bars.length - 1) / 2);
          const baseHeight = 24 + (1 - centerDistance / 18) * 128;
          const duration = 2.8 + (index % 5) * 0.35;
          const delay = index * 0.07;
          const hoverCenter = hoverProgress === null ? null : hoverProgress * (bars.length - 1);
          const hoverDistance = hoverCenter === null ? 999 : Math.abs(index - hoverCenter);
          const hoverBoost = hoverCenter === null ? 0 : Math.exp(-(hoverDistance * hoverDistance) / 14) * 0.42;

          return (
            <motion.span
              key={index}
              className="wave-bar w-[3px] rounded-full sm:w-1"
              style={{
                transform: `scaleY(${1 + hoverBoost})`,
                opacity: 0.72 + hoverBoost * 0.28,
              }}
              animate={{
                height: [baseHeight * 0.62, baseHeight, baseHeight * 0.7, baseHeight * 0.88],
                opacity: [0.35, 0.92, 0.55, 0.85],
              }}
              transition={{
                duration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "easeInOut",
                delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
