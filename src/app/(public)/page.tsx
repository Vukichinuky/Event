import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/band-card";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";

const STEPS = [
  {
    n: "01",
    title: "Pogledaj ponude",
    text: "Snimci, galerije i jasne cene — sve na jednom mestu.",
  },
  {
    n: "02",
    title: "Uporedi cene",
    text: "Svaka ponuda ima cenovni rang. Bez skrivenih cifara.",
  },
  {
    n: "03",
    title: "Pošalji upit",
    text: "Dva minuta, bez registracije. Javljaju ti se direktno.",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  bendovi: "♫",
  fotografi: "📷",
  prostori: "🏛",
  dekoracije: "✿",
  ketering: "🍽",
  prstenje: "💍",
  pozivnice: "✉",
  prevoz: "🚘",
  "momacko-i-devojacko": "🥂",
  magazin: "📖",
};

export default async function PocetnaPage() {
  const [categories, bands, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { bands: { where: { status: "PUBLISHED" } } } },
      },
    }),
    prisma.band.findMany({
      where: { status: "PUBLISHED" },
      include: { genres: true, category: true },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.band.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <main>
      {/* Tamni editorijalni hero */}
      <section className="grain relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="absolute -top-32 right-[-10%] h-[480px] w-[480px] animate-[drift_16s_ease-in-out_infinite] rounded-full bg-gold/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 left-[-15%] h-[420px] w-[420px] animate-[drift2_20s_ease-in-out_infinite] rounded-full bg-[#7a5a2e]/30 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[4%] hidden -translate-y-1/2 font-display text-[20rem] leading-none text-white/[0.04] select-none lg:block"
        >
          ❦
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-28 sm:px-6 sm:pt-28 sm:pb-36">
          <p className="animate-[rise_0.6s_ease-out_both] text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
            Bendovi · fotografi · prostori · dekoracije · i sve ostalo
          </p>
          <h1 className="mt-5 max-w-3xl animate-[rise_0.6s_ease-out_0.1s_both] font-display text-5xl leading-[1.05] font-semibold tracking-tight text-cream sm:text-7xl">
            Sve što tvojoj svadbi treba —{" "}
            <em className={`font-light italic ${ui.goldText}`}>
              na jednom mestu.
            </em>
          </h1>
          <p className="mt-6 max-w-xl animate-[rise_0.6s_ease-out_0.2s_both] text-base leading-relaxed text-stone-400 sm:text-lg">
            Od benda koji drži salu na nogama do prstena, fotografa i
            dekoracije. Pogledaj ponude, uporedi cene i pošalji upit — bez
            registracije.
          </p>
          <div className="mt-9 flex animate-[rise_0.6s_ease-out_0.3s_both] flex-wrap items-center gap-5">
            <a href="#kategorije" className={ui.btnGold}>
              Istraži kategorije
            </a>
            <span className="text-sm text-stone-500">
              {total > 0
                ? `${total} ${total === 1 ? "ponuda" : "ponuda"} u katalogu`
                : "Katalog raste svake nedelje"}
              {" · "}besplatno za parove
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream" />
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-24 sm:px-6">
        {/* Kategorije — plutaju preko ivice heroja */}
        <section
          id="kategorije"
          className="relative z-10 -mt-16 scroll-mt-24 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={(i % 5) * 60}>
              <Link
                href={`/${category.slug}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-stone-200/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift"
              >
                <span className="font-display text-2xl text-gold-dark transition duration-300 group-hover:scale-110">
                  {CATEGORY_ICONS[category.slug] ?? "✦"}
                </span>
                <span>
                  <span className="block text-sm leading-snug font-semibold text-ink">
                    {category.name}
                  </span>
                  <span className="text-xs text-stone-400">
                    {category._count.bands}{" "}
                    {category._count.bands === 1 ? "ponuda" : "ponuda"}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </section>

        {/* Izdvojene ponude */}
        {bands.length > 0 && (
          <section className="space-y-6">
            <Reveal>
              <div className="space-y-1.5">
                <p className={ui.eyebrow}>Izdvojeno</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                  Najtraženije ponude
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bands.map((band, i) => (
                <Reveal key={band.id} delay={(i % 3) * 90}>
                  <BandCard band={band} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Kako radi */}
        <section className="grid gap-6 border-t border-stone-200/70 pt-12 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 120}>
              <div className="space-y-3">
                <span
                  className={`font-display text-4xl font-light ${ui.goldText}`}
                >
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* CTA za ponuđače */}
        <Reveal>
          <section className="grain relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center shadow-lift sm:px-12">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-gold/25 blur-[100px]"
            />
            <p className="relative text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              Imaš bend, salu, foto-studio?
            </p>
            <h2 className="relative mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-cream sm:text-4xl">
              Parovi te traže.{" "}
              <em className={`font-light italic ${ui.goldText}`}>
                Neka te i pronađu.
              </em>
            </h2>
            <p className="relative mt-4 text-sm text-stone-400">
              Besplatno listanje · upiti direktno na mejl · statistika profila
            </p>
            <div className="relative mt-8">
              <Link href="/registracija" className={ui.btnGold}>
                Registruj se besplatno
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
