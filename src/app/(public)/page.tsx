import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/band-card";
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
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Pronađi bend za svadbu
        </h1>
        <p className="max-w-2xl text-stone-600">
          Poslušaj snimke, uporedi cene i pošalji upit bez registracije.
          Bendovi sviraju na celoj teritoriji BiH — i šire.
        </p>
      </section>

      <form
        method="get"
        action="/"
        className="flex flex-wrap items-end gap-3 rounded-xl border border-stone-200 bg-white p-4"
      >
        <div className="space-y-1">
          <label htmlFor="zanr" className="text-xs font-medium text-stone-500">
            Žanr
          </label>
          <select
            id="zanr"
            name="zanr"
            defaultValue={zanr ?? ""}
            className="block rounded-md border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">Svi žanrovi</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="cena" className="text-xs font-medium text-stone-500">
            Budžet
          </label>
          <select
            id="cena"
            name="cena"
            defaultValue={budget ? String(budget) : ""}
            className="block rounded-md border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">Svejedno</option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                do {b.toLocaleString("sr-Latn-BA")} KM
              </option>
            ))}
          </select>
        </div>
        <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          Filtriraj
        </button>
        {(zanr || budget) && (
          <Link href="/" className="py-2 text-sm text-stone-500 underline">
            Poništi
          </Link>
        )}
      </form>

      {bands.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Nema bendova za izabrane filtere. Probaj da proširiš pretragu.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bands.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-2 text-sm">
          {page > 1 && (
            <Link
              href={pageUrl(page - 1)}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 hover:bg-stone-100"
            >
              ← Prethodna
            </Link>
          )}
          <span className="px-2 text-stone-500">
            Strana {page} od {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageUrl(page + 1)}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 hover:bg-stone-100"
            >
              Sledeća →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
