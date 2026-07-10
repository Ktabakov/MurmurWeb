"use client";

import { clsx } from "clsx";
import { useEffect, useRef } from "react";

type NoiseWaveformHeroProps = {
  className?: string;
};

/**
 * Noise resolving into a waveform — the "vague prompt becoming music" motif.
 * A superset of `SoundWaveBars`: same interactive vertical-bar EQ + hover
 * response, plus a noise-origin animation wrapped around it.
 *
 * Two layers share one column layout (37 bars, same falloff shape as
 * `sound-wave-bars.tsx`):
 *
 * 1. A canvas 2D particle field (plain `<canvas>` + requestAnimationFrame,
 *    no WebGL/deps) that starts as scattered static, converges — left to
 *    right, staggered — onto the bar columns, and later dissolves back to
 *    noise. Glow is pre-rendered once into a small grid of radial-gradient
 *    sprites (chaos-violet → `.wave-bar` gradient color, indexed by
 *    [convergence progress][position within the bar]) and stamped via
 *    `drawImage`, so per-frame cost is one draw per particle instead of
 *    per-particle `shadowBlur`.
 * 2. A real DOM bar layer — literal `.wave-bar` rounded-full divs,
 *    absolutely positioned at the same column x-centers/base-heights the
 *    particles converge onto — which is what actually renders once
 *    "resolved". Particles look dotty at any density; DOM bars render the
 *    exact same crisp gradient the rest of the site already uses, and give
 *    hover interactivity for free.
 *
 * As the field's overall convergence crosses ~0.6→0.9 the canvas fades out
 * and the DOM layer fades in (and symmetrically in reverse on dissolve),
 * so the only moment particles are visible is while they're still visibly
 * mid-flight — by the time the crossfade completes they're already at rest
 * on the bar targets underneath. Pointer events are enabled on the DOM
 * layer only once it's mostly faded in, so it never intercepts hover
 * during chaos. Hovering the resolved bars reproduces `SoundWaveBars`'
 * exact gaussian falloff (`Math.exp(-(hoverDistance ** 2) / 14) * 0.42`).
 * Pointer position is also tracked in 2D canvas-space on the outer
 * container (independent of which layer is on top), so particles visible
 * during chaos/converging/dissolving get pushed away from the cursor and
 * brighten/enlarge nearby — recomputed fresh every frame from each
 * particle's current position, not an accumulated simulation, so it
 * settles back to nothing the instant the pointer leaves.
 *
 * Bar "breathing" and hover are applied via `transform: scaleY()` /
 * `opacity` only (never the `height` CSS property) so per-frame DOM
 * updates stay on the compositor thread — no layout thrash across 37
 * elements at 60fps.
 *
 * Honors prefers-reduced-motion by freezing the clock at a fixed point
 * inside the "hold" phase (rather than a separate static code path), which
 * naturally settles the crossfade on the DOM bars and stops canvas/bar
 * motion — while hover still works, updated on demand from pointer events
 * rather than a continuous rAF loop. Pauses entirely when scrolled
 * off-screen or the tab is hidden.
 */
