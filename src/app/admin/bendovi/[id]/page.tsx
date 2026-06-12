import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BandForm } from "../band-form";
import { BandMedia } from "@/components/band-media";
import {
  updateBand,
  deleteBand,
  assignBandUser,
  unassignBandUser,
} from "../actions";

export default async function UrediBendPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ greska?: string; sacuvano?: string }>;
}) {
  const { id } = await params;
  const { greska, sacuvano } = await searchParams;

  const [band, genres, categories] = await Promise.all([
    prisma.band.findUnique({
      where: { id },
      include: {
        genres: true,
        category: true,
        user: { select: { email: true } },
        videos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
        photos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!band) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{band.name}</h1>
        <span className="text-sm text-stone-500">
          /{band.category.slug}/{band.slug} · {band.user?.email ?? "siroče profil (bez naloga)"}
        </span>
      </div>

      <BandForm
        action={updateBand.bind(null, band.id)}
        band={band}
        genres={genres}
        categories={categories}
        selectedGenreIds={band.genres.map((g) => g.id)}
        error={greska}
        saved={sacuvano === "1"}
      />

      <BandMedia band={band} />

      {/* Vlasništvo profila — dodela / skidanje bend naloga */}
      <section className="space-y-3 rounded-2xl border border-stone-200/70 bg-white shadow-soft p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Nalog benda</h2>
        {band.user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-600">
              Profil vodi: <strong>{band.user.email}</strong>
            </span>
            <form action={unassignBandUser.bind(null, band.id)}>
              <button className="cursor-pointer text-xs font-medium text-red-700/80 underline-offset-2 transition hover:text-red-700 hover:underline">
                Skini nalog (vrati u siroče)
              </button>
            </form>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500">
              Profil je „siroče“ — bend se registracijom sa kontakt mejlom (
              {band.contactEmail ?? "nije unet"}) preuzima automatski, ili ga
              ovde ručno dodeli nalogu.
            </p>
            <form
              action={assignBandUser.bind(null, band.id)}
              className="flex gap-2"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="email bend naloga"
                className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
              />
              <button className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-stone-800">
                Dodeli
              </button>
            </form>
          </>
        )}
      </section>

      <form action={deleteBand.bind(null, band.id)}>
        <button
          type="submit"
          className="cursor-pointer text-sm font-medium text-red-700/80 underline-offset-2 transition hover:text-red-700 hover:underline"
        >
          Obriši bend
        </button>
      </form>
    </div>
  );
}
