import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Nacrt",
  PUBLISHED: "Objavljen",
  HIDDEN: "Sakriven",
};

export default async function BendoviPage() {
  const bands = await prisma.band.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } }, genres: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Bendovi</h1>
        <Link
          href="/admin/bendovi/novi"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Novi bend
        </Link>
      </div>

      {bands.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          Još nema bendova. Dodaj prvi bend — može i kao „siroče“ profil, pre
          nego što bend ima svoj nalog.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ime</th>
                <th className="px-4 py-3 font-medium">Žanrovi</th>
                <th className="px-4 py-3 font-medium">Cena (KM)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Nalog</th>
                <th className="px-4 py-3 font-medium">Pregledi</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((band) => (
                <tr key={band.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bendovi/${band.id}`}
                      className="font-medium text-stone-900 underline-offset-2 hover:underline"
                    >
                      {band.name}
                    </Link>
                    {band.city && (
                      <span className="ml-2 text-stone-400">({band.city})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {band.genres.map((g) => g.name).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    od {band.priceFrom}
                    {band.priceTo ? ` do ${band.priceTo}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        band.status === "PUBLISHED"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
                          : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                      }
                    >
                      {STATUS_LABEL[band.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {band.user?.email ?? (
                      <span className="text-amber-700">siroče</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{band.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
