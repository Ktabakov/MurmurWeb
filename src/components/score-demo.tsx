"use client";

import { HERO_VIDEO } from "@/components/score-hero-config";
import { PlayIcon, ScorePanel, useScorePlayer } from "@/components/score-player";

/**
 * Score section example: the same lake clip and soundtracks as the hero, but the clip waits on its
 * poster until the visitor taps (the video or a row), then plays with its score. Starting it stops the
 * hero's sound and vice versa (one shared engine).
 */
export function ScoreDemo() {
  const { rootRef, videoRef, ...player } = useScorePlayer("on-demand");
  const idle = player.status === "idle";

  return (
    <figure ref={rootRef} className="mx-auto w-full max-w-[360px] lg:max-w-none">
      <div className="rounded-[2rem] border border-white/10 bg-black/40 p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-murmur-top">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
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
          {idle && (
            <button
              type="button"
              onClick={player.toggle}
              aria-label="Play the example video with its score"
              className="group absolute inset-0 grid place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-lilac"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-black/45 text-white shadow-[0_0_30px_rgba(173,99,255,0.35)] backdrop-blur-md transition-transform group-hover:scale-105">
                <PlayIcon className="ml-1 h-6 w-6" />
              </span>
            </button>
          )}
        </div>
        <ScorePanel player={player} header={false} bare className="mt-3" />
      </div>
      <figcaption className="sr-only">
        A lake video scored in Murmur, with four soundtracks to switch between.
      </figcaption>
    </figure>
  );
}
