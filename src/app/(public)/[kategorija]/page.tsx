import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/band-card";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;
const BUDGET_OPTIONS = [2000, 3000, 4000, 5000];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategorija: string }>;
}): Promise<Metadata> {
  const { kategorija } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: kategorija },
  });
  if (!category) return {};
  return {
    title: `${category.name} za svadbu`,
    description: `${category.name} za svadbu u BiH — pogledaj ponude, uporedi cene i pošalji upit bez registracije.`,
  };
}

export default async function KategorijaPage({
  params,
  searchParams,
}: {
  params: Promise<{ kategorija: string }>;
  searchParams: Promise<{ zanr?: string; cena?: string; strana?: string }>;
}) {
  const { kategorija } = await params;
  const { zanr, cena, strana } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug: kategorija },
  });
  if (!category) notFound();

  const isBend = category.slug === "bendovi";
  const budget = Number(cena) > 0 ? Number(cena) : null;
  const page = Math.max(1, Number(strana) || 1);

  const where: Prisma.BandWhereInput = {
    status: "PUBLISHED",
    categoryId: category.id,
    ...(isBend && zanr ? { genres: { some: { slug: zanr } } } : {}),
    ...(budget ? { priceFrom: { lte: budget } } : {}),
  };

  const [genres, total, bands] = await Promise.all([
    isBend
      ? prisma.genre.findMany({ orderBy: { name: "asc" } })
      : Promise.resolve([]),
    prisma.band.count({ where }),
    prisma.band.findMany({
      where,
      include: { genres: true, category: true },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageUrl = (p: number) => {
    const query = new URLSearchParams();
    if (zanr) query.set("zanr", zanr);
    if (budget) query.set("cena", String(budget));
    if (p > 1) query.set("strana", String(p));
    const qs = query.toString();
    return qs ? `/${category.slug}?${qs}` : `/${category.slug}`;
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <nav className="animate-[rise_0.4s_ease-out_both] text-sm text-stone-500">
          <Link href="/" className="transition hover:text-gold-dark">
            ← Sve kategorije
          </Link>
        </nav>
        <p className={`${ui.eyebrow} animate-[rise_0.5s_ease-out_0.05s_both]`}>
          Kategorija
        </p>
        <h1 className="animate-[rise_0.5s_ease-out_0.1s_both] font-display text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
          {category.name}{" "}
          <em className={`font-light italic ${ui.goldText}`}>za svadbu</em>
        </h1>
      </header>

      <form
        method="get"
        action={`/${category.slug}`}
        className="flex animate-[rise_0.5s_ease-out_0.15s_both] flex-wrap items-end gap-4 rounded-2xl border border-stone-200/70 bg-white/90 p-5 shadow-soft backdrop-blur-xl"
      >
        {isBend && (
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
        )}
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
        <button className={ui.btnPrimary}>Filtriraj</button>
        {(zanr || budget) && (
          <Link
            href={`/${category.slug}`}
            className="py-2.5 text-sm text-stone-500 underline-offset-4 transition hover:text-ink hover:underline"
          >
            Poništi
          </Link>
        )}
        <p className="ml-auto hidden self-center text-sm text-stone-400 sm:block">
          {total} {total === 1 ? "ponuda" : "ponuda"}
        </p>
      </form>

      {bands.length === 0 ? (
        <div className={ui.emptyState}>
          <p className="font-display text-lg text-ink">
            U ovoj kategoriji još nema ponuda
          </p>
          <p className="mt-1">
            Katalog raste svake nedelje — pogledaj ostale kategorije.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bands.map((band, i) => (
            <Reveal key={band.id} delay={(i % 3) * 90}>
              <BandCard band={band} />
            </Reveal>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3 pt-2 text-sm">
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
    </main>
  );
}
