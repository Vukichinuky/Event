import Image from "next/image";
import Link from "next/link";
import { formatKM } from "@/lib/format";
import type { Band, Genre } from "@/generated/prisma/client";

export function BandCard({ band }: { band: Band & { genres: Genre[] } }) {
  return (
    <Link
      href={`/bend/${band.slug}`}
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-stone-200">
        {band.coverImage ? (
          <Image
            src={band.coverImage}
            alt={`Bend ${band.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-stone-400">
            ♫
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h2 className="truncate font-semibold text-stone-900">{band.name}</h2>
        <p className="truncate text-sm text-stone-500">
          {band.genres.map((g) => g.name).join(" · ") || "—"}
        </p>
        <p className="text-sm font-medium text-stone-900">
          od {formatKM(band.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
