import { clsx } from "clsx";

type PlasmaOrbProps = {
  className?: string;
  /** Overall visual footprint in px (glow extends a little beyond this). */
  size?: number;
};

/**
 * The signature Murmur element, matching the app's processing orb: a small,
 * bright lilac core with heavily layered glow, a soft lilac plasma cloud, and
 * a large dim violet atmosphere that bleeds outward and fades to nothing.
 *
 * Layers are centered via explicit left/top offsets (not transforms) so the
 * pulse/wobble keyframes — which animate `transform` — keep them centered.
 */
export function PlasmaOrb({ className, size = 340 }: PlasmaOrbProps) {
  const core = Math.round(size * 0.22);
  const plasma = Math.round(size * 0.5);

  return (
    <div
      className={clsx("pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="orb-atmosphere absolute inset-0 rounded-full" />
      <div
        className="orb-plasma absolute rounded-full"
        style={{
          width: plasma,
          height: plasma,
          left: (size - plasma) / 2,
          top: (size - plasma) / 2,
        }}
      />
      <div
        className="orb-core absolute rounded-full"
        style={{
          width: core,
          height: core,
          left: (size - core) / 2,
          top: (size - core) / 2,
        }}
      />
    </div>
  );
}
