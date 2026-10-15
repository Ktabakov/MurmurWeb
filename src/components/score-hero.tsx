"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { HERO_LOOP_SECONDS, SyncedSoundtrack, type HeroStyleId } from "@/components/score-hero-audio";
import {
  HERO_DEFAULT_STYLE,
  HERO_SOUNDTRACK_FILES,
  HERO_STYLES,
  HERO_VIDEO,
} from "@/components/score-hero-config";
import { BADGE_2_2_SHORT } from "@/lib/release";

type Status = "idle" | "loading" | "playing";

const EASE = [0.16, 1, 0.3, 1] as const;
const DESKTOP_BARS = 30;
const MINI_BARS = 5;
const LOOP_LABEL = formatTime(HERO_LOOP_SECONDS);

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function styleById(id: HeroStyleId) {
  return HERO_STYLES.find((s) => s.id === id) ?? HERO_STYLES[0];
}

// Server snapshot is "no preference"; the client re-renders with the real value after hydration.
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

/** Idle shape of the level bars (a soft waveform), 0..1. */
function idleLevel(i: number, n: number) {
  const x = i / Math.max(1, n - 1);
  return 0.18 + 0.32 * Math.abs(Math.sin(x * Math.PI * 2.3 + 0.6)) * (0.55 + 0.45 * Math.sin(x * Math.PI));
}

type Rect = { x: number; y: number; w: number; h: number };
type Line = { d: string; ax: number; ay: number; bx: number; by: number };

/** A gentle curve between the facing edges of two boxes. */
function connect(a: Rect, b: Rect): Line {
  const acx = a.x + a.w / 2;
  const acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + b.h / 2;
  const gapX = Math.max(0, Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w)));
  const gapY = Math.max(0, Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h)));
  let ax: number, ay: number, bx: number, by: number;
  if (gapX >= gapY) {
    ax = bcx > acx ? a.x + a.w : a.x;
    bx = bcx > acx ? b.x : b.x + b.w;
    ay = acy;
    by = bcy;
    const mx = (ax + bx) / 2;
    return { d: `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`, ax, ay, bx, by };
  }
  ay = bcy > acy ? a.y + a.h : a.y;
  by = bcy > acy ? b.y : b.y + b.h;
  ax = acx;
  bx = bcx;
  const my = (ay + by) / 2;
  return { d: `M${ax},${ay} C${ax},${my} ${bx},${my} ${bx},${by}`, ax, ay, bx, by };
}

