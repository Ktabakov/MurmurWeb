"use client";

import { clsx } from "clsx";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HERO_LOOP_SECONDS, SyncedSoundtrack } from "@/components/score-hero-audio";
import {
  HERO_DEFAULT_TRACK,
  HERO_SOUNDTRACK_FILES,
  HERO_TRACKS,
  type HeroIcon,
  type HeroTrackId,
} from "@/components/score-hero-config";

export type PlayerStatus = "idle" | "loading" | "playing";

const EQ_BARS = 4;
export const LOOP_LABEL = formatTime(HERO_LOOP_SECONDS);

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function trackById(id: HeroTrackId) {
  return HERO_TRACKS.find((t) => t.id === id) ?? HERO_TRACKS[0];
}

// Server snapshot is "no preference"; the client re-renders with the real value after hydration.
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

/**
 * One Score player: a <video> + the shared audio engine + UI state.
 * - "ambient" (hero): the muted clip loops by itself (not for reduced motion / Data Saver); a tap adds sound.
 * - "on-demand" (Score section): the clip stays on its poster until a tap, then plays with its score and
 *   pauses again on stop. A tap is the visitor's choice, so this also plays under reduced motion.
 * Only one player sounds at a time page-wide (the engine stops the other one).
 */
export function useScorePlayer(mode: "ambient" | "on-demand") {
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<SyncedSoundtrack | null>(null);
  const preloadedRef = useRef(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const eqRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [selected, setSelected] = useState<HeroTrackId>(HERO_DEFAULT_TRACK);
  const [loadingId, setLoadingId] = useState<HeroTrackId | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const videoClockAllowed = useCallback(() => mode === "on-demand" || !reducedRef.current, [mode]);

  const markStopped = useCallback(() => {
    setStatus("idle");
    setLoadingId(null);
    if (mode === "on-demand") videoRef.current?.pause();
  }, [mode]);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SyncedSoundtrack({
        files: HERO_SOUNDTRACK_FILES,
        getVideo: () => videoRef.current,
        videoClockAllowed,
        onInterrupted: markStopped,
      });
    }
    return engineRef.current;
  }, [markStopped, videoClockAllowed]);

  const stop = useCallback(
    (announce = true) => {
      engineRef.current?.stop();
      markStopped();
      if (announce) setAnnouncement("Soundtrack stopped.");
    },
    [markStopped]
  );

  const play = useCallback(
    (id: HeroTrackId) => {
      const engine = getEngine();
      engine.unlock(); // synchronous, inside the tap
      const video = videoRef.current;
      if (video && video.paused && videoClockAllowed()) {
        // Hero: Low Power Mode / Data Saver may have blocked the muted autoplay; a tap allows it.
        // Score section: the tap is what starts the clip.
        video.muted = true;
        video.play().catch(() => {});
      }
      setSelected(id);
      setLoadingId(id);
      setStatus((s) => (s === "playing" ? "playing" : "loading"));
      engine
        .play(id)
        .then((started) => {
          if (!started) return;
          setLoadingId(null);
          setStatus("playing");
          const track = trackById(id);
          setAnnouncement(`Now playing: ${track.name}, ${track.kind}.`);
          if (!preloadedRef.current) {
            preloadedRef.current = true;
            void engine.preload(HERO_TRACKS.map((t) => t.id).filter((t) => t !== id));
          }
        })
        .catch(() => {
          setLoadingId(null);
          setStatus(engine.isPlaying ? "playing" : "idle");
          setAnnouncement("The soundtrack could not be loaded. Please try again.");
        });
    },
    [getEngine, videoClockAllowed]
  );

  const toggle = useCallback(() => {
    if (status === "idle") play(selected);
    else stop();
  }, [play, selected, status, stop]);

  const pick = useCallback(
    (id: HeroTrackId) => {
      if (status === "playing" && selected === id && !loadingId) stop();
      else play(id);
    },
    [loadingId, play, selected, status, stop]
  );

  // Ambient: start the muted loop (not for reduced motion or Data Saver: the poster stays a still).
  useEffect(() => {
    // Read the query directly: during hydration `reduced` is still the server value (false).
    reducedRef.current = window.matchMedia(REDUCED_QUERY).matches;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    if (mode !== "ambient") return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedRef.current || saveData) {
      video.pause();
      return;
    }
    video.preload = "auto";
    video.play().catch(() => {});
  }, [mode, reduced]);

  // Visible: keep the progress bar + level bars moving; offscreen and silent: pause the ambient loop.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    let raf = 0;
    let shownSecond = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const engine = engineRef.current;
      const pos = engine?.position ?? video.currentTime;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, pos / HERO_LOOP_SECONDS).toFixed(4)})`;
      }
      const whole = Math.floor(pos);
      if (whole !== shownSecond && timeRef.current) {
        shownSecond = whole;
        timeRef.current.textContent = formatTime(whole);
      }
      const freq = reducedRef.current ? null : engine?.levels() ?? null;
      for (let i = 0; i < EQ_BARS; i++) {
        const el = eqRefs.current[i];
        if (!el) continue;
        const level = freq ? Math.min(1, (freq[2 + i * 7] / 255) * 1.2) : [0.55, 0.9, 0.7, 0.45][i];
        el.style.transform = `scaleY(${(0.15 + level * 0.85).toFixed(3)})`;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        raf = requestAnimationFrame(frame);
        if (mode === "ambient" && video.paused && video.preload === "auto" && !reducedRef.current) {
          video.play().catch(() => {});
        }
      } else if (mode === "ambient" && !engineRef.current?.isPlaying) {
        video.pause();
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  // A plain <audio> player elsewhere on the page started: hand the speakers over.
  useEffect(() => {
    const onPlay = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLAudioElement && engineRef.current?.isPlaying) stop(false);
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, [stop]);

  useEffect(
    () => () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    },
    []
  );

  return {
    reduced,
    rootRef,
    videoRef,
    progressRef,
    timeRef,
    eqRefs,
    status,
    selected,
    loadingId,
    announcement,
    toggle,
    pick,
  };
}

export type ScorePlayer = Omit<ReturnType<typeof useScorePlayer>, "rootRef" | "videoRef">;

// ---- UI ------------------------------------------------------------------------------------------

const ICON_PATHS: Record<HeroIcon, string> = {
  // Material Icons (Apache 2.0): the glyphs the app uses for these rows.
  air: "M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5c1.65 0 3 1.35 3 3zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 8 15.5 8H2v2h13.5c1.93 0 3.5-1.57 3.5-3.5zm-.5 4.5H2v2h16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z",
  note: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  planet:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  fire: "M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59-1.81-1.37-2-3.34-1.84-4.75.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54 2.43.31 5.06-.14 6.95-1.87 2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31.33-1.43-.96-2.83-.09-5.09.33 1.87 3.27 3.04 3.27 5.08.08 2.53-2.66 4.7-5.56 2.32z",
};

export function Caption({ className }: { className?: string }) {
  return (
    <p className={clsx("flex items-center gap-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-murmur-muted", className)}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lilac/80 shadow-[0_0_8px_rgba(197,154,255,0.8)]" aria-hidden="true" />
      Scored in Murmur on iPhone · royalty-free
    </p>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={clsx("fill-current", className)}>
      <path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}

/** Murmur's Score screen in miniature: suggestion rows, a loop progress bar, one play/stop pill. */
export function ScorePanel({
  player,
  header = true,
  bare = false,
  className,
}: {
  player: ScorePlayer;
  header?: boolean;
  /** No card chrome (when the panel sits inside another card). */
  bare?: boolean;
  className?: string;
}) {
  const { status, selected, loadingId, toggle, pick, progressRef, timeRef, eqRefs } = player;
  const playing = status === "playing";

  return (
    <div
      className={clsx(
        !bare &&
          "rounded-3xl border border-white/10 bg-[rgba(16,12,28,0.78)] p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(237,220,255,0.08),0_0_60px_rgba(173,99,255,0.12)] backdrop-blur-2xl sm:p-4",
        className
      )}
    >
      {header && (
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-lilac/15 text-lilac shadow-[inset_0_0_0_1px_rgba(238,189,255,0.3)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9zm-.6-2.6 1-3.1a1 1 0 0 1 1.25-.64l13.2 4.3a1 1 0 0 1 .64 1.26L19.3 9 3.4 6.4z" />
              </svg>
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-lilac">Score</span>
              <span className="block text-[15px] font-bold leading-tight text-white">Score this clip</span>
            </span>
          </div>
        </div>
      )}

      <ul aria-label="Soundtracks for this clip" className="flex flex-col gap-1.5 sm:gap-2">
        {HERO_TRACKS.map((track) => {
          const isLoading = loadingId === track.id;
          const isSelected = selected === track.id;
          const isOn = (playing || isLoading) && isSelected;
          return (
            <li key={track.id}>
              <button
                type="button"
                aria-pressed={isOn}
                aria-busy={isLoading || undefined}
                onClick={() => pick(track.id)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac sm:py-2.5",
                  !isSelected && "border-white/[0.07] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                )}
                style={
                  isSelected
                    ? {
                        borderColor: isOn ? `${track.accent}b3` : `${track.accent}59`,
                        background: `linear-gradient(90deg, ${track.accent}${isOn ? "24" : "14"}, rgba(255,255,255,0.03) 75%)`,
                      }
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: `${track.accent}1f`, color: track.accent, boxShadow: `inset 0 0 0 1px ${track.accent}4d` }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d={ICON_PATHS[track.icon]} />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: track.accent }}>
                    {track.kind}
                  </span>
                  <span className="block truncate text-[15px] font-bold leading-tight text-white">{track.name}</span>
                  <span className="block truncate text-xs text-murmur-muted">{track.detail}</span>
                </span>
                {isOn && !isLoading && (
                  <span aria-hidden="true" className="mr-1 flex h-5 shrink-0 items-center gap-[3px]">
                    {Array.from({ length: EQ_BARS }, (_, i) => (
                      <span
                        key={i}
                        ref={(el) => {
                          eqRefs.current[i] = el;
                        }}
                        className="hero-level-bar h-full w-[3px] rounded-full"
                        style={{ background: track.accent }}
                      />
                    ))}
                  </span>
                )}
                {isLoading && (
                  <span aria-hidden="true" className="mr-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/25 border-t-white motion-reduce:animate-none" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3.5 px-1" aria-hidden="true">
        <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
          <span ref={progressRef} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gen-start to-gen-end" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold tabular-nums text-murmur-muted">
          <span ref={timeRef}>0:00</span>
          <span>{LOOP_LABEL}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="btn-generate mt-2.5 flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac"
      >
        {status === "playing" ? (
          <>
            <span aria-hidden="true" className="h-3 w-3 rounded-[2px] bg-white" />
            Stop
          </>
        ) : status === "loading" ? (
          <>
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
            Loading… tap to cancel
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4" />
            Hear it scored
          </>
        )}
      </button>

      <Caption className="mt-3 justify-center" />
      <p className="sr-only" aria-live="polite" role="status">
        {player.announcement}
      </p>
    </div>
  );
}
