"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import { HERO_VIDEO } from "@/components/score-hero-config";
import { Caption, CompactPicker, ScorePanel, useScorePlayer } from "@/components/score-player";

/**
 * Home hero: the lake clip (scored in Murmur) runs muted full-bleed behind the headline.
 * - Wide screens: headline + buttons on the left, Murmur's Score panel docked bottom-right.
 * - Phones: video, then headline, then a one-line track picker with the play pill, then the buttons,
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
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_110%,rgba(173,99,255,0.3),transparent_55%)] mix-blend-screen" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-murmur-base/75 to-transparent lg:h-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,7,18,0.96)_0%,rgba(10,7,18,0.86)_24%,rgba(10,7,18,0.45)_44%,rgba(10,7,18,0.08)_62%,rgba(10,7,18,0)_74%)] lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-murmur-base to-transparent lg:h-[38%] lg:via-murmur-base/50" />
      </div>

      {/* Copy (+ the phone picker): below the video on phones, over its left side on wide screens */}
      <div className="pointer-events-none relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div className="page-shell pb-12 pt-5 sm:pb-16 sm:pt-8 lg:pb-6 lg:pt-20">
          <div className="hero-rise pointer-events-auto max-w-xl lg:max-w-[26rem] xl:max-w-[33rem] 2xl:max-w-[38rem]">
            {intro}
            <CompactPicker player={player} className="mt-5 lg:hidden" />
            <div className="mt-5 lg:mt-8">{actions}</div>
            <Caption className="mt-5 lg:hidden" />
          </div>
        </div>
      </div>

      {/* Wide screens: Score panel docked bottom-right over the video */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="page-shell flex h-full items-end justify-end pb-[4.5%]">
          <ScorePanel player={player} className="hero-rise pointer-events-auto w-[21rem] xl:w-[23rem]" />
        </div>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {player.announcement}
      </p>
    </section>
  );
}
