import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Pošalji upit" };

// Privremena strana — prava forma za upit stiže u Nedelji 5
export default async function UpitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const band = await prisma.band.findUnique({ where: { slug } });
  if (!band || band.status !== "PUBLISHED") notFound();

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-stone-900">
        Upit za {band.name}
      </h1>
      <p className="text-stone-600">
        Forma za upit stiže uskoro — radimo na njoj.
      </p>
      <Link
        href={`/bend/${band.slug}`}
        className="inline-block text-sm text-stone-500 underline"
      >
        ← Nazad na profil benda
      </Link>
    </main>
  );
}
