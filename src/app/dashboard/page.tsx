import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { BandForm } from "@/app/admin/bendovi/band-form";
import { createOwnBand } from "./actions";

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
    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-stone-900">
          Dobrodošao! Napravi profil svog benda
        </h1>
        <p className="max-w-2xl text-sm text-stone-500">
          Popuni osnovne podatke — snimke i slike dodaješ posle. Profil ide
          adminu na pregled pre objave. Ako ti je admin već napravio profil,
          javi mu mejl ovog naloga da ti ga dodeli.
        </p>
        <BandForm
          action={createOwnBand}
          genres={genres}
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
    { label: "Prihvaćenih svadbi", value: accepted },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-stone-900">Pregled</h1>
        {band.status === "PUBLISHED" ? (
          <Link
            href={`/bend/${band.slug}`}
            className="text-sm text-stone-600 underline"
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
          className="block rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-900 hover:bg-blue-100"
        >
          Imaš {newCount} {newCount === 1 ? "nov upit" : "nova upita"} — javi
          se paru što pre! →
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <div className="text-2xl font-bold text-stone-900">
              {stat.value}
            </div>
            <div className="text-xs text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-stone-900">Poslednji upiti</h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            Još nema upita — to je normalno na početku. Podeli link svog
            profila na Facebook-u i Instagram-u: svaki par koji ga vidi je
            potencijalni upit.
          </p>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
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
