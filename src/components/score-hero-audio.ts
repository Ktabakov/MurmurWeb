/**
 * Score player engine: plays one of several pre-rendered scores in sync with a muted, looping <video>,
 * and crossfades between them without touching the video. Used by the hero and by the Score section.
 *
 * How sync works
 * - Every score is a decoded AudioBuffer played by a looping AudioBufferSourceNode (sample-accurate
 *   loop, length = the video's length).
 * - While the video is playing, the video is the clock: a new voice starts at
 *   `video.currentTime + output latency`, so what you hear lines up with what you see.
 * - A rAF loop measures drift (audio position vs. video position) every 200 ms. Two readings in a row
 *   over 50 ms trigger a resync (a 60 ms crossfade to a fresh voice at the right offset). When the
 *   video wraps around (loop), the voice is restarted at the new video time straight away; the scores
 *   fade in/out at their edges, so this lands in near-silence.
 * - When the video is not playing (reduced motion, Low Power Mode, not loaded yet, paused offscreen),
 *   the audio is its own clock and keeps looping. If the video starts (again) while sound is on, the
 *   video is seeked to the audio position once, then the normal drift check takes over.
 *
 * One AudioContext and one decoded-buffer cache are shared by every player on the page, and only one
 * player sounds at a time: starting one stops the other (its owner hears about it via onInterrupted).
 */

/** Track id (the hero config defines the actual ids). */
export type HeroStyleId = string;

/** Length of the hero video and of every score, in seconds (455 frames at 30 fps). */
export const HERO_LOOP_SECONDS = 455 / 30;

/** Crossfade when switching tracks. */
const SWITCH_FADE = 0.3;
const START_FADE = 0.08;
const STOP_FADE = 0.2;
const RESYNC_FADE = 0.06;
const LOOP_FADE = 0.025;
const DRIFT_LIMIT = 0.05;
const CHECK_EVERY_MS = 200;
const MIN_RESYNC_GAP_MS = 1000;
const SETTLE_AFTER_SEEK_MS = 600;

type Voice = {
  style: HeroStyleId;
  source: AudioBufferSourceNode;
  gain: GainNode;
  ctxStart: number;
  offset: number;
  loopEnd: number;
};

export type SyncStats = {
  /** Last measured drift in ms (audio ahead of video is positive). */
  lastDriftMs: number;
  /** Largest absolute drift seen since play started, in ms. */
  maxAbsDriftMs: number;
  samples: number;
  resyncs: number;
  loops: number;
};

type Options = {
  /** id -> file path without extension; ".m4a" is tried first, then ".webm" (Opus). */
  files: Readonly<Record<string, string>>;
  getVideo: () => HTMLVideoElement | null;
  /** False when the video must not drive the audio (reduced motion: the poster stays still). */
  videoClockAllowed: () => boolean;
  /** Another player on the page took over the speakers; this one has stopped. */
  onInterrupted?: () => void;
  onStats?: (stats: SyncStats) => void;
};

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

export function wrap(t: number) {
  return ((t % HERO_LOOP_SECONDS) + HERO_LOOP_SECONDS) % HERO_LOOP_SECONDS;
}

/** Signed difference a - b on the loop circle, in (-L/2, L/2]. */
export function circularDiff(a: number, b: number) {
  let d = wrap(a) - wrap(b);
  if (d > HERO_LOOP_SECONDS / 2) d -= HERO_LOOP_SECONDS;
  if (d <= -HERO_LOOP_SECONDS / 2) d += HERO_LOOP_SECONDS;
  return d;
}

// ---- shared audio graph (one per page) ---------------------------------------------------------

type Shared = {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
  freq: Uint8Array<ArrayBuffer>;
  buffers: Map<string, Promise<AudioBuffer>>;
  active: SyncedSoundtrack | null;
  suspendTimer: ReturnType<typeof setTimeout> | null;
};
let shared: Shared | null = null;

function getShared(): Shared {
  if (!shared) {
    // iOS 17+: play through the ringer/silent switch like a normal media player.
    const nav = navigator as AudioSessionNavigator;
    if (nav.audioSession) {
      try {
        nav.audioSession.type = "playback";
      } catch {
        /* older WebKit */
      }
    }
    const ctx = new AudioContext({ latencyHint: "interactive" });
    const master = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    shared = {
      ctx,
      master,
      analyser,
      freq: new Uint8Array(analyser.frequencyBinCount),
      buffers: new Map(),
      active: null,
      suspendTimer: null,
    };
  }
  return shared;
}

