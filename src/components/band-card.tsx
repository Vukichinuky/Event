import Image from "next/image";
import Link from "next/link";
import { formatKM } from "@/lib/format";
import { bandPath } from "@/lib/band-path";
import type { Band, Genre, Category } from "@/generated/prisma/client";

export function BandCard({
  band,
}: {
  band: Band & { genres: Genre[]; category: Category };
}) {
  const subtitle =
    band.category.slug === "bendovi"
      ? band.genres.map((g) => g.name).join(" · ") || band.category.name
      : band.category.name;

  return (
    <Link
      href={bandPath(band)}
      className="group block overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gold-soft">
        {band.coverImage ? (
          <Image
            src={band.coverImage}
            alt={band.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl text-gold/60 transition duration-500 group-hover:scale-110">
            {band.category.slug === "bendovi" ? "♫" : "✦"}
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold-dark uppercase shadow-soft backdrop-blur">
          {band.category.name}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute right-3 bottom-3 translate-y-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink opacity-0 shadow-soft backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Pogledaj profil →
        </span>
      </div>
      <div className="space-y-2 p-5">
        <h2 className="truncate font-display text-lg font-semibold tracking-tight text-ink">
          {band.name}
        </h2>
        <p className="truncate text-sm text-stone-500">{subtitle}</p>
        <p className="pt-1 text-sm text-stone-500">
          od{" "}
          <span className="text-base font-semibold text-ink">
            {formatKM(band.priceFrom)}
          </span>
        </p>
      </div>
    </Link>
  );
}
