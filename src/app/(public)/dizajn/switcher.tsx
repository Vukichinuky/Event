import Link from "next/link";

// Plutajući prekidač za poređenje dizajn varijanti
export function VariantSwitcher({ active }: { active: 1 | 2 | 3 }) {
  const variants = [
    { n: 1, label: "Noir" },
    { n: 2, label: "Romantika" },
    { n: 3, label: "Moderno" },
  ] as const;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-stone-300/60 bg-white/90 p-1.5 shadow-lift backdrop-blur-xl">
      <span className="px-2.5 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
        Dizajn
      </span>
      {variants.map((v) => (
        <Link
          key={v.n}
          href={`/dizajn/${v.n}`}
          className={
            v.n === active
              ? "rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white"
              : "rounded-full px-4 py-1.5 text-sm font-medium text-stone-500 transition hover:text-ink"
          }
        >
          {v.n} · {v.label}
        </Link>
      ))}
    </div>
  );
}
