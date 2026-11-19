"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export type SerenadaExample = {
  id: string;
  title: string;
  /** Who the song is for; empty for songs about a thing (then the language shows instead). */
  forName: string;
  style: string;
  voice: string;
  language: string;
  languageName: string;
  /** What the song says, in English. */
  about: string;
  lyrics: string;
  /** Cover palette (TOKENS.md cover palettes): background + three shape colours. */
  palette: [string, string, string, string];
  src: string;
};

/** Album-cover style art like the app's generated covers: flat shapes on a colour, ink outline. */
function Cover({ ex, playing }: { ex: SerenadaExample; playing: boolean }) {
  const [bg, a, b, c] = ex.palette;
  return (
    <div
      className="sr-stamp relative aspect-square w-full overflow-hidden rounded-[22px] border-2 border-[#1b1712]"
      style={{ background: bg }}
      aria-hidden="true"
    >
      <span className="absolute left-[22%] top-[24%] h-[30%] w-[38%] rounded-lg" style={{ background: a }} />
      <span className="absolute left-[34%] top-[34%] h-[36%] w-[44%] rounded-lg opacity-95" style={{ background: c }} />
      <span className="absolute left-[30%] top-[30%] h-[42%] w-[30%] rounded-lg" style={{ background: b }} />
      <span className="absolute -bottom-[14%] -right-[10%] h-[46%] w-[46%] rounded-full" style={{ background: b }} />
      <span className="absolute right-3 top-3 rounded-full bg-[#fffbf3] px-2 py-0.5 font-mono text-[11px] font-bold text-[#1b1712]">
        {ex.language.toUpperCase()}
      </span>
      <span
        className={clsx(
          "absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1b1712] bg-[#fffbf3] text-[#1b1712] transition-transform",
          playing && "scale-105"
        )}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
          </svg>
        )}
      </span>
    </div>
  );
}

