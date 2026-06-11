import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Upit poslat" };

export default async function HvalaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const band = await prisma.band.findUnique({ where: { slug } });
  if (!band || band.status !== "PUBLISHED") notFound();

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="text-2xl font-bold text-stone-900">Upit je poslat!</h1>
      <p className="text-stone-600">
        {band.name} je dobio tvoj upit i javiće ti se direktno, telefonom ili
        mejlom. Dok čekaš, pogledaj još bendova — uvek je dobro imati rezervnu
        opciju za svoj datum.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
      >
        Pogledaj još bendova
      </Link>
    </main>
  );
}
