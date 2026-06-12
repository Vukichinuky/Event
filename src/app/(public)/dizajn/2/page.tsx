import Link from "next/link";
import { BandCard } from "@/components/band-card";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";
import { getHomeData } from "../home-data";
import { VariantSwitcher } from "../switcher";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dizajn 2 — Romantika" };

const PETALS = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "24%", left: "85%", delay: "1.4s" },
  { top: "58%", left: "5%", delay: "2.3s" },
  { top: "68%", left: "90%", delay: "0.8s" },
  { top: "8%", left: "60%", delay: "1.9s" },
  { top: "80%", left: "45%", delay: "2.8s" },
];

export default async function Dizajn2() {
  const { categories, bands, total } = await getHomeData();

  return (
    <main className="bg-[#fdfaf6]">
      <VariantSwitcher active={2} />

      {/* HERO — vazdušast, centriran, pastelan */}
      <section className="relative overflow-hidden">
        {/* meki pastelni oblaci */}
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(244,194,194,0.35),transparent_65%)] blur-2xl"
        />
        <div
          aria-hidden
          className="absolute top-40 -left-40 h-96 w-96 animate-[drift_18s_ease-in-out_infinite] rounded-full bg-gold/15 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute top-20 -right-32 h-80 w-80 animate-[drift2_22s_ease-in-out_infinite] rounded-full bg-[#f4c2c2]/30 blur-[90px]"
        />
        {/* latice */}
        {PETALS.map((petal, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute text-lg text-[#e8a9a9]/60 select-none"
            style={{
              top: petal.top,
              left: petal.left,
              animation: `twinkle 4.2s ease-in-out ${petal.delay} infinite`,
            }}
          >
            ✿
          </span>
        ))}

        <div className="relative mx-auto max-w-4xl px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28">
          <p className="animate-[rise_0.7s_ease-out_both] text-[11px] font-semibold tracking-[0.34em] text-[#c98a8a] uppercase">
            ✿ &nbsp;Za dan koji se pamti ceo život&nbsp; ✿
          </p>

          <h1 className="mt-8 animate-[rise_0.7s_ease-out_0.12s_both] font-display text-5xl leading-[1.08] font-medium tracking-tight text-ink sm:text-7xl">
            Sve što tvojoj{" "}
            <em className="font-light text-[#c98a8a] italic">svadbi</em>
            <br />
            treba —{" "}
            <em className={`font-light italic ${ui.goldText}`}>
              na jednom mestu.
            </em>
          </h1>

          <p className="mx-auto mt-7 max-w-md animate-[rise_0.7s_ease-out_0.24s_both] text-base leading-relaxed text-stone-500">
            Bendovi, fotografi, prostori i dekoracije — pažljivo odabrani, sa
            jasnim cenama. Pošalji upit bez registracije.
          </p>

          <div className="mt-10 flex animate-[rise_0.7s_ease-out_0.36s_both] flex-col items-center gap-4">
            <a
              href="#kategorije"
              className="inline-flex items-center gap-2 rounded-full bg-[#c98a8a] px-9 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(201,138,138,0.4)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b87979] hover:shadow-[0_12px_40px_rgba(201,138,138,0.5)]"
            >
              Pronađi svoje ✿
            </a>
            <span className="text-xs tracking-wide text-stone-400">
              {total} ponuda · {categories.length} kategorija · besplatno za
              parove
            </span>
          </div>
        </div>

        {/* tanka zlatna linija sa srcem */}
        <div className="relative mx-auto flex max-w-xl items-center gap-4 px-6 pb-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold">❦</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </section>

      {/* KATEGORIJE — meki oblak pilula */}
      <section id="kategorije" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
            Biraj <em className="font-light text-[#c98a8a] italic">šta ti treba</em>
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 60}>
              <Link
                href={`/${category.slug}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-stone-200 bg-white px-6 py-3.5 font-display text-lg text-ink shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[#e8c4c4] hover:bg-[#fdf2f2] hover:shadow-lift sm:text-xl"
              >
                {category.name}
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-sans font-medium text-gold-dark">
                  {category._count.bands}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* IZDVOJENO */}
      {bands.length > 0 && (
        <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6">
          <Reveal>
            <div className="space-y-2 text-center">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#c98a8a] uppercase">
                Izdvojeno
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
                Najtraženije{" "}
                <em className={`font-light italic ${ui.goldText}`}>ponude</em>
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

      {/* CTA — pastelna kartica */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#f0dede] bg-gradient-to-b from-[#fdf2f2] to-[#faf3e8] px-6 py-16 text-center shadow-soft sm:px-12">
            <span aria-hidden className="absolute top-6 left-8 text-2xl text-[#e8a9a9]/50">✿</span>
            <span aria-hidden className="absolute right-10 bottom-8 text-xl text-gold/40">❦</span>
            <h2 className="mx-auto max-w-xl font-display text-3xl font-medium text-ink sm:text-4xl">
              Parovi te traže.{" "}
              <em className="font-light text-[#c98a8a] italic">
                Neka te i pronađu.
              </em>
            </h2>
            <p className="mt-4 text-sm text-stone-500">
              Besplatno listanje · upiti direktno na mejl · statistika profila
            </p>
            <div className="mt-8">
              <Link
                href="/registracija"
                className="inline-flex rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                Registruj se besplatno
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
