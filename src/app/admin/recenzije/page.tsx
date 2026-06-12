import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moderateReview } from "./actions";
import type { ReviewStatus, Prisma } from "@/generated/prisma/client";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PENDING: "Čeka",
  APPROVED: "Odobrena",
  REJECTED: "Odbijena",
};

const STATUS_STYLE: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-stone-100 text-stone-600",
};

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Sve" },
  { value: "PENDING", label: "Čekaju" },
  { value: "APPROVED", label: "Odobrene" },
  { value: "REJECTED", label: "Odbijene" },
];

export default async function AdminRecenzijePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = (
    Object.keys(STATUS_LABEL) as ReviewStatus[]
  ).find((s) => s === status);

  const where: Prisma.ReviewWhereInput = statusFilter
    ? { status: statusFilter }
    : {};
  const reviews = await prisma.review.findMany({
    where,
    include: {
      band: { select: { name: true, slug: true, category: { select: { slug: true } } } },
      inquiry: { select: { clientName: true, eventDate: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Recenzije</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value
                ? `/admin/recenzije?status=${f.value}`
                : "/admin/recenzije"
            }
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

      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
          Nema recenzija za izabrani filter.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="space-y-3 rounded-2xl border border-stone-200/70 bg-white shadow-soft p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <Link
                    href={`/${review.band.category.slug}/${review.band.slug}`}
                    className="font-medium text-stone-900 underline-offset-2 hover:underline"
                  >
                    {review.band.name}
                  </Link>{" "}
                  <span className="text-gold">
                    {"★".repeat(review.rating)}
                    <span className="text-stone-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[review.status]}`}
                >
                  {STATUS_LABEL[review.status]}
                </span>
              </div>

              <p className="text-xs text-stone-400">
                {review.inquiry.clientName} ({review.inquiry.email}) · svadba{" "}
                {review.inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·
                ostavljena {review.createdAt.toLocaleDateString("sr-Latn-BA")}
              </p>

              {review.text && (
                <p className="text-sm text-stone-700">{review.text}</p>
              )}
              {review.bandReply && (
                <p className="rounded-xl bg-cream/80 p-3 text-sm text-stone-600">
                  Odgovor benda: {review.bandReply}
                </p>
              )}

              <div className="flex gap-2">
                {review.status !== "APPROVED" && (
                  <form
                    action={moderateReview.bind(null, review.id, "APPROVED")}
                  >
                    <button className="cursor-pointer rounded-full bg-green-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-800">
                      Odobri
                    </button>
                  </form>
                )}
                {review.status !== "REJECTED" && (
                  <form
                    action={moderateReview.bind(null, review.id, "REJECTED")}
                  >
                    <button className="cursor-pointer rounded-full border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:border-stone-400 hover:bg-stone-50">
                      Odbij
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
