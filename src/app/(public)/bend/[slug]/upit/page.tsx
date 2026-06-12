import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceRange } from "@/lib/format";
import { ui } from "@/lib/ui";
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
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.14),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
        <nav className="animate-[rise_0.4s_ease-out_both] text-sm text-stone-500">
          <Link
            href={`/bend/${band.slug}`}
            className="transition hover:text-gold-dark"
          >
            ← {band.name}
          </Link>
        </nav>

        <header className="animate-[rise_0.5s_ease-out_0.05s_both] space-y-2">
          <p className={ui.eyebrow}>Upit · bez registracije</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Upit za {band.name}
          </h1>
          <p className="text-sm text-stone-500">
            {formatPriceRange(band.priceFrom, band.priceTo)} · bend ti se javlja
            direktno telefonom ili mejlom
          </p>
        </header>

        <div
          className={`animate-[rise_0.5s_ease-out_0.1s_both] ${ui.card} p-6 sm:p-8`}
        >
          <InquiryForm slug={band.slug} minDate={minDate} />
        </div>
      </div>
    </main>
  );
}