export class SyncedSoundtrack {
  private readonly opts: Options;
  private voice: Voice | null = null;
  private request = 0;
  private raf = 0;
  private lastVideoTime = -1;
  private videoWasActive = false;
  private overCount = 0;
  private nextCheckAt = 0;
  private lastResyncAt = 0;
  private settleUntil = 0;
  private stats: SyncStats = { lastDriftMs: 0, maxAbsDriftMs: 0, samples: 0, resyncs: 0, loops: 0 };

  constructor(opts: Options) {
    this.opts = opts;
  }

  get isPlaying() {
    return this.voice !== null;
  }

  /** Position of the playing score in the loop (seconds), or null when silent. */
  get position(): number | null {
    return this.voice && shared ? this.voicePosition(this.voice) : null;
  }

  /** Current analyser spectrum while this player sounds, else null. */
  levels(): Uint8Array | null {
    if (!this.voice || !shared) return null;
    shared.analyser.getByteFrequencyData(shared.freq);
    return shared.freq;
  }

  /** Must run synchronously inside the user's tap/click handler (iOS unlocks audio only there). */
  unlock(): AudioContext {
    const s = getShared();
    if (s.suspendTimer) {
      clearTimeout(s.suspendTimer);
      s.suspendTimer = null;
    }
    if (s.ctx.state !== "running") void s.ctx.resume();
    return s.ctx;
  }

  /** Fetch + decode one score (cached page-wide). Requires unlock() first. */
  load(style: HeroStyleId): Promise<AudioBuffer> {
    const s = shared;
    if (!s) return Promise.reject(new Error("AudioContext not unlocked"));
    const base = this.opts.files[style];
    const cached = s.buffers.get(base);
    if (cached) return cached;
    const promise = (async () => {
      let lastError: unknown = null;
      for (const ext of [".m4a", ".webm"]) {
        try {
          const res = await fetch(base + ext);
          if (!res.ok) throw new Error(`${res.status} ${base}${ext}`);
          return await s.ctx.decodeAudioData(await res.arrayBuffer());
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    })();
    promise.catch(() => s.buffers.delete(base));
    s.buffers.set(base, promise);
    return promise;
  }

  /** Warm the cache for other tracks, one at a time, after the first one plays. */
  async preload(styles: HeroStyleId[]) {
    for (const style of styles) {
      try {
        await this.load(style);
      } catch {
        /* retried on tap */
      }
    }
  }

  /**
   * Start sound with `style`, or crossfade to it if this player is already sounding. Stops any other
   * player first. Resolves false when a newer play()/stop() superseded this call while it was loading.
   */
  async play(style: HeroStyleId): Promise<boolean> {
    const ctx = this.unlock();
    const s = shared!;
    const request = ++this.request;
    if (s.active && s.active !== this) {
      const other = s.active;
      other.stop();
      other.opts.onInterrupted?.();
    }
    s.active = this;
    const buffer = await this.load(style);
    if (request !== this.request) return false;
    if (ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
      if (request !== this.request) return false;
    }

    const previous = this.voice;
    if (previous?.style === style) return true;
    const video = this.opts.getVideo();
    const videoActive = this.videoActive(video);
    const position = this.targetPosition(video, videoActive);
    this.voice = this.startVoice(style, buffer, position, previous ? SWITCH_FADE : START_FADE);
    if (previous) this.stopVoice(previous, SWITCH_FADE);
    else {
      this.stats = { lastDriftMs: 0, maxAbsDriftMs: 0, samples: 0, resyncs: 0, loops: 0 };
      this.videoWasActive = videoActive;
      this.lastVideoTime = videoActive && video ? video.currentTime : -1;
      this.overCount = 0;
      this.nextCheckAt = performance.now() + CHECK_EVERY_MS;
    }
    this.startLoop();
    return true;
  }

  stop() {
    this.request++;
    if (this.voice) this.stopVoice(this.voice, STOP_FADE);
    this.voice = null;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    const s = shared;
    if (!s) return;
    if (s.active === this) s.active = null;
    if (s.suspendTimer) clearTimeout(s.suspendTimer);
    s.suspendTimer = setTimeout(() => {
      if (!s.active && s.ctx.state === "running") void s.ctx.suspend();
    }, 600);
  }

  dispose() {
    this.stop();
  }

  // ---------------------------------------------------------------------------------------------

  private latency() {
    const ctx = shared?.ctx as (AudioContext & { outputLatency?: number }) | undefined;
    if (!ctx) return 0;
    if (typeof ctx.outputLatency === "number" && ctx.outputLatency > 0) return ctx.outputLatency;
    return ctx.baseLatency || 0;
  }

  private videoActive(video: HTMLVideoElement | null): video is HTMLVideoElement {
    return (
      !!video &&
      this.opts.videoClockAllowed() &&
      !video.paused &&
      !video.ended &&
      video.readyState >= 2
    );
  }

  private voicePosition(voice: Voice) {
    const ctx = shared!.ctx;
    return (voice.offset + (ctx.currentTime - voice.ctxStart)) % voice.loopEnd;
  }

  /** Where a voice started right now should begin. */
  private targetPosition(video: HTMLVideoElement | null, videoActive: boolean) {
    if (videoActive && video) return wrap(video.currentTime + this.latency());
    if (this.voice) return this.voicePosition(this.voice);
    // Audio-only: start where the visible frame is (the poster is frame 0).
    return video && this.opts.videoClockAllowed() ? wrap(video.currentTime) : 0;
  }

  private startVoice(style: HeroStyleId, buffer: AudioBuffer, position: number, fade: number): Voice {
    const { ctx, master } = shared!;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = Math.min(buffer.duration, HERO_LOOP_SECONDS);
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + fade);
    source.connect(gain);
    gain.connect(master);
    const offset = position % source.loopEnd;
    source.start(t, offset);
    return { style, source, gain, ctxStart: t, offset, loopEnd: source.loopEnd };
  }

  private stopVoice(voice: Voice, fade: number) {
    const ctx = shared!.ctx;
    const t = ctx.currentTime;
    const g = voice.gain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(0, t + fade);
    try {
      voice.source.stop(t + fade + 0.02);
    } catch {
      /* already stopped */
    }
    voice.source.onended = () => {
      voice.source.disconnect();
      voice.gain.disconnect();
    };
  }

  private resync(fade: number) {
    const voice = this.voice;
    const buffer = voice?.source.buffer;
    if (!voice || !buffer) return;
    const video = this.opts.getVideo();
    const position = this.targetPosition(video, this.videoActive(video));
    this.voice = this.startVoice(voice.style, buffer, position, fade);
    this.stopVoice(voice, fade);
    this.lastResyncAt = performance.now();
    this.overCount = 0;
  }

  private startLoop() {
    if (this.raf) return;
    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      this.tick();
    };
    this.raf = requestAnimationFrame(tick);
  }