export function NoiseWaveformHero({ className }: NoiseWaveformHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barsWrapRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const barsWrap = barsWrapRef.current;
    if (!container || !canvas || !barsWrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ----- timeline (seconds) --------------------------------------------
    const CYCLE = 11; // full chaos → order → chaos loop
    const CONVERGE_START = 0.5; // chaos breathing room at loop start
    const CONVERGE_STAGGER = 1.6; // per-column delay span (l→r sweep)
    const CONVERGE_DUR = 1.7; // each particle's eased travel time
    const DISSOLVE_START = 7.4;
    const DISSOLVE_STAGGER = 1.2; // dissolve is randomized, not swept
    const DISSOLVE_DUR = 1.4;
    const HOLD_T = CONVERGE_START + CONVERGE_STAGGER + CONVERGE_DUR + 1.5; // mid-hold instant

    // ----- helpers --------------------------------------------------------
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (v: number) => {
      const t = clamp01(v);
      return t * t * (3 - 2 * t); // smoothstep ease-in-out
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ----- color ramps ------------------------------------------------------
    // Chaos = dim violet static. Resolved = the exact `.wave-bar` gradient
    // stops from globals.css, sampled by a particle's position within its
    // bar (0 = top/transparent, 1 = bottom/gen-end):
    //   transparent 0% -> lilac-fixed 14% -> lilac 42% -> lilac-glow 70% -> gen-end 100%
    const CHAOS_CORE = [176, 120, 232];
    const CHAOS_HALO = [109, 22, 217];
    const resolvedStops: { p: number; rgb: number[]; a: number }[] = [
      { p: 0, rgb: [248, 220, 255], a: 0 }, // transparent (lilac-fixed hue, zero alpha)
      { p: 0.14, rgb: [248, 220, 255], a: 0.85 }, // --color-lilac-fixed
      { p: 0.42, rgb: [238, 189, 255], a: 0.92 }, // --color-lilac
      { p: 0.7, rgb: [227, 154, 255], a: 1 }, // --color-lilac-glow
      { p: 1, rgb: [220, 99, 255], a: 1 }, // --color-gen-end
    ];

    const lerpRgb = (a: number[], b: number[], t: number) => [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t),
    ];

    const sampleResolved = (slot: number) => {
      const t = clamp01(slot);
      for (let k = 0; k < resolvedStops.length - 1; k++) {
        const a = resolvedStops[k];
        const b = resolvedStops[k + 1];
        if (t >= a.p && t <= b.p) {
          const lt = (t - a.p) / (b.p - a.p || 1);
          return { rgb: lerpRgb(a.rgb, b.rgb, lt), a: lerp(a.a, b.a, lt) };
        }
      }
      return resolvedStops[resolvedStops.length - 1];
    };

    // ----- glow sprite grid: [convergence progress][slot within bar] -----
    const SPRITE = 64;
    const PR_STEPS = 5;
    const SLOT_STEPS = 6;
    const resolvedAlphaBySlot: number[] = [];
    const spriteGrid: HTMLCanvasElement[][] = [];

    for (let si = 0; si < SLOT_STEPS; si++) {
      const slotT = si / (SLOT_STEPS - 1);
      const resolved = sampleResolved(slotT);
      resolvedAlphaBySlot.push(resolved.a);
      const row: HTMLCanvasElement[] = [];
      for (let pi = 0; pi < PR_STEPS; pi++) {
        const prT = pi / (PR_STEPS - 1);
        const core = lerpRgb(CHAOS_CORE, resolved.rgb, prT);
        const halo = lerpRgb(CHAOS_HALO, resolved.rgb, prT);
        const sprite = document.createElement("canvas");
        sprite.width = SPRITE;
        sprite.height = SPRITE;
        const sctx = sprite.getContext("2d");
        if (!sctx) continue;
        const half = SPRITE / 2;
        const g = sctx.createRadialGradient(half, half, 0, half, half, half);
        g.addColorStop(0, `rgba(${Math.round(core[0])}, ${Math.round(core[1])}, ${Math.round(core[2])}, 0.95)`);
        g.addColorStop(
          0.16,
          `rgba(${Math.round(core[0])}, ${Math.round(core[1])}, ${Math.round(core[2])}, ${lerp(0.5, 0.7, prT)})`,
        );
        g.addColorStop(
          0.42,
          `rgba(${Math.round(halo[0])}, ${Math.round(halo[1])}, ${Math.round(halo[2])}, ${lerp(0.16, 0.2, prT)})`,
        );
        g.addColorStop(1, `rgba(${Math.round(halo[0])}, ${Math.round(halo[1])}, ${Math.round(halo[2])}, 0)`);
        sctx.fillStyle = g;
        sctx.fillRect(0, 0, SPRITE, SPRITE);
        row.push(sprite);
      }
      spriteGrid.push(row);
    }
    if (spriteGrid.length === 0 || spriteGrid[0].length === 0) return;

    // ----- bar columns (the resolved EQ shape) -----------------------------
    // Same count/spacing family as SoundWaveBars (37 bars), with a
    // center-tall / edge-taper falloff mirroring its baseHeight formula.
    const NUM_BARS = 37;
    const HALF_COUNT = (NUM_BARS - 1) / 2;
    const MIN_H_FRAC = 0.11;
    const MAX_H_FRAC = 0.54;
    const HOVER_FALLOFF = 14; // matches SoundWaveBars' gaussian denominator
    const HOVER_MAX = 0.42; // matches SoundWaveBars' hoverBoost multiplier
    const PARTICLE_REPEL_RADIUS = 85; // px, canvas-space interaction radius around the pointer
    const PARTICLE_REPEL_MAX = 24; // px, max push-away displacement at the cursor's center
    const PARTICLE_BRIGHT_BOOST = 0.55; // additive alpha multiplier at the cursor's center
    const PARTICLE_SIZE_BOOST = 0.5; // fractional size increase at the cursor's center

    type Column = {
      centerX: number;
      baseHeight: number;
      maxHeight: number; // intrinsic DOM element height (baseHeight at peak breathe)
      breatheAmp: number;
      breatheSpeed: number;
      breathePhase: number;
      breathe2Speed: number; // faster secondary sine, layered on top of the primary
      breathe2Phase: number;
      delay: number; // left-to-right convergence sweep delay
      dissolveDelay: number; // randomized dissolve delay, mirrors particle delayB
      weight: number; // particle-allocation weight (taller bars get more)
    };

    let columns: Column[] = [];
    let barWidthPx = 0;

    // Two sines at different speeds/phases, weighted 70/30, read as busier
    // and less mechanical than a single clean oscillation — closer to
    // SoundWaveBars' 4-keyframe mirror-repeat than a pure sine wave.
    const breatheWave = (col: Column, t: number, phaseOffset: number) =>
      Math.sin(t * col.breatheSpeed + col.breathePhase + phaseOffset) * 0.7 +
      Math.sin(t * col.breathe2Speed + col.breathe2Phase + phaseOffset * 1.3) * 0.3;

    const columnHeightAt = (col: Column, t: number) => col.baseHeight * (1 + col.breatheAmp * breatheWave(col, t, 0));

    // ----- particles ------------------------------------------------------
    type Particle = {
      colIndex: number;
      slotFrac: number; // fixed position within the bar's vertical span
      xJitter: number; // fixed horizontal offset, fills the bar's width
      sx: number; // scatter (chaos) anchor
      sy: number;
      wAmpX: number; // chaos wander amplitudes / speeds / phases
      wAmpY: number;
      wSpX: number;
      wSpY: number;
      wPhX: number;
      wPhY: number;
      delayA: number; // converge delay (left-to-right sweep + jitter)
      delayB: number; // dissolve delay (randomized)
      size: number;
      twSp: number; // twinkle speed / phase
      twPh: number;
      edgeFalloff: number; // 1 near center, ->0 toward the canvas edges (softens the chaos cloud's boundary)
    };

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const buildColumnsAndParticles = () => {
      const gap = w / NUM_BARS;
      barWidthPx = gap * 0.34;

      columns = Array.from({ length: NUM_BARS }, (_, i) => {
        const centerDistance = Math.abs(i - HALF_COUNT);
        const shapeT = 1 - centerDistance / HALF_COUNT; // 1 at center, 0 at edges
        const jitter = 0.86 + Math.random() * 0.28;
        const baseHeight = (h * MIN_H_FRAC + shapeT * h * (MAX_H_FRAC - MIN_H_FRAC)) * jitter;
        // Wide swing (roughly SoundWaveBars' 62%-100%+ keyframe range) plus a
        // faster secondary sine (added in breatheWave) so the resolved bars
        // read as busier/livelier, not a single mechanical oscillation.
        const breatheAmp = 0.28 + Math.random() * 0.14;
        const breatheSpeed = 0.3 + Math.random() * 0.5;
        return {
          centerX: gap * (i + 0.5),
          baseHeight,
          maxHeight: baseHeight * (1 + breatheAmp),
          breatheAmp,
          breatheSpeed,
          breathePhase: Math.random() * Math.PI * 2,
          breathe2Speed: breatheSpeed * (2.2 + Math.random() * 1.4),
          breathe2Phase: Math.random() * Math.PI * 2,
          delay: (i / (NUM_BARS - 1)) * CONVERGE_STAGGER * 0.78 + Math.random() * CONVERGE_STAGGER * 0.22,
          dissolveDelay: Math.random() * DISSOLVE_STAGGER,
          weight: Math.max(0.25, shapeT),
        };
      });

      // Position/size the DOM bars once per resize — left/width/intrinsic
      // height only; per-frame updates below touch transform/opacity only
      // so they never trigger layout.
      for (let i = 0; i < NUM_BARS; i++) {
        const el = barRefs.current[i];
        const col = columns[i];
        if (!el || !col) continue;
        el.style.left = `${col.centerX - barWidthPx / 2}px`;
        el.style.width = `${barWidthPx}px`;
        el.style.top = "50%";
        el.style.height = `${col.maxHeight}px`;
      }

      // Total particle budget scales with width; deterministic per-column
      // allocation (proportional to bar height, stratified within the
      // column) so every bar fills solidly instead of a random scatter
      // occasionally leaving gaps in tall columns.
      const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
      const count = Math.round(Math.min(2600, Math.max(900, w * 2.6)));

      particles = [];
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const col = columns[colIndex];
        const allocated = Math.max(5, Math.round((col.weight / totalWeight) * count));
        for (let j = 0; j < allocated; j++) {
          const slotFrac = clamp01((j + Math.random()) / allocated);
          const sx = Math.random() * w;
          const sy = h * 0.04 + Math.random() * h * 0.92;
          // Elliptical distance from center (0 = center, 1 = touching the
          // container's edge midpoints, >1 toward the corners). Used to fade
          // chaos-state alpha so the scattered field reads as a soft blob
          // that dissolves into the background instead of a filled
          // rectangle with a visible boundary.
          const nx = (sx - w / 2) / (w / 2);
          const ny = (sy - h / 2) / (h / 2);
          const edgeDist = Math.sqrt(nx * nx + ny * ny);
          const edgeFalloff = smooth(1 - edgeDist * 1.05);
          particles.push({
            colIndex,
            slotFrac,
            xJitter: (Math.random() - 0.5) * barWidthPx,
            sx,
            sy,
            wAmpX: 8 + Math.random() * 22,
            wAmpY: 8 + Math.random() * 22,
            wSpX: 0.25 + Math.random() * 0.55,
            wSpY: 0.25 + Math.random() * 0.55,
            wPhX: Math.random() * Math.PI * 2,
            wPhY: Math.random() * Math.PI * 2,
            delayA: col.delay + Math.random() * 0.12,
            delayB: Math.random() * DISSOLVE_STAGGER,
            size: 0.7 + Math.random() * 0.9,
            twSp: 1.2 + Math.random() * 2.4,
            twPh: Math.random() * Math.PI * 2,
            edgeFalloff,
          });
        }
      }
    };

    // ----- pointer hover (same gaussian falloff as SoundWaveBars, plus a
    // 2D canvas-space position for nudging particles) -----------------------
    // Tracked on the outer `container` (not `barsWrap`) so it keeps updating
    // regardless of which layer — canvas particles or DOM bars — is
    // currently on top/visible; `barsWrap` only has `pointer-events: auto`
    // once mostly faded in, which would otherwise blind tracking during
    // chaos/converging/dissolving.
    let hoverProgress: number | null = null;
    let pointerX: number | null = null;
    let pointerY: number | null = null;

    const hoverBoostFor = (colIndex: number) => {
      if (hoverProgress === null) return 0;
      const hoverCenter = hoverProgress * (NUM_BARS - 1);
      const hoverDistance = Math.abs(colIndex - hoverCenter);
      return Math.exp(-(hoverDistance * hoverDistance) / HOVER_FALLOFF) * HOVER_MAX;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      hoverProgress = clamp01(x / rect.width);
      pointerX = x;
      pointerY = y;
      if (!running) draw(elapsed);
    };
    const onPointerLeave = () => {
      hoverProgress = null;
      pointerX = null;
      pointerY = null;
      if (!running) draw(elapsed);
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // ----- DOM bar layer: transform/opacity only, no layout thrash -------
    const updateBars = (t: number) => {
      for (let i = 0; i < NUM_BARS; i++) {
        const el = barRefs.current[i];
        const col = columns[i];
        if (!el || !col) continue;
        const breatheScale = columnHeightAt(col, t) / col.maxHeight;
        const hoverBoost = hoverBoostFor(i);
        const breatheOpacity = lerp(0.4, 0.95, (breatheWave(col, t, 0.8) + 1) / 2);
        el.style.transform = `translateY(-50%) scaleY(${breatheScale * (1 + hoverBoost)})`;
        el.style.opacity = String(clamp01(breatheOpacity + hoverBoost * 0.28));
      }
    };

    // ----- frame ----------------------------------------------------------
    const draw = (t: number) => {
      const cycle = t % CYCLE;

      // Overall (not per-particle) convergence factor, used purely to
      // crossfade the canvas particle layer against the DOM bar layer.
      const globalRise = smooth(
        (cycle - CONVERGE_START - CONVERGE_STAGGER * 0.5) / (CONVERGE_DUR + CONVERGE_STAGGER * 0.5),
      );
      const globalFall = smooth(
        (cycle - DISSOLVE_START - DISSOLVE_STAGGER * 0.5) / (DISSOLVE_DUR + DISSOLVE_STAGGER * 0.5),
      );
      const globalResolved = clamp01(globalRise * (1 - globalFall));
      // Widened, gradual handoff window (was a tight 0.6→0.9 band): starting
      // the DOM fade-in earlier and finishing it later gives the two layers
      // a long overlap instead of a fast swap.
      const domOpacity = smooth((globalResolved - 0.42) / 0.5);
      const canvasOpacity = 1 - domOpacity;

      canvas.style.opacity = String(canvasOpacity);
      barsWrap.style.opacity = String(domOpacity);
      barsWrap.style.pointerEvents = domOpacity > 0.5 ? "auto" : "none";

      updateBars(t);

      ctx.clearRect(0, 0, w, h);

      const centerY = h * 0.5;

      // ----- ghost fill: a canvas rendering of the *same* bar gradient the
      // DOM layer uses, per column, that solidifies as that column converges
      // (independently of the crossfade above). A flat opacity crossfade
      // between sparse dots and a solid fill always reads as a "pop" no
      // matter how gradual the alpha ramp is, because the two renderings
      // look different at any blend ratio. Painting this proto-bar first
      // means the canvas already looks like a (softer, glowier) version of
      // the DOM bar well before the crossfade starts, so the handoff is
      // between two nearly-identical shapes instead of dots vs. solid.
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < NUM_BARS; i++) {
        const col = columns[i];
        // Defensive: draw() can run once before the initial resize()
        // populates `columns` (e.g. a zero-size container on first
        // measurement) — bail rather than throw.
        if (!col) continue;
        const colRise = smooth((cycle - CONVERGE_START - col.delay) / CONVERGE_DUR);
        const colFall = smooth((cycle - DISSOLVE_START - col.dissolveDelay) / DISSOLVE_DUR);
        const colPr = clamp01(colRise * (1 - colFall));
        if (colPr < 0.02) continue;

        const colH = columnHeightAt(col, t);
        const x0 = col.centerX - barWidthPx / 2;
        const y0 = centerY - colH / 2;
        const grad = ctx.createLinearGradient(0, y0, 0, y0 + colH);
        for (const stop of resolvedStops) {
          grad.addColorStop(
            stop.p,
            `rgba(${stop.rgb[0]}, ${stop.rgb[1]}, ${stop.rgb[2]}, ${stop.a * colPr})`,
          );
        }
        ctx.shadowColor = "rgba(197, 154, 255, 0.5)";
        ctx.shadowBlur = 10 * colPr;
        ctx.fillStyle = grad;
        ctx.fillRect(x0, y0, barWidthPx, colH);
      }
      ctx.shadowBlur = 0;

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = columns[p.colIndex];
        const rise = smooth((cycle - CONVERGE_START - p.delayA) / CONVERGE_DUR);
        const fall = smooth((cycle - DISSOLVE_START - p.delayB) / DISSOLVE_DUR);
        const pr = rise * (1 - fall); // 0 = chaos, 1 = resolved onto the bar

        // Chaos anchor drifts slowly so the static feels alive.
        const cx = p.sx + Math.sin(t * p.wSpX + p.wPhX) * p.wAmpX;
        const cy = p.sy + Math.cos(t * p.wSpY + p.wPhY) * p.wAmpY;

        // Resolved target: a point within this column's bar span, which
        // itself gently breathes so the resolved state stays alive.
        const colH = columnHeightAt(col, t);
        const tx = col.centerX + p.xJitter;
        const ty = centerY - colH / 2 + p.slotFrac * colH;

        const x = lerp(cx, tx, pr);
        const y = lerp(cy, ty, pr);

        // Pointer reaction: push the particle away from the cursor, live
        // and recomputed fresh every frame from its current base position
        // (x, y) and the current pointer position — no accumulated/spring
        // state, so it naturally settles back the instant the pointer moves
        // away or leaves. Also brightens/enlarges nearby particles so the
        // reaction reads clearly rather than as a subtle wobble.
        let px = x;
        let py = y;
        let hoverInfluence = 0;
        if (pointerX !== null && pointerY !== null) {
          const hdx = x - pointerX;
          const hdy = y - pointerY;
          const hoverDist = Math.hypot(hdx, hdy);
          if (hoverDist < PARTICLE_REPEL_RADIUS) {
            hoverInfluence = smooth(1 - hoverDist / PARTICLE_REPEL_RADIUS);
            const dirX = hoverDist > 0.0001 ? hdx / hoverDist : 0;
            const dirY = hoverDist > 0.0001 ? hdy / hoverDist : -1;
            px = x + dirX * hoverInfluence * PARTICLE_REPEL_MAX;
            py = y + dirY * hoverInfluence * PARTICLE_REPEL_MAX;
          }
        }

        const twinkle = Math.sin(t * p.twSp + p.twPh);
        const baseAlpha = lerp(0.2 + 0.1 * twinkle, 0.55 + 0.16 * twinkle, pr);
        // Chaos dots are large and hazy; resolved dots shrink to stay inside
        // their bar column so adjacent bars read as separate, not one blob.
        const size = p.size * lerp(8, 4.8, pr) * (1 + hoverInfluence * PARTICLE_SIZE_BOOST);

        const slotIndex = Math.min(SLOT_STEPS - 1, Math.round(p.slotFrac * (SLOT_STEPS - 1)));
        const prIndex = Math.min(PR_STEPS - 1, Math.round(pr * (PR_STEPS - 1)));
        const sprite = spriteGrid[slotIndex][prIndex];
        // Fade in the gradient's transparent top stop only as the particle
        // resolves onto the bar; chaos particles ignore it.
        const gradAlphaMul = lerp(1, resolvedAlphaBySlot[slotIndex], pr);
        // Dim toward the canvas edges only while still in chaos — softens
        // the scattered field into a blob with no visible rectangular
        // boundary, and fades out entirely once resolved (matching the DOM
        // bars, which aren't dimmed by position).
        const edgeAlphaMul = lerp(p.edgeFalloff, 1, pr);
        const hoverAlphaMul = 1 + hoverInfluence * PARTICLE_BRIGHT_BOOST;

        ctx.globalAlpha = Math.min(1, Math.max(0, baseAlpha * gradAlphaMul * edgeAlphaMul * hoverAlphaMul));
        ctx.drawImage(sprite, px - size / 2, py - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ----- run state ------------------------------------------------------
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMq.matches;
    let inView = false;
    let running = false;
    let raf = 0;
    let elapsed = reduced ? HOLD_T : 0;
    let last = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp tab-jank jumps
      last = now;
      elapsed += dt;
      draw(elapsed);
      raf = requestAnimationFrame(frame);
    };

    const updateRunning = () => {
      const shouldRun = inView && !document.hidden && !reduced;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!running) draw(elapsed);
    };

    // ----- sizing ---------------------------------------------------------
    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumnsAndParticles();
      // Repaint immediately so a paused/reduced layer is never blank/stale.
      draw(elapsed);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        updateRunning();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    const onVisibility = () => updateRunning();
    document.addEventListener("visibilitychange", onVisibility);

    const onReducedChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      if (reduced) elapsed = HOLD_T;
      updateRunning();
    };
    reducedMq.addEventListener("change", onReducedChange);

    updateRunning();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMq.removeEventListener("change", onReducedChange);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={clsx("relative h-[200px] w-full overflow-hidden sm:h-[260px]", className)}>
      {/* Soft horizontal haze behind the bars, echoing SoundWaveBars */}
      <div className="pointer-events-none absolute inset-x-10 top-1/2 h-11 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(218,189,255,0.18),rgba(173,99,255,0.18),transparent)] blur-xl mix-blend-screen" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div ref={barsWrapRef} className="absolute inset-0" style={{ opacity: 0, pointerEvents: "none" }}>
        {Array.from({ length: 37 }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="wave-bar absolute rounded-full"
            style={{ height: 0, opacity: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
