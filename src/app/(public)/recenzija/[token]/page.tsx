import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ui } from "@/lib/ui";
import { ReviewForm } from "./review-form";

export const metadata = { title: "Ostavi recenziju" };

export default async function RecenzijaPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ poslato?: string }>;
}) {
  const { token } = await params;
  const { poslato } = await searchParams;

  const inquiry = await prisma.inquiry.findUnique({
    where: { reviewToken: token },
    include: { review: true, band: { select: { name: true, slug: true } } },
  });
  if (!inquiry || inquiry.status !== "ACCEPTED") notFound();

  if (inquiry.review) {
    return (
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.16),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-xl space-y-6 px-4 py-20 text-center sm:py-28">
          <div className="mx-auto flex h-16 w-16 animate-[rise_0.5s_ease-out_both] items-center justify-center rounded-full bg-gold-soft text-3xl shadow-soft">
            {poslato ? "🙏" : "✅"}
          </div>
          <h1 className="animate-[rise_0.5s_ease-out_0.06s_both] font-display text-3xl font-semibold tracking-tight text-ink">
            {poslato ? "Hvala na recenziji!" : "Recenzija je već ostavljena"}
          </h1>
          <p className="mx-auto max-w-md animate-[rise_0.5s_ease-out_0.12s_both] text-stone-600">
            {inquiry.review.status === "APPROVED"
              ? "Recenzija je objavljena na profilu benda."
              : "Recenzija čeka odobrenje administratora i uskoro će biti vidljiva."}
          </p>
          <Link
            href={`/bend/${inquiry.band.slug}`}
            className="inline-block animate-[rise_0.5s_ease-out_0.18s_both] text-sm text-stone-500 underline-offset-4 transition hover:text-gold-dark hover:underline"
          >
            ← Profil benda {inquiry.band.name}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.14),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
        <header className="animate-[rise_0.5s_ease-out_both] space-y-2">
          <p className={ui.eyebrow}>Recenzija</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Kako je sviralo — {inquiry.band.name}?
          </h1>
          <p className="text-sm text-stone-500">
            Svadba {inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·{" "}
            {inquiry.eventCity}. Tvoja recenzija pomaže parovima koji tek
            biraju.
          </p>
        </header>
        <div
          className={`animate-[rise_0.5s_ease-out_0.08s_both] ${ui.card} p-6 sm:p-8`}
        >
          <ReviewForm token={token} />
        </div>
      </div>
    </main>
  );
}
