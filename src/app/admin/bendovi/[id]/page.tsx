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

  const [band, genres] = await Promise.all([
    prisma.band.findUnique({
      where: { id },
      include: {
        genres: true,
        user: { select: { email: true } },
        videos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
        photos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!band) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">{band.name}</h1>
        <span className="text-sm text-stone-500">
          /bend/{band.slug} · {band.user?.email ?? "siroče profil (bez naloga)"}
        </span>
      </div>

      <BandForm
        action={updateBand.bind(null, band.id)}
        band={band}
        genres={genres}
        selectedGenreIds={band.genres.map((g) => g.id)}
        error={greska}
        saved={sacuvano === "1"}
      />

      <BandMedia band={band} />

      {/* Vlasništvo profila — dodela / skidanje bend naloga */}
      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Nalog benda</h2>
        {band.user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-600">
              Profil vodi: <strong>{band.user.email}</strong>
            </span>
            <form action={unassignBandUser.bind(null, band.id)}>
              <button className="text-xs text-red-600 hover:underline">
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
                className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
              />
              <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                Dodeli
              </button>
            </form>
          </>
        )}
      </section>

      <form action={deleteBand.bind(null, band.id)}>
        <button
          type="submit"
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Obriši bend
        </button>
      </form>
    </div>
  );
}
