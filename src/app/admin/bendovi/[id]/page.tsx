import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BandForm } from "../band-form";
import { updateBand, deleteBand } from "../actions";

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
      include: { genres: true, user: { select: { email: true } } },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!band) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">{band.name}</h1>
        <span className="text-sm text-stone-500">
          /bend/{band.slug} ·{" "}
          {band.user?.email ?? "siroče profil (bez naloga)"}
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
