import { clsx } from "clsx";

/** An app screenshot (1206×2622 source, iPhone 17 Pro) in a simple rounded phone frame. */
export function PhoneShot({
  src,
  alt,
  className,
  frameClassName,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Border/shadow colours for the frame, per theme. */
  frameClassName?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[2rem] border-[6px] border-[#1b1712] bg-[#1b1712] sm:rounded-[2.4rem] sm:border-[7px]",
        frameClassName,
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        width={603}
        height={1311}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full rounded-[1.6rem] sm:rounded-[1.95rem]"
      />
    </div>
  );
}
