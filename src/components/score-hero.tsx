"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import { HERO_TRACKS, HERO_VIDEO } from "@/components/score-hero-config";
import { CompactPicker, ScorePanel, useScorePlayer } from "@/components/score-player";

/**
 * Home hero: the lake clip (scored in Murmur) runs muted full-bleed behind the headline.
 * - Wide screens: headline + buttons on the left, Murmur's Score panel docked bottom-right.
 * - Phones: video, then headline, then the Compose pill (the track chips ease in after composing) with the note, then the buttons,
 *   so the App Store button stays on the first screen. DOM order = visual order (H1 first).
 */
export function ScoreHero({ intro, actions }: { intro: ReactNode; actions: ReactNode }) {
  const { rootRef, videoRef, ...player } = useScorePlayer();

  return (
    <section
      ref={rootRef}
      aria-label="Score demo: a video scored in Murmur"
      className="relative isolate overflow-hidden lg:h-[min(56.25vw,100svh)] lg:min-h-[680px]"
    >
      {/* MEDIA */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-murmur-top sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
        <video
          ref={videoRef}
          data-perf="video"
          className={clsx(
            "absolute inset-0 h-full w-full object-cover",
            HERO_VIDEO.mirrorOnDesktop && "lg:-scale-x-100"
          )}
          poster={HERO_VIDEO.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={HERO_VIDEO.mp4} type="video/mp4" />
          <source src={HERO_VIDEO.webm} type="video/webm" />
        </video>

        {/* Grade + blend into the page */}
        <div aria-hidden="true" data-perf="glow" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_110%,rgba(173,99,255,0.3),transparent_55%)]" />
        <div aria-hidden="true" data-perf="grade" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-murmur-base/75 to-transparent lg:h-40" />
        <div aria-hidden="true" data-perf="grade" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,7,18,0.96)_0%,rgba(10,7,18,0.86)_24%,rgba(10,7,18,0.45)_44%,rgba(10,7,18,0.08)_62%,rgba(10,7,18,0)_74%)] lg:block" />
        <div aria-hidden="true" data-perf="grade" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-murmur-base to-transparent lg:h-[38%] lg:via-murmur-base/50" />
      </div>

      {/* Copy (+ the phone picker): below the video on phones, over its left side on wide screens */}
      <div className="pointer-events-none relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div className="page-shell pb-12 pt-5 sm:pb-16 sm:pt-8 lg:pb-6 lg:pt-20">
          <div className="hero-rise pointer-events-auto max-w-xl lg:max-w-[26rem] xl:max-w-[33rem] 2xl:max-w-[38rem]">
            {intro}
            <CompactPicker player={player} className="mt-5 lg:hidden" />
            <div className="mt-5 lg:mt-8">{actions}</div>
          </div>
        </div>
      </div>

      {/* Wide screens: the matches float over the clip until the first compose, then hand over to the panel */}
      <div
        aria-hidden={player.revealed || player.phase !== "initial" || undefined}
        className={clsx(
          "pointer-events-none absolute inset-0 z-20 hidden transition-opacity duration-500 lg:block",
          player.phase === "initial" && !player.revealed ? "opacity-100" : "opacity-0"
        )}
      >
        <p className="absolute right-[10%] top-[27%] text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
          Murmur's matches for this scene
        </p>
        {HERO_TRACKS.map((track, i) => {
          const spots = ["right-[22%] top-[33%]", "right-[6%] top-[40%]", "right-[27%] top-[47%]", "right-[9%] top-[54%]"];
          return (
            <button
              key={track.id}
              data-perf="chip"
              type="button"
              tabIndex={player.phase === "initial" && !player.revealed ? 0 : -1}
              onClick={() => player.composeTrack(track.id)}
              className={clsx(
                "hero-chip-float pointer-events-auto absolute cursor-pointer flex items-center gap-2.5 rounded-full border border-white/15 bg-[rgba(16,12,28,0.84)] py-2 pl-3 pr-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-lilac",
                spots[i]
              )}
              style={{ animationDelay: `${i * -1.4}s` }}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: track.accent, boxShadow: `0 0 10px ${track.accent}` }} />
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: track.accent }}>
                  {track.kind}
                </span>
                <span className="block text-sm font-bold leading-tight text-white">{track.name}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Wide screens: Score panel docked bottom-right over the video */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="page-shell flex h-full items-end justify-end pb-[7%]">
          <ScorePanel player={player} className="hero-rise pointer-events-auto w-[23rem] xl:w-[26rem]" />
        </div>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {player.announcement}
      </p>
    </section>
  );
}
