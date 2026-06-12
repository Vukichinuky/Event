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
        Svadbeni bendovi
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
            Za bendove
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
              Poslušaj kako sviraju, uporedi cene i pošalji upit — bez
              registracije. Bendovi sviraju na celoj teritoriji BiH i šire.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-400">
            <Link
              href="/registracija"
              className="transition hover:text-gold"
            >
              Registruj svoj bend
            </Link>
            <Link href="/prijava" className="transition hover:text-gold">
              Prijava
            </Link>
          </div>
        </div>
        <div className="relative border-t border-white/5">
          <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone-600 sm:px-6">
            ♫ Svadbeni bendovi — katalog svadbenih bendova za BiH
          </p>
        </div>
      </footer>
    </div>
  );
}