export function ScoreHero({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<SyncedSoundtrack | null>(null);
  const preloadedRef = useRef(false);
  const desktopBars = useRef<(HTMLSpanElement | null)[]>([]);
  const miniBars = useRef<(HTMLSpanElement | null)[]>([]);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const lastShownSecond = useRef(-1);

  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<HeroStyleId>(HERO_DEFAULT_STYLE);
  const [loadingStyle, setLoadingStyle] = useState<HeroStyleId | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const showTime = useCallback((seconds: number) => {
    const whole = Math.floor(seconds);
    if (whole === lastShownSecond.current || !timeRef.current) return;
    lastShownSecond.current = whole;
    timeRef.current.textContent = `${formatTime(whole)} / ${LOOP_LABEL}`;
  }, []);

  const drawBars = useCallback((freq: Uint8Array | null) => {
    const paint = (bars: (HTMLSpanElement | null)[], n: number) => {
      for (let i = 0; i < n; i++) {
        const el = bars[i];
        if (!el) continue;
        let level: number;
        if (freq && !reducedRef.current) {
          // Log-ish spread over the lower ~70% of the spectrum, where music lives.
          const bin = Math.min(freq.length - 1, 1 + Math.floor(Math.pow(i / n, 1.55) * freq.length * 0.7));
          level = Math.min(1, (freq[bin] / 255) * 1.15);
        } else {
          level = idleLevel(i, n);
        }
        el.style.transform = `scaleY(${(0.08 + level * 0.92).toFixed(3)})`;
      }
    };
    paint(desktopBars.current, DESKTOP_BARS);
    paint(miniBars.current, MINI_BARS);
  }, []);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SyncedSoundtrack({
        files: HERO_SOUNDTRACK_FILES,
        getVideo: () => videoRef.current,
        videoClockAllowed: () => !reducedRef.current,
        onFrame: (freq, position) => {
          drawBars(freq);
          if (freq) showTime(position);
        },
        onStats: (stats) => {
          // Exposed for QA (drift is checked in the browser); harmless in production.
          const root = rootRef.current;
          if (!root) return;
          root.dataset.syncDriftMs = stats.lastDriftMs.toFixed(1);
          root.dataset.syncMaxDriftMs = stats.maxAbsDriftMs.toFixed(1);
          root.dataset.syncSamples = String(stats.samples);
          root.dataset.syncResyncs = String(stats.resyncs);
          root.dataset.syncLoops = String(stats.loops);
        },
      });
    }
    return engineRef.current;
  }, [drawBars, showTime]);

  const stop = useCallback(
    (announce = true) => {
      engineRef.current?.stop();
      setStatus("idle");
      setLoadingStyle(null);
      if (announce) setAnnouncement("Soundtrack stopped.");
    },
    []
  );

  const playStyle = useCallback(
    (id: HeroStyleId) => {
      const engine = getEngine();
      engine.unlock(); // synchronous, inside the tap
      const video = videoRef.current;
      if (video && !reducedRef.current && video.paused) {
        // Low Power Mode / Data Saver may have blocked the muted autoplay: a tap allows it.
        video.play().catch(() => {});
      }
      setSelected(id);
      setLoadingStyle(id);
      setStatus((s) => (s === "playing" ? "playing" : "loading"));
      engine
        .play(id)
        .then((started) => {
          if (!started) return;
          setLoadingStyle(null);
          setStatus("playing");
          const style = styleById(id);
          setAnnouncement(`Now playing: ${style.label}, ${style.detail.replace("·", "and")}.`);
          if (!preloadedRef.current) {
            preloadedRef.current = true;
            void engine.preload(HERO_STYLES.map((s) => s.id).filter((s) => s !== id));
          }
        })
        .catch(() => {
          setLoadingStyle(null);
          setStatus(engine.isPlaying ? "playing" : "idle");
          setAnnouncement("The soundtrack could not be loaded. Please try again.");
        });
    },
    [getEngine]
  );

  const onToggle = useCallback(() => {
    if (status === "idle") playStyle(selected);
    else stop();
  }, [playStyle, selected, status, stop]);

  const onPick = useCallback(
    (id: HeroStyleId) => {
      if (status === "playing" && selected === id && !loadingStyle) stop();
      else playStyle(id);
    },
    [loadingStyle, playStyle, selected, status, stop]
  );

  // Start the muted loop (not for reduced motion or Data Saver: the poster stays as a still).
  useEffect(() => {
    // Read the query directly: during hydration `reduced` is still the server value (false), and a
    // reduced-motion visitor must never see the loop start.
    const reducedNow = window.matchMedia(REDUCED_QUERY).matches;
    reducedRef.current = reducedNow;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedNow || saveData) {
      video.pause();
      return;
    }
    video.preload = "auto";
    video.play().catch(() => {});
  }, [reduced]);

  // Pause the loop offscreen while it is silent; keep it running (as the clock) while sound is on.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || reduced || window.matchMedia(REDUCED_QUERY).matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (video.paused && video.preload === "auto") video.play().catch(() => {});
      } else if (!engineRef.current?.isPlaying) {
        video.pause();
      }
    });
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  // Another player on the page started: hand the speakers over.
  useEffect(() => {
    const onPlay = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLMediaElement && target !== videoRef.current && engineRef.current?.isPlaying) {
        stop(false);
      }
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, [stop]);

  // Idle bars + time from the video while silent; teardown on unmount.
  useEffect(() => {
    drawBars(null);
    const video = videoRef.current;
    const onTime = () => {
      if (!engineRef.current?.isPlaying && video) showTime(video.currentTime);
    };
    video?.addEventListener("timeupdate", onTime);
    return () => {
      video?.removeEventListener("timeupdate", onTime);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [drawBars, showTime]);

  const current = styleById(selected);
  const playing = status === "playing";

  return (
    <section
      ref={rootRef}
      aria-label="Score demo: a video scored in Murmur"
      className="relative isolate overflow-hidden lg:h-[min(56.25vw,100svh)] lg:min-h-[640px]"
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
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_110%,rgba(173,99,255,0.28),transparent_55%)] mix-blend-screen" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-murmur-base/75 to-transparent lg:h-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,7,18,0.96)_0%,rgba(10,7,18,0.86)_24%,rgba(10,7,18,0.45)_44%,rgba(10,7,18,0.08)_62%,rgba(10,7,18,0)_74%)] lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-murmur-base via-murmur-base/50 to-transparent lg:h-[42%]" />

        {/* Small screens: now-playing tag + sound button on the video */}
        <div aria-hidden="true" className="absolute bottom-3 left-4 flex items-center gap-2.5 rounded-full border border-white/10 bg-[rgba(15,12,26,0.62)] py-1.5 pl-2.5 pr-3.5 backdrop-blur-md sm:bottom-5 sm:left-8 lg:hidden">
          <span className="flex h-4 items-center gap-[2px]">
            {Array.from({ length: MINI_BARS }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  miniBars.current[i] = el;
                }}
                className="hero-level-bar h-4 w-[3px] rounded-full bg-lilac"
              />
            ))}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lilac">
            {playing ? "Now playing" : selected === HERO_DEFAULT_STYLE ? "Best match" : "Your pick"}
          </span>
          <span className="text-xs font-bold text-white">{current.label}</span>
        </div>
        <div className="absolute bottom-2.5 right-3 sm:bottom-5 sm:right-8 lg:hidden">
          <SoundButton status={status} reduced={reduced} onClick={onToggle} className="h-[88px] w-[88px] sm:h-[108px] sm:w-[108px]" />
        </div>

        {/* Wide screens: floating Score UI */}
        <DesktopCards
          reduced={reduced}
          status={status}
          selected={selected}
          loadingStyle={loadingStyle}
          onPick={onPick}
          onToggle={onToggle}
          barRefs={desktopBars}
          timeRef={timeRef}
        />
      </div>

      {/* Small screens: feelings row under the video */}
      <div className="page-shell relative z-10 pt-4 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-murmur-muted">Feeling</span>
          <div className="-mr-5 flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 pr-5 [scrollbar-width:none] sm:-mr-8 sm:pr-8 [&::-webkit-scrollbar]:hidden">
            <StyleChips selected={selected} playing={playing} loadingStyle={loadingStyle} onPick={onPick} />
          </div>
        </div>
        <Caption className="mt-3" />
      </div>

      {/* Copy: below the video on small screens, over its left side on wide ones */}
      <div className="pointer-events-none relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div className="page-shell pb-14 pt-7 sm:pb-16 lg:pb-6 lg:pt-20">
          <div className="hero-rise pointer-events-auto max-w-xl lg:max-w-[27rem] xl:max-w-[34rem] 2xl:max-w-[38rem]">
            {children}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {announcement}
      </p>
    </section>
  );
}