function LyricLines({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split("\n\n").map((block, i) => {
        const [first, ...rest] = block.split("\n");
        const tag = /^\[(.+)\]$/.exec(first)?.[1];
        const lines = tag ? rest : [first, ...rest];
        return (
          <div key={i}>
            {tag && (
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-sr-ink-soft">{tag}</p>
            )}
            {lines.map((l, j) => (
              <p key={j} className="font-serif text-lg leading-snug sm:text-xl">
                {l}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const fmt = (t: number) => (Number.isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}` : "0:00");

/** Seek bar under a cover: tap or drag anywhere to jump, arrow keys move 5 s. Big touch target, thin visible bar. */
function Scrubber({
  label,
  value,
  active,
  onSeek,
  onStep,
}: {
  label: string;
  value: number;
  active: boolean;
  onSeek: (fraction: number, final: boolean) => void;
  onStep: (seconds: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const fractionAt = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    return r && r.width > 0 ? Math.min(1, Math.max(0, (clientX - r.left) / r.width)) : 0;
  };
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="group/seek relative mt-1 flex h-6 cursor-pointer touch-none items-center outline-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        onSeek(fractionAt(e.clientX), false);
      }}
      onPointerMove={(e) => {
        if (dragging.current) onSeek(fractionAt(e.clientX), false);
      }}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        dragging.current = false;
        onSeek(fractionAt(e.clientX), true);
      }}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); onStep(5); }
        if (e.key === "ArrowLeft") { e.preventDefault(); onStep(-5); }
      }}
    >
      <span className="block h-1 w-full overflow-hidden rounded-full bg-sr-line group-focus-visible/seek:ring-2 group-focus-visible/seek:ring-sr-verm">
        <span className="block h-full rounded-full bg-sr-verm" style={{ width: `${value * 100}%` }} />
      </span>
      <span
        aria-hidden="true"
        className={clsx(
          "absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1b1712] bg-sr-verm transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover/seek:opacity-100"
        )}
        style={{ left: `${value * 100}%` }}
      />
    </div>
  );
}

/** The example songs: tap a cover to play it, tap or drag the bar under it to jump; lyrics sit next to the covers. */
export function SerenadaExamples({ examples }: { examples: SerenadaExample[] }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState(examples[0]?.id);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState({ now: 0, total: 0 });
  const scrubbing = useRef(false);

  useEffect(() => {
    const el = new Audio();
    el.preload = "none";
    const onTime = () => {
      if (scrubbing.current) return;
      setProgress(el.duration ? el.currentTime / el.duration : 0);
      setTime({ now: el.currentTime, total: el.duration || 0 });
    };
    const onEnd = () => {
      setPlaying(null);
      setProgress(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onTime);
    el.addEventListener("ended", onEnd);
    audio.current = el;
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = (ex: SerenadaExample) => {
    const el = audio.current;
    if (!el) return;
    setSelected(ex.id);
    if (playing === ex.id) {
      el.pause();
      setPlaying(null);
      return;
    }
    if (!el.src.endsWith(ex.src)) {
      el.src = ex.src;
      setProgress(0);
      setTime({ now: 0, total: 0 });
    }
    el.play().then(
      () => setPlaying(ex.id),
      () => setPlaying(null)
    );
  };

  /** Jump inside a song (loads and starts it first if another one was selected). */
  const seek = (ex: SerenadaExample, fraction: number, final: boolean) => {
    const el = audio.current;
    if (!el) return;
    scrubbing.current = !final;
    setSelected(ex.id);
    setProgress(fraction);
    if (!el.src.endsWith(ex.src)) {
      if (!final) return; // load the new song once, when the finger lifts
      el.src = ex.src;
      setTime({ now: 0, total: 0 });
      el.addEventListener(
        "loadedmetadata",
        () => {
          el.currentTime = fraction * el.duration;
          el.play().then(() => setPlaying(ex.id), () => setPlaying(null));
        },
        { once: true }
      );
      el.load();
      return;
    }
    if (el.duration) {
      el.currentTime = fraction * el.duration;
      setTime({ now: el.currentTime, total: el.duration });
    }
    if (final && playing !== ex.id) el.play().then(() => setPlaying(ex.id), () => setPlaying(null));
  };
  const step = (ex: SerenadaExample, seconds: number) => {
    const el = audio.current;
    if (!el || !el.src.endsWith(ex.src) || !el.duration) return;
    el.currentTime = Math.min(el.duration, Math.max(0, el.currentTime + seconds));
  };

  const current = examples.find((e) => e.id === selected) ?? examples[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-7">
        {examples.map((ex) => {
          const isPlaying = playing === ex.id;
          return (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => toggle(ex)}
                aria-pressed={isPlaying}
                aria-label={`${isPlaying ? "Pause" : "Play"} ${ex.title}, ${ex.style} in ${ex.languageName}`}
                className="group block w-full text-left"
              >
                <Cover ex={ex} playing={isPlaying} />
              </button>
              <Scrubber
                label={`Position in ${ex.title}`}
                value={selected === ex.id ? progress : 0}
                active={selected === ex.id}
                onSeek={(f, final) => seek(ex, f, final)}
                onStep={(sec) => step(ex, sec)}
              />
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => toggle(ex)} className="block w-full text-left">
                <span
                  className={clsx(
                    "mt-1 block font-serif text-lg font-bold leading-tight sm:text-xl",
                    selected === ex.id && "text-sr-verm"
                  )}
                  lang={ex.language}
                >
                  {ex.title}
                </span>
                <span className="mt-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-sr-ink-soft">
                  {ex.style} · {ex.forName ? `for ${ex.forName}` : ex.languageName}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {current && (
        <aside className="rounded-[24px] border border-sr-line bg-sr-card p-6 sm:p-8" aria-live="polite">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-sr-ink-soft">
            {playing === current.id ? "Now playing" : "Lyrics"} · {current.languageName} · {current.voice} voice
            {selected === current.id && time.total > 0 && (
              <span className="ml-2 tabular-nums text-sr-verm">
                {fmt(time.now)} / {fmt(time.total)}
              </span>
            )}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-extrabold leading-tight" lang={current.language}>
            {current.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-sr-ink-soft">{current.about}</p>
          <div className="mt-6" lang={current.language}>
            <LyricLines text={current.lyrics} />
          </div>
        </aside>
      )}
    </div>
  );
}
