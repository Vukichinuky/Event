import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { BandForm } from "@/app/admin/bendovi/band-form";
import { createOwnBand } from "./actions";
import { CopyField } from "@/components/copy-field";
import { bandPath } from "@/lib/band-path";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string }>;
}) {
  const { band } = await requireBand();
  const { greska } = await searchParams;

  // bend bez profila — napravi svoj (DRAFT, admin objavljuje)
  if (!band) {
    const [genres, categories] = await Promise.all([
      prisma.genre.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
    ]);
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Dobrodošao! Napravi svoj profil
        </h1>
        <p className="max-w-2xl text-sm text-stone-500">
          Popuni osnovne podatke — snimke i slike dodaješ posle. Profil ide
          adminu na pregled pre objave. Ako ti je admin već napravio profil,
          javi mu mejl ovog naloga da ti ga dodeli.
        </p>
        <BandForm
          action={createOwnBand}
          genres={genres}
          categories={categories}
          error={greska}
          showStatus={false}
        />
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/purity
  const monthAgo = new Date(Date.now() - THIRTY_DAYS_MS);
  const [total, newCount, accepted, lastMonth, recent] = await Promise.all([
    prisma.inquiry.count({ where: { bandId: band.id } }),
    prisma.inquiry.count({ where: { bandId: band.id, status: "NEW" } }),
    prisma.inquiry.count({ where: { bandId: band.id, status: "ACCEPTED" } }),
    prisma.inquiry.count({
      where: { bandId: band.id, createdAt: { gte: monthAgo } },
    }),
    prisma.inquiry.findMany({
      where: { bandId: band.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Pregleda profila", value: band.viewCount },
    { label: "Upita ukupno", value: total },
    { label: "Upita u zadnjih 30 dana", value: lastMonth },
    { label: "Prihvaćenih termina", value: accepted },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Pregled</h1>
        {band.status === "PUBLISHED" ? (
          <Link
            href={bandPath(band)}
            className="text-sm font-medium text-gold-dark underline-offset-4 transition hover:underline"
          >
            Pogledaj svoj javni profil →
          </Link>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
            Profil još nije objavljen — admin ga pregleda
          </span>
        )}
      </div>

      {newCount > 0 && (
        <Link
          href="/dashboard/upiti"
          className="block rounded-2xl border border-gold/30 bg-gold-soft p-4 text-sm font-medium text-gold-dark shadow-soft transition hover:-translate-y-px hover:shadow-lift"
        >
          Imaš {newCount} {newCount === 1 ? "nov upit" : "nova upita"} — javi
          se paru što pre! →
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-soft"
          >
            <div className="font-display text-3xl font-semibold text-ink">
              {stat.value}
            </div>
            <div className="text-xs text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* viralni mehanizam: bend deli link umesto da šalje snimke ručno */}
      {band.status === "PUBLISHED" && (
        <section className="space-y-3 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            Podeli svoj profil
          </h2>
          <p className="text-sm text-stone-500">
            Umesto da svaki put šalješ snimke — pošalji jedan link. Svaki par
            koji ga otvori je potencijalni upit.
          </p>
          <CopyField
            value={`${process.env.SITE_URL ?? "http://localhost:3000"}${bandPath(band)}`}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Poslednji upiti</h2>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
            Još nema upita — to je normalno na početku. Podeli link svog
            profila na Facebook-u i Instagram-u: svaki par koji ga vidi je
            potencijalni upit.
          </p>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-2xl border border-stone-200/70 bg-white shadow-soft">
            {recent.map((inquiry) => (
              <li
                key={inquiry.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="text-stone-700">
                  {inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·{" "}
                  {inquiry.eventCity} · {inquiry.clientName}
                </span>
                <Link
                  href="/dashboard/upiti"
                  className="shrink-0 text-stone-500 underline"
                >
                  Detalji
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