function Caption({ className }: { className?: string }) {
  return (
    <p className={clsx("flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-murmur-muted", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-lilac/80 shadow-[0_0_8px_rgba(197,154,255,0.8)]" aria-hidden="true" />
      Scored in Murmur on iPhone · royalty-free
    </p>
  );
}

function StyleChips({
  selected,
  playing,
  loadingStyle,
  onPick,
  compact = false,
}: {
  selected: HeroStyleId;
  playing: boolean;
  loadingStyle: HeroStyleId | null;
  onPick: (id: HeroStyleId) => void;
  compact?: boolean;
}) {
  return (
    <div role="group" aria-label="Soundtrack feeling" className={clsx("flex gap-2", compact ? "flex-wrap" : "flex-nowrap")}>
      {HERO_STYLES.map((style) => {
        const isLoading = loadingStyle === style.id;
        const isOn = (playing || isLoading) && selected === style.id;
        return (
          <button
            key={style.id}
            type="button"
            aria-pressed={isOn}
            aria-busy={isLoading || undefined}
            onClick={() => onPick(style.id)}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac",
              isOn
                ? "border-lilac/60 bg-lilac/15 text-white shadow-[0_0_18px_rgba(197,154,255,0.25)]"
                : "border-white/10 bg-white/[0.06] text-murmur-text-2 hover:border-lilac/35 hover:text-white"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx("h-2 w-2 rounded-full", isLoading && "animate-pulse")}
              style={{ background: style.dot, boxShadow: `0 0 8px ${style.dot}` }}
            />
            {style.label}
          </button>
        );
      })}
    </div>
  );
}

function SoundButton({
  status,
  reduced,
  onClick,
  className,
}: {
  status: Status;
  reduced: boolean;
  onClick: () => void;
  className?: string;
}) {
  const pathId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const playing = status === "playing";
  const loading = status === "loading";
  const label = playing ? "Stop the soundtrack" : loading ? "Loading the soundtrack, tap to cancel" : "Play the soundtrack";
  const ring = playing ? "Sound on • Tap to stop • Murmur score • " : "Tap to hear it • Scored in Murmur • ";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        "group relative grid place-items-center rounded-full border border-lilac/30 bg-[rgba(15,12,26,0.55)] shadow-[0_18px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(173,99,255,0.25)] backdrop-blur-md transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilac active:scale-[0.97]",
        className
      )}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" className={clsx("absolute inset-0 h-full w-full", !reduced && "hero-spin")}>
        <defs>
          <path id={pathId} d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <text className="fill-lilac-fixed text-[8.4px] font-extrabold uppercase" style={{ letterSpacing: "0.2em" }}>
          <textPath href={`#${pathId}`} textLength={Math.floor(2 * Math.PI * 45) - 2} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span
        aria-hidden="true"
        className={clsx(
          "btn-generate relative grid h-[44%] w-[44%] place-items-center rounded-full",
          playing && !reduced && "hero-breathe"
        )}
      >
        {loading ? (
          <span className={clsx("h-[42%] w-[42%] rounded-full border-2 border-white/40 border-t-white", !reduced && "animate-spin")} />
        ) : playing ? (
          <span className="h-[30%] w-[30%] rounded-[3px] bg-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="ml-[8%] h-[46%] w-[46%] fill-white">
            <path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z" />
          </svg>
        )}
      </span>
    </button>
  );
}

