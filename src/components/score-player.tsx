"use client";

import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HERO_LOOP_SECONDS, SyncedSoundtrack } from "@/components/score-hero-audio";
import {
  COMPOSE_MS,
  HERO_DEFAULT_TRACK,
  HERO_SOUNDTRACK_FILES,
  HERO_TRACKS,
  type HeroIcon,
  type HeroTrackId,
} from "@/components/score-hero-config";

export type PlayerStatus = "idle" | "loading" | "playing";
/** initial: nothing composed yet · composing: the fake-free "Composing…" wait · composed: tracks revealed. */
export type ComposePhase = "initial" | "composing" | "composed";

const EQ_BARS = 4;
const IDLE_EQ = [0.55, 0.9, 0.7, 0.45];
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
 * The hero's Score player: a muted looping <video> (not for reduced motion / Data Saver) + the shared
 * audio engine + UI state. A tap adds the sound, in sync with the clip.
 */
export function useScorePlayer() {
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<SyncedSoundtrack | null>(null);
  const preloadedRef = useRef(false);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  // Progress bars and equalizer bars register themselves (desktop panel + phone picker both have them).
  const progressEls = useRef(new Set<HTMLElement>());
  const eqEls = useRef(new Set<HTMLElement>());

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [selected, setSelected] = useState<HeroTrackId>(HERO_DEFAULT_TRACK);
  const [loadingId, setLoadingId] = useState<HeroTrackId | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [phase, setPhase] = useState<ComposePhase>("initial");
  // The suggestions appear once, after the first compose, and stay.
  const [revealed, setRevealed] = useState(false);
  // True when the minimum compose time has passed but the audio is still loading.
  const [composeSlow, setComposeSlow] = useState(false);
  const revealedRef = useRef(false);
  const composeToken = useRef(0);
  const composeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousSelected = useRef<HeroTrackId>(HERO_DEFAULT_TRACK);

  const videoClockAllowed = useCallback(() => !reducedRef.current, []);

  const markStopped = useCallback(() => {
    setStatus("idle");
    setLoadingId(null);
  }, []);

  /** Callback ref for a progress-bar fill (scaled 0..1 along x). */
  const progressBar = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const set = progressEls.current;
    set.add(el);
    return () => {
      set.delete(el);
    };
  }, []);

  /** Callback ref for one equalizer bar; its data-bar attribute picks the band. */
  const eqBar = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const set = eqEls.current;
    set.add(el);
    return () => {
      set.delete(el);
    };
  }, []);

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

  /** Inside a tap: unlock audio (iOS) and make sure the muted clip runs (Low Power Mode / Data Saver may have blocked it). */
  const unlockInTap = useCallback(() => {
    const engine = getEngine();
    engine.unlock(); // synchronous, inside the tap
    const video = videoRef.current;
    if (video && video.paused && videoClockAllowed()) {
      video.muted = true;
      video.play().catch(() => {});
    }
    return engine;
  }, [getEngine, videoClockAllowed]);

  /** Invalidate a running compose (timer + pending continuation). */
  const dropCompose = useCallback(() => {
    composeToken.current++;
    if (composeTimer.current) clearTimeout(composeTimer.current);
    composeTimer.current = null;
    setComposeSlow(false);
  }, []);

  const play = useCallback(
    (id: HeroTrackId) => {
      const engine = unlockInTap();
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
    [unlockInTap]
  );

  /**
   * "Compose score": a short composing state (COMPOSE_MS minimum, longer only while the
   * audio is still loading), then the soundtrack starts in sync with the clip and the suggestions show.
   * Taking longer than COMPOSE_MS only ever happens because the file is really still downloading.
   */
  const compose = useCallback(
    (id: HeroTrackId) => {
      const engine = unlockInTap();
      dropCompose();
      const token = composeToken.current;
      previousSelected.current = selected;
      engine.stop(); // silence while composing (compose again) ...
      engine.unlock(); // ... but keep the audio context running: the next start is not inside a tap
      setSelected(id);
      setLoadingId(null);
      setStatus("idle");
      setPhase("composing");
      setAnnouncement("Composing…");

      let loaded = false;
      const load = engine.load(id).then(() => {
        loaded = true;
      });
      const wait = new Promise<void>((resolve) => {
        composeTimer.current = setTimeout(resolve, COMPOSE_MS);
      });
      void wait.then(() => {
        if (token === composeToken.current && !loaded) setComposeSlow(true);
      });

      Promise.all([load, wait])
        .then(() => (token === composeToken.current ? engine.play(id) : false))
        .then((started) => {
          if (!started || token !== composeToken.current) return;
          composeTimer.current = null;
          revealedRef.current = true;
          setRevealed(true);
          setComposeSlow(false);
          setPhase("composed");
          setStatus("playing");
          const track = trackById(id);
          setAnnouncement(`Now playing: ${track.name}, ${track.kind}.`);
          if (!preloadedRef.current) {
            preloadedRef.current = true;
            void engine.preload(HERO_TRACKS.map((t) => t.id).filter((t) => t !== id));
          }
        })
        .catch(() => {
          if (token !== composeToken.current) return;
          dropCompose();
          setSelected(previousSelected.current);
          setPhase(revealedRef.current ? "composed" : "initial");
          setAnnouncement("The soundtrack could not be loaded. Please try again.");
        });
    },
    [dropCompose, selected, unlockInTap]
  );

  /** A second tap while composing. */
  const cancelCompose = useCallback(() => {
    dropCompose();
    engineRef.current?.stop();
    setSelected(previousSelected.current);
    setPhase(revealedRef.current ? "composed" : "initial");
    setAnnouncement("Composing cancelled.");
  }, [dropCompose]);

  /** The main button: Compose score → (cancel while composing) → Play / Stop. */
  const primary = useCallback(() => {
    if (phase === "initial") compose(HERO_DEFAULT_TRACK);
    else if (phase === "composing") cancelCompose();
    else if (status === "idle") play(selected);
    else stop();
  }, [cancelCompose, compose, phase, play, selected, status, stop]);

  const pick = useCallback(
    (id: HeroTrackId) => {
      if (phase === "composing") {
        // Picking a suggestion while composing: skip the wait, no fake delay.
        dropCompose();
        setPhase("composed");
        play(id);
      } else if (status === "playing" && selected === id && !loadingId) stop();
      else play(id);
    },
    [dropCompose, loadingId, phase, play, selected, status, stop]
  );

  // Ambient: start the muted loop (not for reduced motion or Data Saver: the poster stays a still).
  useEffect(() => {
    // Read the query directly: during hydration `reduced` is still the server value (false).
    reducedRef.current = window.matchMedia(REDUCED_QUERY).matches;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedRef.current || saveData) {
      video.pause();
      return;
    }
    video.preload = "auto";
    video.play().catch(() => {});
  }, [reduced]);

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
      const progress = `scaleX(${Math.min(1, pos / HERO_LOOP_SECONDS).toFixed(4)})`;
      progressEls.current.forEach((el) => {
        el.style.transform = progress;
      });
      const whole = Math.floor(pos);
      if (whole !== shownSecond && timeRef.current) {
        shownSecond = whole;
        timeRef.current.textContent = formatTime(whole);
      }
      const freq = reducedRef.current ? null : engine?.levels() ?? null;
      eqEls.current.forEach((el) => {
        const i = Number(el.dataset.bar) || 0;
        const level = freq ? Math.min(1, (freq[2 + i * 7] / 255) * 1.2) : IDLE_EQ[i % IDLE_EQ.length];
        el.style.transform = `scaleY(${(0.15 + level * 0.85).toFixed(3)})`;
      });
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        raf = requestAnimationFrame(frame);
        if (video.paused && video.preload === "auto" && !reducedRef.current) {
          video.play().catch(() => {});
        }
      } else if (!engineRef.current?.isPlaying) {
        video.pause();
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

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
      composeToken.current++;
      if (composeTimer.current) clearTimeout(composeTimer.current);
      engineRef.current?.dispose();
      engineRef.current = null;
    },
    []
  );

  return {
    reduced,
    rootRef,
    videoRef,
    timeRef,
    progressBar,
    eqBar,
    status,
    selected,
    loadingId,
    announcement,
    phase,
    revealed,
    composeSlow,
    primary,
    composeTrack: compose,
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

/** The honest one-liner: these are examples; the app composes for the visitor's own media. */
export function ScoreNote({ className }: { className?: string }) {
  return (
    <p className={clsx("text-[11px] leading-snug text-murmur-muted", className)}>
      Example scores, made with Murmur. On your iPhone, Murmur composes an original score for your own photo or video.
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

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={clsx("fill-current", className)}>
      <path d="M12 2l2 6.2L20.5 10 14 11.8 12 18l-2-6.2L3.5 10 10 8.2 12 2zm7 12l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
    </svg>
  );
}

/**
 * Grows from nothing to its content (and fades in) without a layout jump: the panel / picker eases open
 * instead of snapping. Closed content is invisible, so it is out of the tab order and the a11y tree.
 */
function Collapse({ open, axis = "y", children }: { open: boolean; axis?: "x" | "y"; children: ReactNode }) {
  if (axis === "x") {
    // Sideways (next to the phone play pill): a max-width ease, which works inside a flex row.
    return (
      <div
        className={clsx(
          "overflow-x-clip transition-[max-width,opacity] duration-500 ease-out motion-reduce:transition-none",
          open ? "max-w-44 opacity-100" : "invisible max-w-0 opacity-0"
        )}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none",
        open ? "opacity-100" : "opacity-0"
      )}
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className={clsx("min-h-0 overflow-y-clip", !open && "invisible")}>{children}</div>
    </div>
  );
}

