import Link from "next/link";

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full text-base shadow-soft transition duration-300 group-hover:bg-gold group-hover:text-white ${
          dark ? "bg-gold-soft text-gold-dark" : "bg-ink text-gold"
        }`}
      >
        ♫
      </span>
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        Sve za svadbu
      </span>
    </Link>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <Link
            href="/prijava"
            className="rounded-full border border-stone-300/80 bg-white/60 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-gold hover:text-gold-dark"
          >
            Za ponuđače
          </Link>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="grain relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="absolute -top-32 right-[10%] h-64 w-64 animate-[drift2_18s_ease-in-out_infinite] rounded-full bg-gold/15 blur-[90px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="space-y-3">
            <Logo dark />
            <p className="max-w-sm text-sm leading-relaxed text-stone-400">
              Bendovi, fotografi, prostori, dekoracije i sve ostalo za tvoj dan.
              Uporedi cene i pošalji upit — bez registracije.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-400">
            <Link
              href="/registracija"
              className="transition hover:text-gold"
            >
              Registruj svoju ponudu
            </Link>
            <Link href="/prijava" className="transition hover:text-gold">
              Prijava
            </Link>
          </div>
        </div>
        {/* džinovski wordmark — potpis na dnu svake strane */}
        <div
          aria-hidden
          className="text-outline pointer-events-none relative -mb-[2vw] overflow-hidden text-center font-display text-[13.5vw] leading-none font-semibold tracking-tight whitespace-nowrap select-none"
        >
          Sve za svadbu
        </div>
        <div className="relative border-t border-white/5">
          <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone-600 sm:px-6">
            ♫ Sve za svadbu — katalog svadbenih usluga za BiH
          </p>
        </div>
      </footer>
    </div>
  );
}
