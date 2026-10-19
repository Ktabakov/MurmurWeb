"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

/**
 * Hidden hero-video diagnostics: open the site with ?perf=1. Shows live frame stats and toggles each effect
 * that sits on top of the lake clip, so you can see which one costs frames on a given machine.
 * Nothing renders (and nothing runs) without the query flag.
 *
 * "Blur" and "Blend" bring back the heavier look the hero used to have (backdrop blur on the chips and panel,
 * a screen-blend glow); everything else switches the current look's effects off.
 */

type Toggle = "blur" | "blend" | "float" | "grade" | "ui" | "play";

const DEFAULTS: Record<Toggle, boolean> = { blur: false, blend: false, float: true, grade: true, ui: true, play: true };

const LABELS: Record<Toggle, string> = {
  blur: "Backdrop blur on chips + panel (old look)",
  blend: "Screen-blend glow (old look)",
  float: "Chip float animation",
  grade: "Gradient overlays on the video",
  ui: "Chips + Score panel",
  play: "Video playing",
};

/** One rule per toggle, applied only while its state differs from the default look. */
const RULES: Record<Toggle, { on?: string; off?: string }> = {
  blur: {
    on: `[data-perf="chip"]{backdrop-filter:blur(24px)!important}[data-perf="panel"]{backdrop-filter:blur(40px)!important}`,
  },
  blend: { on: `[data-perf="glow"]{mix-blend-mode:screen!important}` },
  float: { off: `[data-perf="chip"]{animation:none!important}` },
  grade: { off: `[data-perf="grade"],[data-perf="glow"]{display:none!important}` },
  ui: { off: `[data-perf="chip"],[data-perf="panel"]{visibility:hidden!important}` },
  play: {},
};

type Stats = {
  fps: number;
  p95: number;
  max: number;
  videoFps: number;
  dropped: number;
  total: number;
};

const EMPTY: Stats = { fps: 0, p95: 0, max: 0, videoFps: 0, dropped: 0, total: 0 };
const WINDOW_MS = 5000;

const subscribe = () => () => {};
const readFlag = () => new URLSearchParams(window.location.search).get("perf") === "1";

export function PerfOverlay() {
  const enabled = useSyncExternalStore(subscribe, readFlag, () => false);
  return enabled ? <Panel /> : null;
}

function gpuRenderer(): string {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return "no WebGL (software rendering likely)";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "hidden by browser";
  } catch {
    return "unknown";
  }
}

