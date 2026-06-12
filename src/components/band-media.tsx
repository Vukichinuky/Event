import Image from "next/image";
import { ui } from "@/lib/ui";
import type { Band, Video, Photo } from "@/generated/prisma/client";
import {
  addVideo,
  deleteVideo,
  moveVideo,
  uploadCover,
  removeCover,
  uploadPhotos,
  deletePhoto,
} from "@/app/admin/bendovi/media-actions";

const smallButton =
  "cursor-pointer rounded-full border border-stone-200 px-2.5 py-1 text-xs text-stone-500 transition hover:border-stone-400 hover:text-ink disabled:opacity-30";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
      {children}
    </h2>
  );
}

// Uređivanje snimaka, naslovne i galerije — dele ga admin i bend panel
export function BandMedia({
  band,
}: {
  band: Band & { videos: Video[]; photos: Photo[] };
}) {
  return (
    <>
      {/* Snimci — video je proizvod, prva stvar na profilu */}
      <section className={`space-y-4 ${ui.card} p-6 sm:p-8`}>
        <SectionHeading>Snimci</SectionHeading>
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
                className="flex items-center gap-2.5 rounded-xl border border-stone-200/80 bg-cream/60 px-4 py-2.5 text-sm"
              >
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-stone-500 shadow-[0_1px_2px_rgb(27_21_15/0.05)]">
                  {video.platform === "YOUTUBE" ? "YouTube" : "Instagram"}
                </span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate text-stone-600 underline-offset-2 hover:underline"
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
                  <button className={ui.btnDangerLink}>Obriši</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form
          action={addVideo.bind(null, band.id)}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            name="url"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=… ili Instagram link"
            className={ui.input}
          />
          <button className={`shrink-0 ${ui.btnPrimary}`}>Dodaj snimak</button>
        </form>
      </section>

      {/* Naslovna slika */}
      <section className={`space-y-4 ${ui.card} p-6 sm:p-8`}>
        <SectionHeading>Naslovna slika</SectionHeading>
        {band.coverImage ? (
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-48 overflow-hidden rounded-xl shadow-soft">
              <Image
                src={band.coverImage}
                alt={`Naslovna slika — ${band.name}`}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
            <form action={removeCover.bind(null, band.id)}>
              <button className={ui.btnDangerLink}>Ukloni</button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-stone-500">
            Bez naslovne slike kartica benda dobija zlatni placeholder.
          </p>
        )}
        <form
          action={uploadCover.bind(null, band.id)}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            name="cover"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-stone-500 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold-dark"
          />
          <button className={ui.btnPrimary}>Postavi</button>
        </form>
        <p className="text-xs text-stone-400">JPG, PNG ili WebP, do 5 MB.</p>
      </section>

      {/* Galerija */}
      <section className={`space-y-4 ${ui.card} p-6 sm:p-8`}>
        <SectionHeading>Galerija</SectionHeading>
        {band.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {band.photos.map((photo) => (
              <div key={photo.id} className="space-y-1.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-soft">
                  <Image
                    src={photo.path}
                    alt={`Fotografija — ${band.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>
                <form action={deletePhoto.bind(null, band.id, photo.id)}>
                  <button className={ui.btnDangerLink}>Obriši</button>
                </form>
              </div>
            ))}
          </div>
        )}
        <form
          action={uploadPhotos.bind(null, band.id)}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            name="photos"
            type="file"
            required
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-stone-500 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold-dark"
          />
          <button className={ui.btnPrimary}>Dodaj slike</button>
        </form>
        <p className="text-xs text-stone-400">
          Više slika odjednom; JPG, PNG ili WebP, do 5 MB po slici.
        </p>
      </section>
    </>
  );
}
