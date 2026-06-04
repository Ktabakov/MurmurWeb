"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export type StyleCategory = {
  label: string;
  color: string;
  sample: string;
};

type StyleCategoryGridProps = {
  categories: StyleCategory[];
};

export function StyleCategoryGrid({ categories }: StyleCategoryGridProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingLabel, setPlayingLabel] = useState<string | null>(null);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlayingLabel(null);
  }, []);

  const toggleSample = useCallback(
    async (category: StyleCategory) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (playingLabel === category.label) {
        stopPlayback();
        return;
      }

      audio.pause();
      audio.src = category.sample;
      audio.currentTime = 0;

      try {
        await audio.play();
        setPlayingLabel(category.label);
      } catch {
        setPlayingLabel(null);
      }
    },
    [playingLabel, stopPlayback]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setPlayingLabel(null);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="none" className="hidden" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat) => {
          const isPlaying = playingLabel === cat.label;

          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => toggleSample(cat)}
              aria-pressed={isPlaying}
              aria-label={
                isPlaying ? `Stop ${cat.label} sample` : `Play ${cat.label} sample`
              }
              className={clsx(
                "glass-card group relative flex h-28 w-full flex-col justify-between overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 sm:h-32 sm:p-5",
                "cursor-pointer hover:border-lilac/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac",
                isPlaying && "border-lilac/40 shadow-[0_0_28px_rgba(173,99,255,0.35)]"
              )}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background: `radial-gradient(75% 75% at 100% 0%, ${cat.color}, transparent 68%)`,
                }}
              />
              <span className="relative z-10 flex items-center justify-between gap-2">
                <span
                  className={clsx(
                    "h-2.5 w-2.5 rounded-full transition-transform duration-300",
                    isPlaying && "scale-125"
                  )}
                  style={{
                    background: cat.color,
                    boxShadow: isPlaying
                      ? `0 0 16px ${cat.color}`
                      : `0 0 12px ${cat.color}`,
                  }}
                />
                <span
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-colors",
                    isPlaying
                      ? "border-lilac/50 bg-lilac/20 text-lilac"
                      : "border-white/10 bg-white/5 text-murmur-muted group-hover:border-lilac/30 group-hover:text-lilac"
                  )}
                  aria-hidden="true"
                >
                  {isPlaying ? "❚❚" : "▶"}
                </span>
              </span>
              <span className="relative z-10 flex flex-col gap-0.5">
                <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  {cat.label}
                </h3>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-murmur-muted">
                  {isPlaying ? "Playing…" : "Tap to preview"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