  private tick() {
    const voice = this.voice;
    if (!voice || !shared) return;
    const now = performance.now();
    const video = this.opts.getVideo();
    if (!this.videoActive(video)) {
      this.videoWasActive = false;
      this.lastVideoTime = -1;
      return;
    }

    const vt = video.currentTime;
    const looped = this.lastVideoTime >= 0 && vt + HERO_LOOP_SECONDS / 2 < this.lastVideoTime;
    this.lastVideoTime = vt;

    if (!this.videoWasActive) {
      // The video (re)started while the audio was its own clock: bring the picture to the sound.
      this.videoWasActive = true;
      video.currentTime = wrap(this.voicePosition(voice) - this.latency());
      this.settleUntil = now + SETTLE_AFTER_SEEK_MS;
      this.nextCheckAt = this.settleUntil;
    } else if (looped) {
      this.stats.loops++;
      this.resync(LOOP_FADE);
      this.nextCheckAt = now + CHECK_EVERY_MS;
    } else if (now >= this.nextCheckAt && now >= this.settleUntil) {
      this.nextCheckAt = now + CHECK_EVERY_MS;
      const drift = circularDiff(this.voicePosition(voice), vt + this.latency());
      const driftMs = drift * 1000;
      this.stats.lastDriftMs = driftMs;
      this.stats.samples++;
      this.stats.maxAbsDriftMs = Math.max(this.stats.maxAbsDriftMs, Math.abs(driftMs));
      this.overCount = Math.abs(drift) > DRIFT_LIMIT ? this.overCount + 1 : 0;
      if (this.overCount >= 2 && now - this.lastResyncAt > MIN_RESYNC_GAP_MS) {
        this.stats.resyncs++;
        this.resync(RESYNC_FADE);
      }
      this.opts.onStats?.({ ...this.stats });
    }
  }
}
