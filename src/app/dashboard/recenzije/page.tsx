import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { replyToReview } from "../actions";
import type { ReviewStatus } from "@/generated/prisma/client";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PENDING: "Čeka odobrenje",
  APPROVED: "Objavljena",
  REJECTED: "Odbijena",
};

const STATUS_STYLE: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-stone-100 text-stone-600",
};

export default async function BendRecenzijePage() {
  const { band } = await requireBand();
  if (!band) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
        Prvo napravi profil benda.
      </p>
    );
  }

  const reviews = await prisma.review.findMany({
    where: { bandId: band.id },
    include: { inquiry: { select: { clientName: true, eventDate: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-stone-900">Recenzije</h1>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          Još nema recenzija. Posle svake odsvirane svadbe par dobija link za
          recenziju preko svog upita — svaka objavljena recenzija ti diže
          profil.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="space-y-3 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="text-amber-500">
                    {"★".repeat(review.rating)}
                    <span className="text-stone-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>{" "}
                  <span className="text-stone-600">
                    {review.inquiry.clientName} · svadba{" "}
                    {review.inquiry.eventDate.toLocaleDateString("sr-Latn-BA")}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[review.status]}`}
                >
                  {STATUS_LABEL[review.status]}
                </span>
              </div>

              {review.text && (
                <p className="text-sm text-stone-700">{review.text}</p>
              )}

              {review.status === "APPROVED" &&
                (review.bandReply ? (
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500">
                      Tvoj javni odgovor
                    </p>
                    <p className="mt-1 text-sm text-stone-700">
                      {review.bandReply}
                    </p>
                  </div>
                ) : (
                  <form
                    action={replyToReview.bind(null, review.id)}
                    className="flex gap-2"
                  >
                    <input
                      name="reply"
                      required
                      maxLength={1000}
                      placeholder="Javni odgovor (npr. zahvalnica paru)"
                      className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
                    />
                    <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                      Odgovori
                    </button>
                  </form>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
