import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceRange } from "@/lib/format";
import { InquiryForm } from "./inquiry-form";

export const metadata = { title: "Pošalji upit" };

export default async function UpitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const band = await prisma.band.findUnique({ where: { slug } });
  if (!band || band.status !== "PUBLISHED") notFound();

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <nav className="text-sm text-stone-500">
        <Link href={`/bend/${band.slug}`} className="hover:underline">
          ← {band.name}
        </Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-900">
          Upit za {band.name}
        </h1>
        <p className="text-sm text-stone-500">
          {formatPriceRange(band.priceFrom, band.priceTo)} · bend će ti se
          javiti direktno telefonom ili mejlom
        </p>
      </header>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <InquiryForm slug={band.slug} minDate={minDate} />
      </div>
    </main>
  );
}
