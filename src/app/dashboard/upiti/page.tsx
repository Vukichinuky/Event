import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { respondToInquiry } from "../actions";
import type { InquiryStatus } from "@/generated/prisma/client";

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

export default async function BendUpitiPage() {
  const { band } = await requireBand();
  if (!band) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
        Prvo napravi profil benda — upiti stižu na profil.
      </p>
    );
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { bandId: band.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Upiti</h1>

      {inquiries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
          Još nema upita. Kad par pošalje upit, stiže ti mejl i pojavljuje se
          ovde sa kontaktom para.
        </p>
      ) : (
        <ul className="space-y-3">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="space-y-3 rounded-2xl border border-stone-200/70 bg-white shadow-soft p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-stone-900">
                  {inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·{" "}
                  {inquiry.eventCity}
                  {inquiry.guestCount ? ` · ~${inquiry.guestCount} gostiju` : ""}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[inquiry.status]}`}
                >
                  {STATUS_LABEL[inquiry.status]}
                </span>
              </div>

              <div className="text-sm text-stone-600">
                <strong>{inquiry.clientName}</strong> ·{" "}
                <a href={`tel:${inquiry.phone}`} className="underline">
                  {inquiry.phone}
                </a>{" "}
                ·{" "}
                <a href={`mailto:${inquiry.email}`} className="underline">
                  {inquiry.email}
                </a>
              </div>

              {inquiry.message && (
                <p className="whitespace-pre-line rounded-xl bg-cream/80 p-3.5 text-sm text-stone-600">
                  {inquiry.message}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                <span>
                  Stigao {inquiry.createdAt.toLocaleDateString("sr-Latn-BA")}
                </span>
                {inquiry.status !== "ACCEPTED" && (
                  <form
                    action={respondToInquiry.bind(null, inquiry.id, "ACCEPTED")}
                  >
                    <button className="cursor-pointer rounded-full bg-green-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-800">
                      Prihvati
                    </button>
                  </form>
                )}
                {inquiry.status !== "DECLINED" && (
                  <form
                    action={respondToInquiry.bind(null, inquiry.id, "DECLINED")}
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
      <p className="text-xs text-stone-400">
        „Prihvati“ znači da si se dogovorio sa parom — javi im se telefonom
        pre nego što potvrdiš.
      </p>
    </div>
  );
}
