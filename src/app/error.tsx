"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-cream p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.16),transparent_70%)]"
      />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft text-3xl shadow-soft">
        🎻
      </div>
      <h1 className="relative font-display text-3xl font-semibold tracking-tight text-ink">
        Nešto je pošlo po zlu
      </h1>
      <p className="relative max-w-md leading-relaxed text-stone-600">
        Greška je na našoj strani, ne tvojoj. Probaj ponovo — ako se ponavlja,
        vrati se malo kasnije.
      </p>
      <button
        onClick={reset}
        className="relative inline-flex cursor-pointer items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-stone-800"
      >
        Pokušaj ponovo
      </button>
    </main>
  );
}
