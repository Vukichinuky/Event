import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ui } from "@/lib/ui";

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
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.16),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-xl space-y-6 px-4 py-20 text-center sm:py-28">
        <div className="mx-auto flex h-16 w-16 animate-[rise_0.5s_ease-out_both] items-center justify-center rounded-full bg-gold-soft text-3xl shadow-soft">
          🎉
        </div>
        <h1 className="animate-[rise_0.5s_ease-out_0.06s_both] font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Upit je poslat!
        </h1>
        <p className="mx-auto max-w-md animate-[rise_0.5s_ease-out_0.12s_both] leading-relaxed text-stone-600">
          {band.name} je dobio tvoj upit i javiće ti se direktno, telefonom ili
          mejlom. Dok čekaš, pogledaj još bendova — uvek je dobro imati
          rezervnu opciju za svoj datum.
        </p>
        <div className="animate-[rise_0.5s_ease-out_0.18s_both]">
          <Link href="/" className={ui.btnPrimary}>
            Pogledaj još bendova
          </Link>
        </div>
      </div>
    </main>
  );
}
