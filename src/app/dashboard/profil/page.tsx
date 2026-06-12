import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { BandForm } from "@/app/admin/bendovi/band-form";
import { BandMedia } from "@/components/band-media";
import { updateOwnProfile } from "../actions";

const STATUS_NOTE: Record<string, string> = {
  DRAFT: "Profil je u pripremi — admin ga objavljuje kad je spreman.",
  PUBLISHED: "Profil je javno objavljen.",
  HIDDEN: "Profil je trenutno sakriven — javi se adminu.",
};

export default async function BendProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string; sacuvano?: string }>;
}) {
  const { band: ownBand } = await requireBand();
  const { greska, sacuvano } = await searchParams;

  if (!ownBand) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
        Još nemaš profil — napravi ga na početnoj strani panela.
      </p>
    );
  }

  const [band, genres, categories] = await Promise.all([
    prisma.band.findUnique({
      where: { id: ownBand.id },
      include: {
        genres: true,
        videos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
        photos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!band) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Moj profil</h1>
        <p className="text-sm text-stone-500">{STATUS_NOTE[band.status]}</p>
      </div>

      <BandForm
        action={updateOwnProfile}
        band={band}
        genres={genres}
        categories={categories}
        selectedGenreIds={band.genres.map((g) => g.id)}
        error={greska}
        saved={sacuvano === "1"}
        showStatus={false}
      />

      <BandMedia band={band} />
    </div>
  );
}
