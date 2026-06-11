import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
      <main className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center">
        <div className="text-5xl">{poslato ? "🙏" : "✅"}</div>
        <h1 className="text-2xl font-bold text-stone-900">
          {poslato ? "Hvala na recenziji!" : "Recenzija je već ostavljena"}
        </h1>
        <p className="text-stone-600">
          {inquiry.review.status === "APPROVED"
            ? "Recenzija je objavljena na profilu benda."
            : "Recenzija čeka odobrenje administratora i uskoro će biti vidljiva."}
        </p>
        <Link
          href={`/bend/${inquiry.band.slug}`}
          className="inline-block text-sm text-stone-500 underline"
        >
          ← Profil benda {inquiry.band.name}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-900">
          Kako je sviralo — {inquiry.band.name}?
        </h1>
        <p className="text-sm text-stone-500">
          Svadba {inquiry.eventDate.toLocaleDateString("sr-Latn-BA")} ·{" "}
          {inquiry.eventCity}. Tvoja recenzija pomaže parovima koji tek biraju.
        </p>
      </header>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <ReviewForm token={token} />
      </div>
    </main>
  );
}
