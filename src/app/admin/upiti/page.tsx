import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus, Prisma } from "@/generated/prisma/client";

const STATUS_LABEL: Record<InquiryStatus, string> = {
  NEW: "Nov",
  ACCEPTED: "Prihvaćen",
  DECLINED: "Odbijen",
  NO_RESPONSE: "Bez odgovora",
};

const STATUS_STYLE: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  DECLINED: "bg-stone-100 text-stone-600",
  NO_RESPONSE: "bg-red-100 text-red-800",
};

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Svi" },
  { value: "NEW", label: "Novi" },
  { value: "ACCEPTED", label: "Prihvaćeni" },
  { value: "DECLINED", label: "Odbijeni" },
  { value: "NO_RESPONSE", label: "Bez odgovora" },
];

const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

export default async function UpitiPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = (
    Object.keys(STATUS_LABEL) as InquiryStatus[]
  ).find((s) => s === status);

  const where: Prisma.InquiryWhereInput = statusFilter
    ? { status: statusFilter }
    : {};
  const inquiries = await prisma.inquiry.findMany({
    where,
    include: {
      band: { select: { name: true, slug: true, category: { select: { slug: true } } } },
      review: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // server komponenta se renderuje po zahtevu, pa je "sada" stabilno unutar odgovora
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Upiti</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/upiti?status=${f.value}` : "/admin/upiti"}
            className={
              (f.value || "") === (statusFilter ?? "")
                ? "rounded-full bg-ink px-3.5 py-1 font-medium text-white shadow-soft"
                : "rounded-full border border-stone-300 bg-white px-3.5 py-1 text-stone-600 transition hover:border-stone-400 hover:bg-stone-50"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
          Nema upita za izabrani filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Stigao</th>
                <th className="px-4 py-3 font-medium">Ponuđač</th>
                <th className="px-4 py-3 font-medium">Svadba</th>
                <th className="px-4 py-3 font-medium">Par</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => {
                const stale =
                  inquiry.status === "NEW" &&
                  now - inquiry.createdAt.getTime() > STALE_AFTER_MS;
                return (
                  <tr
                    key={inquiry.id}
                    className="border-b border-stone-100 align-top last:border-0"
                  >
                    <td className="px-4 py-3 text-stone-600">
                      {inquiry.createdAt.toLocaleDateString("sr-Latn-BA")}
                      {stale && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          čeka {Math.floor((now - inquiry.createdAt.getTime()) / 86_400_000)}{" "}
                          dana!
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/${inquiry.band.category.slug}/${inquiry.band.slug}`}
                        className="text-stone-900 underline-offset-2 hover:underline"
                      >
                        {inquiry.band.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·{" "}
                      {inquiry.eventCity}
                      {inquiry.guestCount ? ` · ${inquiry.guestCount} gostiju` : ""}
                      {inquiry.message && (
                        <p className="mt-1 max-w-xs truncate text-xs text-stone-400">
                          {inquiry.message}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {inquiry.clientName}
                      <span className="block text-xs text-stone-400">
                        {inquiry.phone} · {inquiry.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[inquiry.status]}`}
                      >
                        {STATUS_LABEL[inquiry.status]}
                      </span>
                      {inquiry.status === "ACCEPTED" &&
                        (inquiry.review ? (
                          <span className="mt-1 block text-xs text-stone-400">
                            recenzija: {inquiry.review.status === "PENDING"
                              ? "čeka"
                              : inquiry.review.status === "APPROVED"
                                ? "objavljena"
                                : "odbijena"}
                          </span>
                        ) : (
                          <span className="mt-1 block text-xs">
                            <Link
                              href={`/recenzija/${inquiry.reviewToken}`}
                              className="text-stone-400 underline"
                            >
                              link za recenziju
                            </Link>
                          </span>
                        ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
