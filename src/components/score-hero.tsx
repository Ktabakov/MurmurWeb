"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import { HERO_VIDEO } from "@/components/score-hero-config";
import { ScorePanel, useScorePlayer } from "@/components/score-player";

/**
 * Home hero: the lake clip (scored in Murmur) runs muted full-bleed behind the headline; Murmur's Score
 * panel is docked over its bottom-right (wide screens) or right under it (phones), and plays the clip's
 * soundtracks in sync on a tap.
 */
export function ScoreHero({ children }: { children: ReactNode }) {
  const { rootRef, videoRef, ...player } = useScorePlayer("ambient");

  return (
    <section
      ref={rootRef}
      aria-label="Score demo: a video scored in Murmur"
      className="relative isolate flex flex-col overflow-hidden lg:block lg:h-[min(56.25vw,100svh)] lg:min-h-[680px]"
    >
      {/* MEDIA */}
      <div className="relative order-1 aspect-[16/10] w-full overflow-hidden bg-murmur-top sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
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
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-murmur-base via-murmur-base/50 to-transparent lg:h-[38%]" />
      </div>

      {/* Copy: over the left of the video on wide screens; below the panel on phones */}
      <div className="pointer-events-none relative z-10 order-3 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div className="page-shell pb-14 pt-9 sm:pb-16 lg:pb-6 lg:pt-20">
          <div className="hero-rise pointer-events-auto max-w-xl lg:max-w-[26rem] xl:max-w-[33rem] 2xl:max-w-[38rem]">
            {children}
          </div>
        </div>
      </div>

      {/* Score panel: docked bottom-right over the video, or the block right under it on phones */}
      <div className="pointer-events-none relative z-20 order-2 -mt-10 sm:-mt-14 lg:absolute lg:inset-0 lg:mt-0">
        <div className="page-shell flex lg:h-full lg:items-end lg:justify-end lg:pb-[4.5%]">
          <ScorePanel
            player={player}
            className="hero-rise pointer-events-auto mx-auto w-full max-w-md lg:mx-0 lg:w-[21rem] lg:max-w-none xl:w-[23rem]"
          />
        </div>
      </div>
    </section>
  );
}
