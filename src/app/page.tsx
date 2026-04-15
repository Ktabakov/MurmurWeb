"use client";

import Image from "next/image";
import Link from "next/link";
import { SoundWaveBars } from "@/components/sound-wave-bars";

const architectureCards = [
  {
    title: "The Jam Buddy",
    description:
      "An AI collaborator that learns your cadence with evolving generation tuned to your current creative flow.",
    footer: "Active Signal",
    stat: "MIDI + DRUM",
  },
  {
    title: "Ambient Presets",
    description:
      "Studio-grade, non-repeating soundscapes designed for deep focus and immersive background states.",
    footer: "Deep Indigo State",
    stat: "0.42 Hz",
  },
  {
    title: "The Sound Barrier",
    description:
      "Advanced phase-cancellation style controls to keep your workspace focused and distraction free.",
    footer: "Isolation Vector",
    stat: "-48dB SILENCE",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-murmur-base text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.11),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(14,165,233,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_26%)]" />

      <nav className="fixed inset-x-0 top-0 z-50 bg-[linear-gradient(to_bottom,rgba(10,7,18,0.84)_0%,rgba(10,7,18,0)_100%)]">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-6 sm:px-8">
          <Link
            href="/"
            className="btn-secondary rounded-full px-5 py-2 text-xl font-black tracking-[0.26em] text-zinc-100 drop-shadow-[0_0_10px_rgba(89,13,242,0.4)] transition-all hover:bg-white/8 sm:text-2xl"
          >
            MURMUR
          </Link>
          <div className="hidden items-center gap-10 md:flex">
            <a className="border-b-2 border-violet-500 pb-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-400" href="#intelligence">
              Intelligence
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-100" href="#architecture">
              Architecture
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-100" href="#signal">
              Signal
            </a>
            <a className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-100" href="#archive">
              Archive
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-violet-400/40 bg-violet-500/20 px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-100 shadow-[0_0_20px_rgba(89,13,242,0.2)] transition-all duration-300 hover:bg-violet-500/30"
          >
            Tune In
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="intelligence" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-28 sm:pt-32">
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[130px] sm:h-[700px] sm:w-[700px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[120px] sm:h-[500px] sm:w-[500px]" />

          <div className="relative mb-14 w-full">
            <SoundWaveBars />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-cyan-100/15 bg-cyan-200/8 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
              Creative Audio Intelligence
            </p>
            <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
              Intelligence You <span className="hero-gradient-text">Can Hear.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium tracking-tight text-slate-300/85 sm:text-xl">
              Experience the future of generative audio. A cinematic ecosystem built for the next generation of sound architects.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/login"
                className="rounded-xl bg-violet-600 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(89,13,242,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                Tune In
              </Link>
              <a
                href="#archive"
                className="glass-card rounded-xl border border-white/10 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-100 transition-all hover:bg-white/5"
              >
                View Manifesto
              </a>
            </div>
          </div>
        </section>

        <section id="architecture" className="mx-auto w-full max-w-screen-2xl px-6 py-20 sm:px-8 sm:py-24">
          <div className="mb-14 flex items-center gap-4">
            <div className="h-8 w-1 bg-gradient-to-b from-violet-500 to-cyan-400" />
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">The Architecture</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {architectureCards.map((card) => (
              <article key={card.title} className="glass-card relative flex h-[420px] flex-col overflow-hidden rounded-lg p-8">
                <div className="absolute left-0 top-0 h-1 w-full bg-violet-500/25 transition-colors hover:bg-violet-500" />
                <div className="mb-auto">
                  <div className="mb-8 flex gap-4 text-4xl text-cyan-300/85">
                    <span>~</span>
                    <span>|</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300/85">{card.description}</p>
                </div>
                <div className="mt-8 border-l-2 border-violet-400/40 pl-4">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300/75">{card.footer}</span>
                  <span className="text-xl font-black uppercase tracking-tight text-white">{card.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mx-auto my-12 h-px w-full max-w-screen-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent px-6 sm:px-8" />

        <section id="signal" className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-8 text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl">
              Total Control. <br /> <span className="hero-gradient-text">No compromise.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan-300">=</div>
                <div>
                  <h4 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">Tactile Precision</h4>
                  <p className="text-sm text-slate-300/85">
                    Every control responds with near-zero latency, tuned for long sessions and precise decisions.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan-300">+</div>
                <div>
                  <h4 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">Neural Patching</h4>
                  <p className="text-sm text-slate-300/85">
                    Route audio intelligence through modular paths and shape behavior for your own workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-cyan-400/20 opacity-50 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="glass-card relative aspect-video overflow-hidden rounded-xl border border-white/10">
              <Image
                className="h-full w-full object-cover opacity-80"
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80"
                alt="Dark audio studio with glowing controls"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-violet-300">Signal Status</p>
                  <p className="text-xl font-bold uppercase tracking-tight text-white">Stable 192kHz</p>
                </div>
                <div className="flex h-12 items-end gap-1">
                  <div className="h-4 w-1 bg-violet-400/30" />
                  <div className="h-10 w-1 bg-violet-400 shadow-[0_0_10px_rgba(89,13,242,1)]" />
                  <div className="h-6 w-1 bg-cyan-400/30" />
                  <div className="h-8 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,1)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="archive" className="w-full border-t border-white/5 bg-gradient-to-b from-transparent to-black/40 pb-12 pt-20">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center gap-12 px-6 sm:px-8">
            <div className="flex flex-col items-center">
              <div className="mb-8 text-lg font-black tracking-[0.3em] text-zinc-300">MURMUR</div>
              <div className="mb-12 flex flex-wrap justify-center gap-8 sm:gap-12">
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-violet-400" href="#">
                  Hardware
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-violet-400" href="#">
                  Manifesto
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-violet-400" href="#">
                  Privacy
                </a>
                <a className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-violet-400" href="#">
                  Support
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-1">
                <div className="h-4 w-0.5 bg-zinc-800" />
                <div className="h-6 w-0.5 bg-violet-400/40" />
                <div className="h-3 w-0.5 bg-zinc-800" />
                <div className="h-5 w-0.5 bg-cyan-400/40" />
                <div className="h-4 w-0.5 bg-zinc-800" />
              </div>
              <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-600">
                © 2026 Murmur Audio Intelligence. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
