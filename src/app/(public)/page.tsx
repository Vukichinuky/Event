import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/band-card";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

const BUDGET_OPTIONS = [2000, 3000, 4000, 5000];

const STEPS = [
  {
    n: "01",
    title: "Poslušaj snimke",
    text: "Pravi nastupi sa pravih svadbi — ne studijski snimci.",
  },
  {
    n: "02",
    title: "Uporedi cene",
    text: "Svaki bend ima jasan cenovni rang. Bez skrivenih cifara.",
  },
  {
    n: "03",
    title: "Pošalji upit",
    text: "Dva minuta, bez registracije. Bend ti se javlja direktno.",
  },
];

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
      {/* Tamni editorijalni hero */}
      <section className="grain relative overflow-hidden bg-ink">
        {/* lebdeći zlatni oblaci */}
        <div
          aria-hidden
          className="absolute -top-32 right-[-10%] h-[480px] w-[480px] animate-[drift_16s_ease-in-out_infinite] rounded-full bg-gold/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 left-[-15%] h-[420px] w-[420px] animate-[drift2_20s_ease-in-out_infinite] rounded-full bg-[#7a5a2e]/30 blur-[110px]"
        />
        {/* ogromna dekorativna nota */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[4%] hidden -translate-y-1/2 font-display text-[22rem] leading-none text-white/[0.04] select-none lg:block"
        >
          ♫
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-28 sm:px-6 sm:pt-28 sm:pb-36">
          <p className="animate-[rise_0.6s_ease-out_both] text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
            Katalog svadbenih bendova · BiH i šire
          </p>
          <h1 className="mt-5 max-w-3xl animate-[rise_0.6s_ease-out_0.1s_both] font-display text-5xl leading-[1.05] font-semibold tracking-tight text-cream sm:text-7xl">
            Bend koji će tvoju svadbu{" "}
            <em className={`font-light italic ${ui.goldText}`}>
              držati na nogama.
            </em>
          </h1>
          <p className="mt-6 max-w-xl animate-[rise_0.6s_ease-out_0.2s_both] text-base leading-relaxed text-stone-400 sm:text-lg">
            Poslušaj snimke sa pravih svadbi, uporedi cene i pošalji upit za
            svoj datum — bez registracije, za dva minuta.
          </p>
          <div className="mt-9 flex animate-[rise_0.6s_ease-out_0.3s_both] flex-wrap items-center gap-5">
            <a href="#bendovi" className={ui.btnGold}>
              Pogledaj bendove
            </a>
            <span className="text-sm text-stone-500">
              {total > 0 ? `${total} ${total === 1 ? "bend" : total < 5 ? "benda" : "bendova"} čeka` : "Katalog raste svake nedelje"}
              {" · "}besplatno za parove
            </span>
          </div>
        </div>

        {/* meki prelaz u sadržaj */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream" />
      </section>

      <div
        id="bendovi"
        className="mx-auto max-w-6xl scroll-mt-24 space-y-10 px-4 pb-24 sm:px-6"
      >
        {/* Filteri — plutaju preko ivice heroja */}
        <form
          method="get"
          action="/"
          className="relative z-10 -mt-12 flex flex-wrap items-end gap-4 rounded-2xl border border-stone-200/70 bg-white/90 p-5 shadow-lift backdrop-blur-xl"
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
        </form>

        {/* Grid bendova sa stagger ulaskom */}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bands.map((band, i) => (
              <Reveal key={band.id} delay={(i % 3) * 90}>
                <BandCard band={band} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Paginacija */}
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

        {/* Kako radi */}
        <section className="grid gap-6 border-t border-stone-200/70 pt-12 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 120}>
              <div className="space-y-3">
                <span className={`font-display text-4xl font-light ${ui.goldText}`}>
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* CTA za bendove */}
        <Reveal>
          <section className="grain relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center shadow-lift sm:px-12">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-gold/25 blur-[100px]"
            />
            <p className="relative text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              Sviraš u bendu?
            </p>
            <h2 className="relative mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-cream sm:text-4xl">
              Parovi te traže.{" "}
              <em className={`font-light italic ${ui.goldText}`}>
                Neka te i pronađu.
              </em>
            </h2>
            <p className="relative mt-4 text-sm text-stone-400">
              Besplatno listanje · upiti direktno na mejl · statistika profila
            </p>
            <div className="relative mt-8">
              <Link href="/registracija" className={ui.btnGold}>
                Registruj svoj bend
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