/** Staggered fade-in for the suggestions once they are revealed (opacity + a small rise). */
function revealStyle(revealed: boolean, index: number): CSSProperties {
  return { transitionDelay: revealed ? `${200 + index * 90}ms` : "0ms" };
}
const REVEAL_CLASS = "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none";
function revealClass(revealed: boolean) {
  return clsx(REVEAL_CLASS, revealed ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0");
}

/** Small pulsing orb for the composing state (hidden entirely under prefers-reduced-motion: just the text). */
function ComposeOrb() {
  return <span aria-hidden="true" className="compose-orb shrink-0 motion-reduce:hidden" />;
}

function PrimaryLabel({ phase, status, slow }: { phase: ComposePhase; status: PlayerStatus; slow: boolean }) {
  if (phase === "initial") {
    return (
      <>
        <SparkleIcon className="h-4 w-4" />
        Hear this scene scored
      </>
    );
  }
  if (phase === "composing") {
    return (
      <>
        <ComposeOrb />
        Composing…
        {slow && <span className="text-xs font-semibold text-white/70">tap to cancel</span>}
      </>
    );
  }
  if (status === "playing") {
    return (
      <>
        <span aria-hidden="true" className="h-3 w-3 rounded-[2px] bg-white" />
        Stop
      </>
    );
  }
  if (status === "loading") {
    return (
      <>
        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
        Loading… tap to cancel
      </>
    );
  }
  return (
    <>
      <PlayIcon className="h-4 w-4" />
      Play
    </>
  );
}

function BestMatchTag({ best }: { best: boolean }) {
  return best ? (
    <span className="rounded-full bg-lilac/20 px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.14em] text-lilac">Best match</span>
  ) : (
    <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-murmur-muted">Idea</span>
  );
}

/**
 * Murmur's Score screen in miniature. Starts as just the header and a "Compose score" button; after the
 * short composing state the suggestion rows ease in and the first one plays. Then play/stop, instant
 * style switching.
 */
export function ScorePanel({ player, className }: { player: ScorePlayer; className?: string }) {
  const { phase, revealed, composeSlow, status, selected, loadingId, primary, pick, progressBar, timeRef, eqBar } = player;
  const playing = status === "playing";
  const composing = phase === "composing";

  return (
    <div
      data-perf="panel"
      className={clsx(
        "rounded-3xl border border-white/10 bg-[rgba(16,12,28,0.9)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(237,220,255,0.08),0_0_60px_rgba(173,99,255,0.12)] sm:p-5",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-lilac/15 text-lilac shadow-[inset_0_0_0_1px_rgba(238,189,255,0.3)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9zm-.6-2.6 1-3.1a1 1 0 0 1 1.25-.64l13.2 4.3a1 1 0 0 1 .64 1.26L19.3 9 3.4 6.4z" />
            </svg>
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-lilac">Score</span>
            <span className="block text-base font-bold leading-tight text-white">Score this clip</span>
          </span>
        </div>
      </div>

      <Collapse open={revealed}>
        <ul aria-label="Score ideas for this clip" className="flex flex-col gap-1.5 pb-3.5 sm:gap-2">
          {HERO_TRACKS.map((track, index) => {
            const isLoading = loadingId === track.id;
            const isSelected = selected === track.id;
            const isOn = (playing || isLoading) && isSelected;
            return (
              <li key={track.id} className={revealClass(revealed)} style={revealStyle(revealed, index)}>
                <button
                  type="button"
                  aria-pressed={isOn}
                  aria-busy={isLoading || undefined}
                  onClick={() => pick(track.id)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lilac sm:py-2.5",
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
                    <span className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: track.accent }}>
                        {track.kind}
                      </span>
                      <BestMatchTag best={index === 0} />
                    </span>
                    <span className="block truncate text-[15px] font-bold leading-tight text-white">{track.name}</span>
                    <span className="block truncate text-xs text-murmur-muted">{track.detail}</span>
                  </span>
                  {isOn && !isLoading && <Equalizer accent={track.accent} barRef={eqBar} className="mr-1 h-5" />}
                  {isLoading && (
                    <span aria-hidden="true" className="mr-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/25 border-t-white motion-reduce:animate-none" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-1 pb-2.5" aria-hidden="true">
          <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
            <span ref={progressBar} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gen-start to-gen-end" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-semibold tabular-nums text-murmur-muted">
            <span ref={timeRef}>0:00</span>
            <span>{LOOP_LABEL}</span>
          </div>
        </div>
      </Collapse>

      <button
        type="button"
        onClick={primary}
        aria-busy={composing || undefined}
        className="btn-generate flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac"
      >
        <PrimaryLabel phase={phase} status={status} slow={composeSlow} />
      </button>

      <ScoreNote className="mt-2.5 px-1 text-center" />
    </div>
  );
}

function Equalizer({
  accent,
  barRef,
  className,
}: {
  accent: string;
  barRef: (el: HTMLElement | null) => void;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={clsx("flex shrink-0 items-center gap-[3px]", className)}>
      {Array.from({ length: EQ_BARS }, (_, i) => (
        <span
          key={i}
          ref={barRef}
          data-bar={i}
          className="hero-level-bar h-full w-[3px] rounded-full"
          style={{ background: accent }}
        />
      ))}
    </span>
  );
}

/**
 * Phones: the same flow in one block. Initially just the "Compose score" pill and the note; after
 * composing, a horizontally scrolling row of chips (colour dot + name; the selected one gets its accent
 * border, the playing one an equalizer) eases in above the play pill,.
 */
export function CompactPicker({ player, className }: { player: ScorePlayer; className?: string }) {
  const { phase, revealed, composeSlow, status, selected, loadingId, primary, composeTrack, pick, progressBar, eqBar } = player;
  const playing = status === "playing";
  const composing = phase === "composing";

  return (
    <div className={className}>
      {!revealed && (
        <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-lilac">Murmur's matches for this scene</p>
          <ul className="flex w-max gap-2 py-1">
            {HERO_TRACKS.map((track) => (
              <li key={track.id}>
                <button
                  type="button"
                  onClick={() => composeTrack(track.id)}
                  className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm font-bold text-murmur-text-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac"
                >
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: track.accent, boxShadow: `0 0 8px ${track.accent}` }} />
                  {track.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Collapse open={revealed}>
        <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          <ul aria-label="Score ideas for this clip" className="flex w-max gap-2 py-1">
            {HERO_TRACKS.map((track, index) => {
              const isLoading = loadingId === track.id;
              const isSelected = selected === track.id;
              const isOn = (playing || isLoading) && isSelected;
              return (
                <li key={track.id} className={revealClass(revealed)} style={revealStyle(revealed, index)}>
                  <button
                    type="button"
                    aria-pressed={isOn}
                    aria-busy={isLoading || undefined}
                    onClick={() => pick(track.id)}
                    className={clsx(
                      "flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac",
                      !isSelected && "border-white/10 bg-white/[0.05] text-murmur-text-2"
                    )}
                    style={
                      isSelected
                        ? { borderColor: isOn ? `${track.accent}cc` : `${track.accent}80`, background: `${track.accent}${isOn ? "26" : "14"}` }
                        : undefined
                    }
                  >
                    {isOn && !isLoading ? (
                      <Equalizer accent={track.accent} barRef={eqBar} className="h-3.5" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={clsx("h-2 w-2 shrink-0 rounded-full", isLoading && "animate-pulse motion-reduce:animate-none")}
                        style={{ background: track.accent, boxShadow: `0 0 8px ${track.accent}` }}
                      />
                    )}
                    {track.name}
                    {index === 0 && (
                      <>
                        <span className="sr-only">, best match</span>
                        <span aria-hidden="true" className="rounded-full bg-lilac/20 px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.12em] text-lilac">
                          Best match
                        </span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Collapse>

      <div className="flex items-center">
        <button
          type="button"
          onClick={primary}
          aria-busy={composing || undefined}
          className="btn-generate flex min-w-0 flex-1 items-center justify-center gap-2.5 rounded-full py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac"
        >
          <PrimaryLabel phase={phase} status={status} slow={composeSlow} />
        </button>
      </div>

      <Collapse open={revealed}>
        <div aria-hidden="true" className="relative mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
          <span ref={progressBar} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gen-start to-gen-end" style={{ transform: "scaleX(0)" }} />
        </div>
      </Collapse>

      <ScoreNote className="mt-2.5" />
    </div>
  );
}
