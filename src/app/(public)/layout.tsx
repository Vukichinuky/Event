import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-base text-gold shadow-soft transition duration-300 group-hover:bg-gold group-hover:text-white">
        ♫
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
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

      <footer className="border-t border-stone-200/60 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="space-y-2">
            <p className="font-display text-lg font-semibold text-ink">
              Svadbeni bendovi
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-stone-500">
              Poslušaj kako sviraju, uporedi cene i pošalji upit — bez
              registracije. Bendovi sviraju na celoj teritoriji BiH i šire.
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm text-stone-500">
            <Link href="/registracija" className="transition hover:text-gold-dark">
              Registruj svoj bend
            </Link>
            <Link href="/prijava" className="transition hover:text-gold-dark">
              Prijava
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
