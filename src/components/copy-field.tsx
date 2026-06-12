"use client";

import { useState } from "react";

// Polje sa vrednošću i dugmetom za kopiranje (link profila, kalendar feed…)
export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex gap-2">
      <input
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full min-w-0 flex-1 rounded-xl border border-stone-200 bg-cream/60 px-4 py-2.5 text-sm text-stone-600 focus:outline-none"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // starije browsere pokriva ručno selektovanje na fokus
          }
        }}
        className="shrink-0 cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-stone-800"
      >
        {copied ? "Kopirano ✓" : "Kopiraj"}
      </button>
    </div>
  );
}
