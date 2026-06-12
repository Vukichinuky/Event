import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseVideoUrl } from "@/lib/video";
import { formatPriceRange, formatKM } from "@/lib/format";
import { TrackView } from "@/components/track-view";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";
import { bandPath } from "@/lib/band-path";

async function getBand(slug: string) {
  return prisma.band.findUnique({
    where: { slug },
    include: {
      genres: true,
      category: true,
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
  params: Promise<{ kategorija: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const band = await getBand(slug);
  if (!band || band.status !== "PUBLISHED") return {};
  const kind =
    band.category.slug === "bendovi"
      ? "bend za svadbu"
      : `${band.category.name.toLowerCase()} za svadbu`;
  const description =
    band.description.slice(0, 155) ||
    `${band.name} — ${kind}. Pogledaj ponudu, cene i pošalji upit.`;
  return {
    title: `${band.name} — ${kind}`,
    description,
    openGraph: {
      title: `${band.name} — ${kind}`,
      description,
      images: band.coverImage ? [band.coverImage] : [],
    },
  };
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className={ui.eyebrow}>{eyebrow}</p>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
    </div>
  );
}

export default async function BendPage({
  params,
}: {
  params: Promise<{ kategorija: string; slug: string }>;
}) {
  const { kategorija, slug } = await params;
  const band = await getBand(slug);
  // DRAFT i HIDDEN profili za javnost ne postoje
  if (!band || band.status !== "PUBLISHED") notFound();
  // kanonska putanja po kategoriji profila
  if (band.category.slug !== kategorija) redirect(bandPath(band));

  const isBend = band.category.slug === "bendovi";

  const videos = band.videos
    .map((video) => ({ ...video, parsed: parseVideoUrl(video.url) }))
    .filter((video) => video.parsed !== null);

  const avgRating =
    band.reviews.length > 0
      ? band.reviews.reduce((sum, r) => sum + r.rating, 0) / band.reviews.length
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isBend ? "MusicGroup" : "LocalBusiness",
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
    <main className="pb-28 sm:pb-16">
      <TrackView slug={band.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Heroj profila — tamni, sa naslovnom kao atmosferom */}
      <section className="grain relative overflow-hidden bg-ink">
        {band.coverImage ? (
          <>
            <Image
              src={band.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30 blur-2xl"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute -top-32 right-[-10%] h-[420px] w-[420px] animate-[drift_16s_ease-in-out_infinite] rounded-full bg-gold/20 blur-[110px]"
          />
        )}
        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
          <nav className="animate-[rise_0.4s_ease-out_both] text-sm text-stone-400">
            <Link href="/" className="transition hover:text-gold">
              ← Svi bendovi
            </Link>
          </nav>

          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end">
            {band.coverImage && (
              <div className="relative aspect-[4/3] w-full max-w-sm shrink-0 animate-[rise_0.5s_ease-out_0.05s_both] overflow-hidden rounded-2xl shadow-lift sm:w-72">
                <Image
                  src={band.coverImage}
                  alt={`Bend ${band.name}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 288px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 animate-[rise_0.5s_ease-out_0.1s_both] space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={ui.chip}>{band.category.name}</span>
                {isBend &&
                  band.genres.map((g) => (
                    <span key={g.id} className={ui.chip}>
                      {g.name}
                    </span>
                  ))}
              </div>
              <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-cream sm:text-5xl">
                {band.name}
              </h1>
              <p className="text-sm text-stone-400">
                {band.city ? `${band.city} · ` : ""}
                {isBend ? "svira" : "dostupno"} na celoj teritoriji BiH i šire
              </p>
              {avgRating && (
                <p className="flex items-center gap-2 text-sm">
                  <span className="text-gold">
                    {"★".repeat(Math.round(avgRating))}
                    <span className="text-white/20">
                      {"★".repeat(5 - Math.round(avgRating))}
                    </span>
                  </span>
                  <strong className="text-cream">{avgRating.toFixed(1)}</strong>
                  <span className="text-stone-500">
                    ({band.reviews.length}{" "}
                    {band.reviews.length === 1 ? "recenzija" : "recenzije"})
                  </span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className={`font-display text-2xl font-semibold ${ui.goldText}`}>
                  {formatPriceRange(band.priceFrom, band.priceTo)}
                </span>
                <Link
                  href={`${bandPath(band)}/upit`}
                  className={`hidden sm:inline-flex ${ui.btnGold}`}
                >
                  Pošalji upit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 pt-12 sm:px-6">
        {/* Video je proizvod — snimci pre svega ostalog */}
        {videos.length > 0 && (
          <Reveal>
          <section className="space-y-6">
            <SectionTitle
              eyebrow="Snimci"
              title={isBend ? "Poslušaj kako sviraju" : "Pogledaj ih u akciji"}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={
                    video.parsed!.platform === "YOUTUBE"
                      ? "aspect-video overflow-hidden rounded-2xl bg-ink shadow-soft sm:col-span-2"
                      : "aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-ink shadow-soft"
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
          </Reveal>
        )}

        {band.photos.length > 0 && (
          <Reveal>
          <section className="space-y-6">
            <SectionTitle eyebrow="Galerija" title="Sa pravih svadbi" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {band.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
                >
                  <Image
                    src={photo.path}
                    alt={`Fotografija — ${band.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 320px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
          </Reveal>
        )}

        {band.description && (
          <Reveal>
          <section className="space-y-6">
            <SectionTitle
              eyebrow={isBend ? "O bendu" : "O ponudi"}
              title="Ko su oni"
            />
            <p className="max-w-3xl text-base leading-relaxed whitespace-pre-line text-stone-600">
              {band.description}
            </p>
          </section>
          </Reveal>
        )}

        {band.reviews.length > 0 && (
          <Reveal>
          <section className="space-y-6">
            <SectionTitle eyebrow="Recenzije" title="Šta kažu parovi" />
            <ul className="grid gap-5 sm:grid-cols-2">
              {band.reviews.map((review) => (
                <li
                  key={review.id}
                  className="space-y-3 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-gold"
                      aria-label={`Ocena ${review.rating} od 5`}
                    >
                      {"★".repeat(review.rating)}
                      <span className="text-stone-200">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </span>
                    <span className="text-xs text-stone-400">
                      {review.createdAt.toLocaleDateString("sr-Latn-BA")}
                    </span>
                  </div>
                  {review.text && (
                    <p className="text-sm leading-relaxed text-stone-600">
                      „{review.text}“
                    </p>
                  )}
                  <p className="text-xs font-medium text-stone-400">
                    — {review.inquiry.clientName}
                  </p>
                  {review.bandReply && (
                    <div className="rounded-xl bg-gold-soft/60 p-3">
                      <p className="text-[11px] font-semibold tracking-wide text-gold-dark uppercase">
                        Odgovor benda
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {review.bandReply}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
          </Reveal>
        )}

        {/* Završni CTA */}
        <Reveal>
          <section className="grain relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center shadow-lift sm:px-12">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-gold/25 blur-[100px]"
            />
            <p className="relative text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              Tvoj datum se brzo popunjava
            </p>
            <h2 className="relative mx-auto mt-4 max-w-lg font-display text-3xl font-semibold text-cream">
              Pitaj {band.name}{" "}
              <em className={`font-light italic ${ui.goldText}`}>
                da li je slobodan termin
              </em>{" "}
              za tvoju svadbu
            </h2>
            <p className="relative mt-3 text-sm text-stone-400">
              Bez registracije · bend ti se javlja direktno
            </p>
            <div className="relative mt-8">
              <Link href={`${bandPath(band)}/upit`} className={ui.btnGold}>
                Pošalji upit · {formatPriceRange(band.priceFrom, band.priceTo)}
              </Link>
            </div>
          </section>
        </Reveal>
      </div>

      {/* Lepljivo dugme na mobilnom — prioritet je konverzija ka upitu */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/60 bg-white/85 p-3 backdrop-blur-xl sm:hidden">
        <Link
          href={`${bandPath(band)}/upit`}
          className={`w-full ${ui.btnGold}`}
        >
          Pošalji upit · od {formatKM(band.priceFrom)}
        </Link>
      </div>
    </main>
  );
}
