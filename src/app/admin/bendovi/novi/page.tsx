import { prisma } from "@/lib/prisma";
import { BandForm } from "../band-form";
import { createBand } from "../actions";

export default async function NoviBendPage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string }>;
}) {
  const { greska } = await searchParams;
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-stone-900">Novi bend</h1>
      <p className="text-sm text-stone-500">
        Bend ne mora imati nalog — profil se vodi kao „siroče“ dok ga bend ne
        preuzme.
      </p>
      <BandForm action={createBand} genres={genres} error={greska} />
    </div>
  );
}
