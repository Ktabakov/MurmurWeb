"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export type MoodPrompt = {
  label: string;
  prompt: string;
  sample: string;
};

type MoodPromptListProps = {
  prompts: MoodPrompt[];
};

export function MoodPromptList({ prompts }: MoodPromptListProps) {
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
    async (prompt: MoodPrompt) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (playingLabel === prompt.label) {
        stopPlayback();
        return;
      }

      audio.pause();
      audio.src = prompt.sample;
      audio.currentTime = 0;

      try {
        await audio.play();
        setPlayingLabel(prompt.label);
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

      <div className="mt-8 space-y-3.5">
        {prompts.map((prompt) => {
          const isPlaying = playingLabel === prompt.label;

          return (
            <button
              key={prompt.label}
              type="button"
              onClick={() => toggleSample(prompt)}
              aria-pressed={isPlaying}
              aria-label={
                isPlaying ? `Stop ${prompt.label} sample` : `Play ${prompt.label} sample`
              }
              className={clsx(
                "group relative block w-full rounded-2xl bg-gradient-to-r from-lilac/40 via-gen-end/25 to-transparent p-px text-left transition-all duration-300",
                "cursor-pointer hover:from-lilac/80 hover:via-gen-end/45 hover:shadow-[0_0_30px_rgba(173,99,255,0.25)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac",
                isPlaying && "from-lilac/80 via-gen-end/45 shadow-[0_0_30px_rgba(173,99,255,0.3)]"
              )}
            >
              <span className="flex items-center gap-4 rounded-2xl bg-murmur-card/85 px-5 py-4 backdrop-blur-xl">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span
                    className={clsx(
                      "absolute inline-flex h-full w-full rounded-full bg-lilac/60 blur-[3px] transition group-hover:bg-lilac",
                      isPlaying && "animate-ping bg-lilac"
                    )}
                  />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-lilac-fixed to-gen-end shadow-[0_0_10px_rgba(197,154,255,0.9)]" />
                </span>

                <span className="flex-1 text-sm leading-snug text-murmur-text">
                  <span className="text-lilac/70">&ldquo;</span>
                  {prompt.prompt}
                  <span className="text-lilac/70">&rdquo;</span>
                </span>

                <span
                  className="flex h-7 items-end gap-[3px] opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <span className="w-[3px] rounded-full bg-lilac" style={{ height: "40%" }} />
                  <span className="w-[3px] rounded-full bg-lilac-fixed" style={{ height: "85%" }} />
                  <span className="w-[3px] rounded-full bg-gen-end" style={{ height: "55%" }} />
                  <span className="w-[3px] rounded-full bg-lilac" style={{ height: "70%" }} />
                </span>

                <span
                  className={clsx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                    isPlaying
                      ? "border-lilac/50 bg-lilac/20 text-lilac"
                      : "border-white/10 bg-white/5 text-murmur-muted group-hover:border-lilac/30 group-hover:text-lilac"
                  )}
                  aria-hidden="true"
                >
                  {isPlaying ? "❚❚" : "▶"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
