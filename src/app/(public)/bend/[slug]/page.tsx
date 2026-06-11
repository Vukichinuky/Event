import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseVideoUrl } from "@/lib/video";
import { formatPriceRange, formatKM } from "@/lib/format";
import { TrackView } from "@/components/track-view";

async function getBand(slug: string) {
  return prisma.band.findUnique({
    where: { slug },
    include: {
      genres: true,
      videos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      photos: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { inquiry: { select: { clientName: true } } },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const band = await getBand(slug);
  if (!band || band.status !== "PUBLISHED") return {};
  const description =
    band.description.slice(0, 155) ||
    `${band.name} — bend za svadbu. Poslušaj snimke, pogledaj cene i pošalji upit.`;
  return {
    title: `${band.name} — bend za svadbu`,
    description,
    openGraph: {
      title: `${band.name} — bend za svadbu`,
      description,
      images: band.coverImage ? [band.coverImage] : [],
    },
  };
}

export default async function BendPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const band = await getBand(slug);
  // DRAFT i HIDDEN profili za javnost ne postoje
  if (!band || band.status !== "PUBLISHED") notFound();

  const videos = band.videos
    .map((video) => ({ ...video, parsed: parseVideoUrl(video.url) }))
    .filter((video) => video.parsed !== null);

  const avgRating =
    band.reviews.length > 0
      ? band.reviews.reduce((sum, r) => sum + r.rating, 0) / band.reviews.length
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: band.name,
    description: band.description || undefined,
    image: band.coverImage || undefined,
    genre: band.genres.map((g) => g.name),
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(avgRating.toFixed(1)),
            reviewCount: band.reviews.length,
            bestRating: 5,
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 pb-24 sm:pb-8">
      <TrackView slug={band.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:underline">
          ← Svi bendovi
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-stone-900">{band.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {band.genres.map((g) => (
            <span
              key={g.id}
              className="rounded-full bg-stone-200 px-3 py-1 text-stone-700"
            >
              {g.name}
            </span>
          ))}
        </div>
        <p className="text-sm text-stone-500">
          {band.city ? `${band.city} · ` : ""}svira na celoj teritoriji BiH i
          šire
        </p>
        {avgRating && (
          <p className="text-sm text-stone-700">
            <span className="text-amber-500">★</span>{" "}
            <strong>{avgRating.toFixed(1)}</strong> ({band.reviews.length}{" "}
            {band.reviews.length === 1 ? "recenzija" : "recenzije"})
          </p>
        )}
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-stone-900">
            {formatPriceRange(band.priceFrom, band.priceTo)}
          </span>
          <Link
            href={`/bend/${band.slug}/upit`}
            className="hidden rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 sm:inline-block"
          >
            Pošalji upit
          </Link>
        </div>
      </header>

      {/* Video je proizvod — snimci pre svega ostalog */}
      {videos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900">
            Poslušaj kako sviraju
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className={
                  video.parsed!.platform === "YOUTUBE"
                    ? "aspect-video overflow-hidden rounded-xl bg-stone-200 sm:col-span-2"
                    : "aspect-[4/5] max-w-sm overflow-hidden rounded-xl bg-stone-200"
                }
              >
                <iframe
                  src={video.parsed!.embedUrl}
                  title={`Snimak — ${band.name}`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {band.photos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900">Galerija</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {band.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={photo.path}
                  alt={`Fotografija — ${band.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {band.description && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-900">O bendu</h2>
          <p className="whitespace-pre-line leading-relaxed text-stone-700">
            {band.description}
          </p>
        </section>
      )}

      {band.reviews.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900">
            Recenzije parova
          </h2>
          <ul className="space-y-4">
            {band.reviews.map((review) => (
              <li
                key={review.id}
                className="space-y-2 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-amber-500"
                    aria-label={`Ocena ${review.rating} od 5`}
                  >
                    {"★".repeat(review.rating)}
                    <span className="text-stone-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>
                  <span className="text-xs text-stone-400">
                    {review.inquiry.clientName} ·{" "}
                    {review.createdAt.toLocaleDateString("sr-Latn-BA")}
                  </span>
                </div>
                {review.text && (
                  <p className="text-sm leading-relaxed text-stone-700">
                    {review.text}
                  </p>
                )}
                {review.bandReply && (
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500">
                      Odgovor benda
                    </p>
                    <p className="mt-1 text-sm text-stone-700">
                      {review.bandReply}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Lepljivo dugme na mobilnom — prioritet je konverzija ka upitu */}
      <div className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white p-3 sm:hidden">
        <Link
          href={`/bend/${band.slug}/upit`}
          className="block rounded-md bg-stone-900 px-5 py-3 text-center text-sm font-medium text-white"
        >
          Pošalji upit · {`od ${formatKM(band.priceFrom)}`}
        </Link>
      </div>
    </main>
  );
}
