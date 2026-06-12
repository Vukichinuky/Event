import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { formatKM } from "@/lib/format";
import { bandPath } from "@/lib/band-path";
import { getHomeData } from "../home-data";
import { VariantSwitcher } from "../switcher";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dizajn 3 — Moderno" };

export default async function Dizajn3() {
  const { categories, bands, total } = await getHomeData();
  const marqueeItems = categories.map((c) => c.name);

  return (
    <main className="bg-white text-ink">
      <VariantSwitcher active={3} />

      {/* HERO — brutalno minimalan, mreža linija */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid border-x border-ink">
            {/* gornja meta linija */}
            <div className="flex items-center justify-between border-b border-ink px-4 py-3 font-mono text-[11px] tracking-widest uppercase sm:px-6">
              <span className="animate-[rise_0.5s_ease-out_both]">
                Katalog svadbenih usluga
              </span>
              <span className="hidden animate-[rise_0.5s_ease-out_0.1s_both] sm:inline">
                BiH + region
              </span>
              <span className="animate-[rise_0.5s_ease-out_0.2s_both]">
                [{String(total).padStart(3, "0")}]
              </span>
            </div>

            {/* naslov */}
            <div className="px-4 py-14 sm:px-6 sm:py-20">
              <h1 className="font-sans text-[13vw] leading-[0.92] font-black tracking-tighter uppercase sm:text-8xl lg:text-[7.5rem]">
                <span className="block animate-[rise_0.6s_ease-out_both]">
                  Sve za
                </span>
                <span className="block animate-[rise_0.6s_ease-out_0.12s_both]">
                  svadbu<span className="text-gold">.</span>
                </span>
              </h1>
              <div className="mt-10 flex animate-[rise_0.6s_ease-out_0.24s_both] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-sm font-mono text-sm leading-relaxed text-stone-600">
                  Bendovi, fotografi, prostori, dekoracije. Jasne cene. Upit za
                  2 minuta. Bez registracije.
                </p>
                <a
                  href="#kategorije"
                  className="group inline-flex w-fit items-center gap-3 border border-ink bg-ink px-7 py-3.5 font-mono text-sm font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-ink"
                >
                  Istraži
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* marquee — crna traka */}
            <div className="overflow-hidden border-t border-ink bg-ink py-3">
              <div className="flex w-max animate-[marquee_28s_linear_infinite] whitespace-nowrap">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                    {marqueeItems.map((name) => (
                      <span
                        key={`${copy}-${name}`}
                        className="px-5 font-mono text-sm font-bold tracking-[0.2em] text-white uppercase"
                      >
                        {name} <span className="text-gold">/</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORIJE — tabela */}
      <section id="kategorije" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-x border-b border-ink">
            <div className="border-b border-ink px-4 py-3 font-mono text-[11px] tracking-widest uppercase sm:px-6">
              (01) Kategorije
            </div>
            <div className="grid sm:grid-cols-2">
              {categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className={`group flex items-center gap-4 border-b border-ink px-4 py-5 transition hover:bg-ink hover:text-white sm:px-6 ${
                    i % 2 === 0 ? "sm:border-r" : ""
                  } ${i >= categories.length - 2 ? "sm:border-b-0" : ""} ${
                    i === categories.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-stone-400 group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
                    {category.name}
                  </span>
                  <span className="ml-auto font-mono text-xs text-stone-400 tabular-nums group-hover:text-stone-300">
                    [{category._count.bands}]
                  </span>
                  <span className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IZDVOJENO — oštre kartice */}
      {bands.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-x border-b border-ink">
            <div className="border-b border-ink px-4 py-3 font-mono text-[11px] tracking-widest uppercase sm:px-6">
              (02) Najtraženije
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {bands.map((band, i) => (
                <Reveal key={band.id} delay={(i % 3) * 80}>
                  <Link
                    href={bandPath(band)}
                    className="group block border-b border-ink sm:border-r lg:[&:nth-child(3n)]:border-r-0"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-ink bg-stone-100">
                      {band.coverImage ? (
                        <Image
                          src={band.coverImage}
                          alt={band.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-4xl text-stone-300">
                          ✦
                        </div>
                      )}
                      <span className="absolute top-0 left-0 border-r border-b border-ink bg-white px-3 py-1 font-mono text-[10px] tracking-widest uppercase">
                        {band.category.name}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 px-4 py-4 transition group-hover:bg-ink group-hover:text-white sm:px-5">
                      <span className="truncate font-sans text-lg font-extrabold tracking-tight uppercase">
                        {band.name}
                      </span>
                      <span className="shrink-0 font-mono text-sm group-hover:text-gold">
                        od {formatKM(band.priceFrom)}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="border-x border-b border-ink">
          <div className="border-b border-ink px-4 py-3 font-mono text-[11px] tracking-widest uppercase sm:px-6">
            (03) Za ponuđače
          </div>
          <div className="px-4 py-14 text-center sm:px-6">
            <h2 className="mx-auto max-w-3xl font-sans text-4xl font-black tracking-tighter uppercase sm:text-6xl">
              Parovi te traže<span className="text-gold">.</span>
              <br />
              Neka te i pronađu<span className="text-gold">.</span>
            </h2>
            <div className="mt-9">
              <Link
                href="/registracija"
                className="inline-flex items-center gap-3 border border-ink bg-ink px-8 py-4 font-mono text-sm font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-ink"
              >
                Registruj se besplatno →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
