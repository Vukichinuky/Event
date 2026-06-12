import Link from "next/link";
import { BandCard } from "@/components/band-card";
import { Reveal } from "@/components/reveal";
import { ui } from "@/lib/ui";
import { getHomeData } from "../home-data";
import { VariantSwitcher } from "../switcher";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dizajn 1 — Noir" };

const SPARKLES = [
  { top: "18%", left: "12%", delay: "0s", size: "text-base" },
  { top: "30%", left: "78%", delay: "1.2s", size: "text-xl" },
  { top: "62%", left: "8%", delay: "2.1s", size: "text-sm" },
  { top: "70%", left: "88%", delay: "0.6s", size: "text-base" },
  { top: "12%", left: "55%", delay: "1.7s", size: "text-sm" },
];

export default async function Dizajn1() {
  const { categories, bands, total } = await getHomeData();
  const marqueeItems = [...categories.map((c) => c.name), "Sve za svadbu"];

  return (
    <main>
      <VariantSwitcher active={1} />

      {/* HERO — duboka noć, zlatna aurora */}
      <section className="grain relative flex min-h-[92svh] flex-col overflow-hidden bg-ink">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin-slower_45s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(176,141,87,0.22)_50deg,transparent_110deg,rgba(122,90,46,0.16)_190deg,transparent_260deg,rgba(176,141,87,0.1)_320deg,transparent_360deg)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_90%_at_50%_110%,rgba(176,141,87,0.28),transparent_70%)]"
        />
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute ${s.size} text-gold/70 select-none`}
            style={{
              top: s.top,
              left: s.left,
              animation: `twinkle 3.4s ease-in-out ${s.delay} infinite`,
            }}
          >
            ✦
          </span>
        ))}

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-20 sm:px-6">
          <p className="flex animate-[rise_0.7s_ease-out_both] items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
            <span className="inline-block h-px w-10 bg-gold/60" />
            Katalog svadbenih usluga · BiH i šire
          </p>

          <h1 className="mt-8 font-display text-[17vw] leading-[0.95] font-semibold tracking-tight sm:text-8xl lg:text-9xl">
            <span className="block animate-[rise_0.7s_ease-out_0.1s_both] text-cream">
              Sve što tvojoj
            </span>
            <span className="text-outline block animate-[rise_0.7s_ease-out_0.22s_both]">
              svadbi treba
            </span>
            <em
              className={`block animate-[rise_0.7s_ease-out_0.34s_both] pb-2 font-light italic ${ui.goldText}`}
            >
              na jednom mestu.
            </em>
          </h1>

          <div className="mt-10 flex animate-[rise_0.7s_ease-out_0.46s_both] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base leading-relaxed text-stone-400 sm:text-lg">
              Od benda koji drži salu na nogama do prstena, fotografa i
              dekoracije. Uporedi cene i pošalji upit — bez registracije.
            </p>
            <a href="#kategorije" className={`${ui.btnGold} group shrink-0 !px-8 !py-3.5`}>
              Istraži kategorije
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <div className="mt-12 flex animate-[rise_0.7s_ease-out_0.58s_both] flex-wrap items-center gap-x-8 gap-y-2 text-[13px] text-stone-500">
            <span>
              <strong className="font-display text-lg text-gold">
                {categories.length}
              </strong>{" "}
              kategorija
            </span>
            <span className="hidden h-4 w-px bg-white/10 sm:inline-block" />
            <span>
              <strong className="font-display text-lg text-gold">{total}</strong>{" "}
              ponuda
            </span>
            <span className="hidden h-4 w-px bg-white/10 sm:inline-block" />
            <span>
              <strong className="font-display text-lg text-gold">0 KM</strong> za
              parove — zauvek
            </span>
          </div>
        </div>

        <div className="relative border-t border-white/5 py-5">
          <div className="flex w-max animate-[marquee_36s_linear_infinite] whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {marqueeItems.map((name) => (
                  <span
                    key={`${copy}-${name}`}
                    className="flex items-center font-display text-2xl font-light tracking-wide text-white/25"
                  >
                    <span className="px-6">{name}</span>
                    <span className="text-sm text-gold/60">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORIJE — editorijalni indeks */}
      <section
        id="kategorije"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
      >
        <Reveal>
          <div className="mb-10 space-y-2">
            <p className={ui.eyebrow}>Kategorije</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
              Biraj{" "}
              <em className={`font-light italic ${ui.goldText}`}>šta ti treba</em>
            </h2>
          </div>
        </Reveal>
        <div>
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 50}>
              <Link
                href={`/${category.slug}`}
                className="group flex items-baseline gap-4 border-b border-stone-200/80 px-2 py-5 transition duration-300 first:border-t hover:bg-gold-soft/50 sm:gap-8 sm:px-4 sm:py-7"
              >
                <span className="font-display w-8 shrink-0 text-sm text-gold-dark/70 sm:w-12 sm:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display min-w-0 text-2xl font-semibold tracking-tight text-ink transition duration-300 group-hover:translate-x-2 group-hover:text-gold-dark sm:text-5xl sm:group-hover:translate-x-4">
                  {category.name}
                </span>
                <span className="ml-auto shrink-0 text-xs text-stone-400 tabular-nums sm:text-sm">
                  {category._count.bands} ponuda
                </span>
                <span className="shrink-0 -translate-x-2 text-xl text-gold-dark opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:text-3xl">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* IZDVOJENO */}
      {bands.length > 0 && (
        <section className="border-y border-stone-200/70 bg-white">
          <div className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-6">
            <Reveal>
              <div className="space-y-2">
                <p className={ui.eyebrow}>Izdvojeno</p>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
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
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center shadow-lift sm:px-12">
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin-slower_50s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,rgba(176,141,87,0.18)_60deg,transparent_140deg,rgba(122,90,46,0.12)_240deg,transparent_320deg)]"
            />
            <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-semibold text-cream sm:text-5xl">
              Parovi te traže.{" "}
              <em className={`font-light italic ${ui.goldText}`}>
                Neka te i pronađu.
              </em>
            </h2>
            <div className="relative mt-8">
              <Link href="/registracija" className={ui.btnGold}>
                Registruj se besplatno
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
