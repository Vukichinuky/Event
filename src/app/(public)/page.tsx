import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/band-card";
import { ui } from "@/lib/ui";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

const BUDGET_OPTIONS = [2000, 3000, 4000, 5000];

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ zanr?: string; cena?: string; strana?: string }>;
}) {
  const { zanr, cena, strana } = await searchParams;
  const budget = Number(cena) > 0 ? Number(cena) : null;
  const page = Math.max(1, Number(strana) || 1);

  const where: Prisma.BandWhereInput = {
    status: "PUBLISHED",
    ...(zanr ? { genres: { some: { slug: zanr } } } : {}),
    ...(budget ? { priceFrom: { lte: budget } } : {}),
  };

  const [genres, total, bands] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.band.count({ where }),
    prisma.band.findMany({
      where,
      include: { genres: true },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (zanr) params.set("zanr", zanr);
    if (budget) params.set("cena", String(budget));
    if (p > 1) params.set("strana", String(p));
    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_-10%,rgb(176_141_87/0.16),transparent_70%)]"
        />
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p
            className={`${ui.eyebrow} animate-[rise_0.5s_ease-out_both]`}
          >
            Katalog svadbenih bendova · BiH i šire
          </p>
          <h1 className="mt-4 max-w-3xl animate-[rise_0.5s_ease-out_0.08s_both] font-display text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-6xl">
            Bend koji će tvoju svadbu
            <br />
            <em className="font-light text-gold-dark italic">
              držati na nogama.
            </em>
          </h1>
          <p className="mt-5 max-w-xl animate-[rise_0.5s_ease-out_0.16s_both] text-base leading-relaxed text-stone-600 sm:text-lg">
            Poslušaj snimke sa pravih svadbi, uporedi cene i pošalji upit za
            svoj datum — bez registracije, za dva minuta.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 sm:px-6">
        {/* Filteri */}
        <form
          method="get"
          action="/"
          className="flex animate-[rise_0.5s_ease-out_0.24s_both] flex-wrap items-end gap-4 rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-soft backdrop-blur-sm"
        >
          <div className="space-y-1.5">
            <label htmlFor="zanr" className={ui.label}>
              Žanr
            </label>
            <select id="zanr" name="zanr" defaultValue={zanr ?? ""} className={ui.input}>
              <option value="">Svi žanrovi</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cena" className={ui.label}>
              Budžet
            </label>
            <select
              id="cena"
              name="cena"
              defaultValue={budget ? String(budget) : ""}
              className={ui.input}
            >
              <option value="">Svejedno</option>
              {BUDGET_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  do {b.toLocaleString("sr-Latn-BA")} KM
                </option>
              ))}
            </select>
          </div>
          <button className={ui.btnPrimary}>Pronađi bend</button>
          {(zanr || budget) && (
            <Link
              href="/"
              className="py-2.5 text-sm text-stone-500 underline-offset-4 transition hover:text-ink hover:underline"
            >
              Poništi filtere
            </Link>
          )}
          <p className="ml-auto hidden self-center text-sm text-stone-400 sm:block">
            {total} {total === 1 ? "bend" : total < 5 && total > 0 ? "benda" : "bendova"}
          </p>
        </form>

        {/* Grid */}
        {bands.length === 0 ? (
          <div className={ui.emptyState}>
            <p className="font-display text-lg text-ink">
              Nema bendova za izabrane filtere
            </p>
            <p className="mt-1">
              Probaj da proširiš pretragu — bendovi putuju po celoj državi.
            </p>
          </div>
        ) : (
          <div className="grid animate-[fade_0.6s_ease-out_both] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bands.map((band) => (
              <BandCard key={band.id} band={band} />
            ))}
          </div>
        )}

        {/* Paginacija */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 pt-4 text-sm">
            {page > 1 && (
              <Link href={pageUrl(page - 1)} className={ui.btnGhost}>
                ← Prethodna
              </Link>
            )}
            <span className="px-2 text-stone-500">
              Strana {page} od {totalPages}
            </span>
            {page < totalPages && (
              <Link href={pageUrl(page + 1)} className={ui.btnGhost}>
                Sledeća →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
