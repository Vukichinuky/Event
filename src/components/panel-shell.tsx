import Link from "next/link";
import { signOutAction } from "@/lib/session-actions";

// Zajednička školjka admin i bend panela — staklasti header + sadržaj
export function PanelShell({
  brand,
  badge,
  links,
  email,
  children,
}: {
  brand: string;
  badge?: string;
  links: { href: string; label: string }[];
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <Link href="/" className="mr-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm text-gold">
                ♫
              </span>
              <span className="hidden font-display text-base font-semibold tracking-tight text-ink md:inline">
                {brand}
              </span>
              {badge && (
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold-dark uppercase">
                  {badge}
                </span>
              )}
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="flex items-center gap-3">
            <span className="hidden text-sm text-stone-400 sm:inline">
              {email}
            </span>
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-stone-300/80 px-3.5 py-1.5 text-sm font-medium text-stone-600 transition hover:border-stone-400 hover:text-ink"
            >
              Odjava
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
