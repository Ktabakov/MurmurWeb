"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { clsx } from "clsx";

/** Which engine's renders the example players on the page use. Orpheus is the app's new default. */
export type SampleEngine = "orpheus" | "magenta";

const EngineContext = createContext<{ engine: SampleEngine; setEngine: (e: SampleEngine) => void }>({
  engine: "orpheus",
  setEngine: () => {},
});

export function EngineSampleProvider({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<SampleEngine>("orpheus");
  return <EngineContext.Provider value={{ engine, setEngine }}>{children}</EngineContext.Provider>;
}

export function useSampleEngine(): SampleEngine {
  return useContext(EngineContext).engine;
}

const OPTIONS: { key: SampleEngine; label: string; sub: string }[] = [
  { key: "orpheus", label: "Orpheus", sub: "New · Powered by Stability AI" },
  { key: "magenta", label: "Magenta RT", sub: "Classic · Google" },
];

/** Segmented switch: every example player below plays the chosen engine's render of the same prompt. */
export function EngineToggle() {
  const { engine, setEngine } = useContext(EngineContext);
  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:mt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-murmur-muted">
        Hear the examples on this page made by
      </p>
      <div role="radiogroup" aria-label="Engine for the examples" className="glass-card flex gap-1 rounded-full p-1">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={engine === o.key}
            onClick={() => setEngine(o.key)}
            className={clsx(
              "rounded-full px-5 py-2 text-left transition-colors sm:px-7",
              engine === o.key ? "bg-lilac/20 text-white" : "text-murmur-text-2 hover:text-white",
            )}
          >
            <span className="block text-sm font-bold sm:text-base">{o.label}</span>
            <span className="block text-[11px] text-murmur-muted">{o.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
