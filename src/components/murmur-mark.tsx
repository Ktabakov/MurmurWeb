import { clsx } from "clsx";

type MurmurMarkProps = {
  className?: string;
  size?: number;
};

/**
 * App icon motif: a dark purple rounded square holding vertical lilac
 * waveform bars.
 */
export function MurmurMark({ className, size = 36 }: MurmurMarkProps) {
  const bars = [0.42, 0.78, 1, 0.62, 0.86, 0.5];

  return (
    <span
      className={clsx(
        "relative inline-flex items-center justify-center overflow-hidden rounded-[28%]",
        className
      )}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(155deg, #1a1830 0%, #0f0d1c 100%)",
        boxShadow: "inset 0 0 0 1px rgba(218,189,255,0.16), 0 0 18px rgba(173,99,255,0.3)",
      }}
      aria-hidden="true"
    >
      <span className="flex h-1/2 items-center gap-[2px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: Math.max(2, size * 0.07),
              height: `${h * 100}%`,
              background: "linear-gradient(to bottom, #eddcff, #c59aff)",
              boxShadow: "0 0 6px rgba(197,154,255,0.6)",
            }}
          />
        ))}
      </span>
    </span>
  );
}