function Panel() {
  const [state, setState] = useState<Record<Toggle, boolean>>(DEFAULTS);
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [gpu] = useState(gpuRenderer);
  const baseline = useRef({ dropped: 0, total: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const css = useMemo(
    () =>
      (Object.keys(RULES) as Toggle[])
        .map((k) => (state[k] === DEFAULTS[k] ? "" : state[k] ? RULES[k].on ?? "" : RULES[k].off ?? ""))
        .join(""),
    [state]
  );

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('video[data-perf="video"]');
    videoRef.current = video;
    if (!video) return;
    if (state.play) video.play().catch(() => {});
    else video.pause();
  }, [state.play]);

  // Rolling window of compositor frame gaps + presented video frames
  useEffect(() => {
    const frames: { t: number; gap: number }[] = [];
    const videoFrames: number[] = [];
    let raf = 0;
    let rvfc = 0;
    let last = performance.now();
    const video = document.querySelector<HTMLVideoElement>('video[data-perf="video"]');

    const tick = (now: number) => {
      frames.push({ t: now, gap: now - last });
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVideoFrame = (now: number) => {
      videoFrames.push(now);
      rvfc = video!.requestVideoFrameCallback(onVideoFrame);
    };
    if (video && "requestVideoFrameCallback" in video) rvfc = video.requestVideoFrameCallback(onVideoFrame);

    const timer = window.setInterval(() => {
      const now = performance.now();
      while (frames.length && now - frames[0].t > WINDOW_MS) frames.shift();
      while (videoFrames.length && now - videoFrames[0] > WINDOW_MS) videoFrames.shift();
      const span = Math.max(1, Math.min(WINDOW_MS, now - (frames[0]?.t ?? now)));
      const gaps = frames.map((f) => f.gap).sort((a, b) => a - b);
      const q = video?.getVideoPlaybackQuality?.();
      setStats({
        fps: (frames.length / span) * 1000,
        p95: gaps.length ? gaps[Math.min(gaps.length - 1, Math.floor(gaps.length * 0.95))] : 0,
        max: gaps.length ? gaps[gaps.length - 1] : 0,
        videoFps: (videoFrames.length / span) * 1000,
        dropped: (q?.droppedVideoFrames ?? 0) - baseline.current.dropped,
        total: (q?.totalVideoFrames ?? 0) - baseline.current.total,
      });
    }, 500);

    return () => {
      cancelAnimationFrame(raf);
      if (video && rvfc && "cancelVideoFrameCallback" in video) video.cancelVideoFrameCallback(rvfc);
      window.clearInterval(timer);
    };
  }, []);

  const reset = useCallback(() => {
    const q = videoRef.current?.getVideoPlaybackQuality?.();
    baseline.current = { dropped: q?.droppedVideoFrames ?? 0, total: q?.totalVideoFrames ?? 0 };
  }, []);

  const toggle = (k: Toggle) => {
    setState((s) => ({ ...s, [k]: !s[k] }));
    reset();
  };

  const report = () => {
    const v = videoRef.current;
    const lines = [
      `Murmur hero perf report`,
      `Screen ${screen.width}x${screen.height} @${window.devicePixelRatio}x, window ${innerWidth}x${innerHeight}`,
      `Video element ${v?.clientWidth}x${v?.clientHeight} showing ${v?.videoWidth}x${v?.videoHeight} (${v?.currentSrc.split("/").pop()})`,
      `GPU: ${gpu}`,
      `UA: ${navigator.userAgent}`,
      `Toggles: ${(Object.keys(state) as Toggle[]).map((k) => `${k}=${state[k] ? "on" : "off"}`).join(" ")}`,
      `Last 5 s: ${stats.fps.toFixed(0)} fps, p95 ${stats.p95.toFixed(1)} ms, worst ${stats.max.toFixed(0)} ms, video ${stats.videoFps.toFixed(0)}/30 fps, dropped ${stats.dropped}/${stats.total}`,
    ];
    navigator.clipboard?.writeText(lines.join("\n")).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      },
      () => {}
    );
  };

  const bad = stats.videoFps > 0 && (stats.videoFps < 27 || stats.fps < 50);
  const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 99999,
        width: open ? 300 : "auto",
        background: "rgba(10,7,18,0.95)",
        color: "#eee",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 10,
        padding: 10,
        font: `12px/1.4 ${mono}`,
      }}
    >
      <style>{css}</style>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <strong style={{ color: bad ? "#ff8a8a" : "#9dffb0" }}>
          {stats.fps.toFixed(0)} fps · video {stats.videoFps.toFixed(0)}/30 · dropped {stats.dropped}
        </strong>
        <button type="button" onClick={() => setOpen((o) => !o)} style={{ color: "#ccc" }}>
          {open ? "–" : "+"}
        </button>
      </div>
      {open && (
        <>
          <div style={{ marginTop: 4, opacity: 0.8 }}>
            p95 {stats.p95.toFixed(1)} ms · worst {stats.max.toFixed(0)} ms · {stats.dropped}/{stats.total} dropped
          </div>
          <div style={{ marginTop: 2, opacity: 0.6 }}>
            {innerWidth}×{innerHeight} @{window.devicePixelRatio}x · {gpu}
          </div>
          <div style={{ marginTop: 8, display: "grid", gap: 3 }}>
            {(Object.keys(LABELS) as Toggle[]).map((k) => (
              <label key={k} style={{ display: "flex", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={state[k]} onChange={() => toggle(k)} />
                <span>{LABELS[k]}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button type="button" onClick={reset} style={{ border: "1px solid #666", borderRadius: 6, padding: "2px 8px" }}>
              Reset counts
            </button>
            <button type="button" onClick={report} style={{ border: "1px solid #666", borderRadius: 6, padding: "2px 8px" }}>
              {copied ? "Copied" : "Copy report"}
            </button>
          </div>
          <div style={{ marginTop: 6, opacity: 0.55 }}>Change one toggle, wait ~5 s, read fps. Green = smooth.</div>
        </>
      )}
    </div>
  );
}
