"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 p-8 text-center">
      <div className="text-5xl">🎻</div>
      <h1 className="text-2xl font-bold text-stone-900">
        Nešto je pošlo po zlu
      </h1>
      <p className="max-w-md text-stone-600">
        Greška je na našoj strani, ne tvojoj. Probaj ponovo — ako se ponavlja,
        vrati se malo kasnije.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
      >
        Pokušaj ponovo
      </button>
    </main>
  );
}
