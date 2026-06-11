import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BandForm } from "../band-form";
import { updateBand, deleteBand } from "../actions";
import {
  addVideo,
  deleteVideo,
  moveVideo,
  uploadCover,
  removeCover,
  uploadPhotos,
  deletePhoto,
} from "../media-actions";

const smallButton =
  "rounded border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-stone-100";

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

      {/* Snimci — video je proizvod, prva stvar na profilu */}
      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Snimci</h2>
        {band.videos.length === 0 ? (
          <p className="text-sm text-stone-500">
            Još nema snimaka. Snimak je prva stvar koju par gleda — dodaj bar
            jedan.
          </p>
        ) : (
          <ul className="space-y-2">
            {band.videos.map((video, i) => (
              <li
                key={video.id}
                className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm"
              >
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600">
                  {video.platform === "YOUTUBE" ? "YouTube" : "Instagram"}
                </span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate text-stone-700 underline-offset-2 hover:underline"
                >
                  {video.url}
                </a>
                <form action={moveVideo.bind(null, band.id, video.id, "up")}>
                  <button className={smallButton} disabled={i === 0}>
                    ↑
                  </button>
                </form>
                <form action={moveVideo.bind(null, band.id, video.id, "down")}>
                  <button
                    className={smallButton}
                    disabled={i === band.videos.length - 1}
                  >
                    ↓
                  </button>
                </form>
                <form action={deleteVideo.bind(null, band.id, video.id)}>
                  <button className="text-xs text-red-600 hover:underline">
                    Obriši
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={addVideo.bind(null, band.id)} className="flex gap-2">
          <input
            name="url"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=… ili Instagram link"
            className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            Dodaj snimak
          </button>
        </form>
      </section>

      {/* Naslovna slika */}
      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Naslovna slika</h2>
        {band.coverImage ? (
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-48 overflow-hidden rounded-md">
              <Image
                src={band.coverImage}
                alt={`Naslovna slika — ${band.name}`}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
            <form action={removeCover.bind(null, band.id)}>
              <button className="text-xs text-red-600 hover:underline">
                Ukloni
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-stone-500">
            Bez naslovne slike kartica benda dobija sivi placeholder.
          </p>
        )}
        <form
          action={uploadCover.bind(null, band.id)}
          className="flex items-center gap-2"
        >
          <input
            name="cover"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-stone-600"
          />
          <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            Postavi
          </button>
        </form>
        <p className="text-xs text-stone-400">JPG, PNG ili WebP, do 5 MB.</p>
      </section>

      {/* Galerija */}
      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Galerija</h2>
        {band.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {band.photos.map((photo) => (
              <div key={photo.id} className="space-y-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={photo.path}
                    alt={`Fotografija — ${band.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>
                <form action={deletePhoto.bind(null, band.id, photo.id)}>
                  <button className="text-xs text-red-600 hover:underline">
                    Obriši
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
        <form
          action={uploadPhotos.bind(null, band.id)}
          className="flex items-center gap-2"
        >
          <input
            name="photos"
            type="file"
            required
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-stone-600"
          />
          <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            Dodaj slike
          </button>
        </form>
        <p className="text-xs text-stone-400">
          Više slika odjednom; JPG, PNG ili WebP, do 5 MB po slici.
        </p>
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