const CARD = "rounded-2xl border border-white/10 bg-[rgba(17,13,30,0.62)] shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(237,220,255,0.08)] backdrop-blur-xl";

function DesktopCards({
  reduced,
  status,
  selected,
  loadingStyle,
  onPick,
  onToggle,
  barRefs,
  timeRef,
}: {
  reduced: boolean;
  status: Status;
  selected: HeroStyleId;
  loadingStyle: HeroStyleId | null;
  onPick: (id: HeroStyleId) => void;
  onToggle: () => void;
  barRefs: React.RefObject<(HTMLSpanElement | null)[]>;
  timeRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const feelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const matchRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const playing = status === "playing";
  const current = styleById(selected);

  // Connector lines follow the real card boxes (they're placed in %, sized in px).
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const measure = () => {
      const base = area.getBoundingClientRect();
      if (base.width === 0) return;
      const rect = (el: HTMLElement | null): Rect | null => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
      };
      const boxes = [pillRef, feelRef, buttonRef, matchRef, waveRef].map((r) => rect(r.current));
      const next: Line[] = [];
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i];
        const b = boxes[i + 1];
        if (a && b) next.push(connect(a, b));
      }
      setLines(next);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(area);
    return () => ro.disconnect();
  }, []);

  const enter = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };
  const float = (duration: number, delay: number) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -5, 0] },
          transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div ref={areaRef} className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {lines.map((line, i) => (
          <g key={i}>
            <path
              d={line.d}
              fill="none"
              stroke="rgba(238,189,255,0.55)"
              strokeWidth={1}
              strokeDasharray="3 5"
              className={clsx(playing && !reduced && "hero-dash-flow")}
            />
            <circle cx={line.ax} cy={line.ay} r={2.5} fill="rgba(238,189,255,0.85)" />
            <circle cx={line.bx} cy={line.by} r={2.5} fill="rgba(238,189,255,0.85)" />
          </g>
        ))}
      </svg>

      {/* Score pill */}
      <motion.div ref={pillRef} className="absolute left-[6%] top-[17%]" {...enter(0.15)}>
        <motion.div
          {...float(7, 0)}
          aria-hidden="true"
          className="flex items-center gap-2.5 rounded-full border border-lilac/45 bg-[rgba(44,26,78,0.6)] py-2 pl-3 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-lilac">
            <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9zm-.6-2.6 1-3.1a1 1 0 0 1 1.25-.64l13.2 4.3a1 1 0 0 1 .64 1.26L19.3 9 3.4 6.4z" />
          </svg>
          <span className="text-sm font-bold text-white">Score</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-xs font-medium text-murmur-text-2">Video · {LOOP_LABEL}</span>
          <span className="rounded-full bg-lilac/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-lilac">
            {BADGE_2_2_SHORT}
          </span>
        </motion.div>
      </motion.div>

      {/* Feeling chips */}
      <motion.div ref={feelRef} className="absolute left-[24%] top-[27%] xl:left-[27%]" {...enter(0.3)}>
        <motion.div {...float(8, 0.6)} className={clsx(CARD, "p-4")}>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-murmur-muted">
            Feeling <span className="font-medium normal-case tracking-normal text-murmur-muted/80">· tap to hear</span>
          </p>
          <StyleChips selected={selected} playing={playing} loadingStyle={loadingStyle} onPick={onPick} compact />
        </motion.div>
      </motion.div>

      {/* Sound button */}
      <motion.div ref={buttonRef} className="absolute right-[7%] top-[41%] xl:right-[9%]" {...enter(0.45)}>
        <SoundButton status={status} reduced={reduced} onClick={onToggle} className="h-[124px] w-[124px] xl:h-[140px] xl:w-[140px]" />
      </motion.div>

      {/* Best match / now playing */}
      <motion.div ref={matchRef} className="absolute left-[40%] top-[67%] xl:left-[44%]" {...enter(0.6)}>
        <motion.div
          {...float(7.5, 1.2)}
          aria-hidden="true"
          className={clsx(CARD, "flex w-[16.5rem] items-center gap-3 border-l-2 p-3.5 pr-5")}
          style={{ borderLeftColor: current.dot }}
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{ background: `${current.dot}22`, color: current.dot, boxShadow: `inset 0 0 0 1px ${current.dot}44` }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M19 3.5v11.25A3.25 3.25 0 1 1 17 11.8V7.1l-8 1.8v7.85A3.25 3.25 0 1 1 7 13.8V6.6a1 1 0 0 1 .78-.98l10-2.2A1 1 0 0 1 19 3.5z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-lilac">
              {selected === HERO_DEFAULT_STYLE ? "Best match" : "Your pick"}
              {playing ? " · playing" : ""}
            </span>
            <span className="mt-0.5 block text-lg font-bold leading-tight text-white">{current.label}</span>
            <span className="block truncate text-xs text-murmur-muted">{current.detail}</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Level meter */}
      <motion.div ref={waveRef} className="absolute left-[4%] top-[79%] xl:left-[8%]" {...enter(0.75)}>
        <motion.div {...float(6.5, 0.3)} aria-hidden="true" className={clsx(CARD, "w-[14.5rem] px-4 py-3")}>
          <p className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-murmur-muted">
            <span className={playing ? "text-lilac" : undefined}>{playing ? "Your score" : "Muted"}</span>
            <span ref={timeRef} className="font-semibold tabular-nums tracking-[0.08em]">
              0:00 / {LOOP_LABEL}
            </span>
          </p>
          <span className="mt-2.5 flex h-9 items-center justify-between">
            {Array.from({ length: DESKTOP_BARS }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="hero-level-bar h-full w-[3px] rounded-full bg-gradient-to-t from-gen-end to-lilac-fixed"
              />
            ))}
          </span>
        </motion.div>
      </motion.div>

      <Caption className="absolute bottom-[5%] right-[7%] xl:right-[9%]" />
    </div>
  );
}
