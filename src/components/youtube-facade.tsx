"use client";

import { useState } from "react";

/**
 * Click-to-load YouTube player. Until the visitor taps play, nothing is requested from Google:
 * the poster is a local image, so no IP address or cookie reaches YouTube on a plain page view
 * (GDPR / §25 TDDDG). After the tap the player loads from youtube-nocookie.com.
 */
export function YouTubeFacade({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  poster: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setActive(true)}
        aria-label={`Play video: ${title} (loads YouTube)`}
        className="group absolute inset-0 h-full w-full cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, local file */}
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lilac/90 text-2xl text-white shadow-[0_0_40px_rgba(173,99,255,0.6)] transition-transform group-hover:scale-110">
          <span aria-hidden="true" className="ml-1">
            ▶
          </span>
        </span>
      </button>
      <p className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 text-center text-[10px] leading-snug text-white/75">
        Plays from YouTube: tapping loads the video from Google&rsquo;s servers (
        <a href="/privacy/#website" className="pointer-events-auto underline underline-offset-2">
          privacy
        </a>
        ).
      </p>
    </>
  );
}
