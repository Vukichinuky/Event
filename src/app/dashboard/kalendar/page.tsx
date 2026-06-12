import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import {
  parseMonth,
  monthKey,
  shiftMonth,
  monthWeeks,
  dateISO,
  MONTH_NAMES,
} from "@/lib/calendar";
import { toggleUnavailableDate } from "../actions";
import { CopyField } from "@/components/copy-field";

const DAY_NAMES = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

export default async function KalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ mesec?: string }>;
}) {
  const { band } = await requireBand();
  if (!band) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500">
        Prvo napravi profil benda — kalendar ide uz profil.
      </p>
    );
  }

  const { mesec } = await searchParams;
   
  const now = new Date();
  const { year, month } = parseMonth(mesec, now);
  const current = monthKey(year, month);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const todayISO = dateISO(now);

  const unavailable = await prisma.unavailableDate.findMany({
    where: {
      bandId: band.id,
      date: {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
      },
    },
  });
  const byDate = new Map(unavailable.map((u) => [dateISO(u.date), u.reason]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Kalendar dostupnosti
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/dashboard/kalendar?mesec=${monthKey(prev.year, prev.month)}`}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 hover:bg-stone-100"
          >
            ←
          </Link>
          <span className="min-w-36 text-center font-medium text-stone-900">
            {MONTH_NAMES[month - 1]} {year}.
          </span>
          <Link
            href={`/dashboard/kalendar?mesec=${monthKey(next.year, next.month)}`}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 hover:bg-stone-100"
          >
            →
          </Link>
        </div>
      </div>

      <p className="text-sm text-stone-500">
        Klikni na dan da ga označiš kao zauzet (i ponovo da ga oslobodiš).
        Datumi prihvaćenih svadbi se blokiraju automatski.
      </p>

      <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-soft p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-400">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 space-y-1">
          {monthWeeks(year, month).map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => {
                if (!day) return <div key={di} />;
                const iso = dateISO(day);
                const reason = byDate.get(iso);
                const isPast = iso < todayISO;
                const base =
                  "flex h-12 w-full items-center justify-center rounded-xl text-sm transition";

                if (reason === "BOOKED") {
                  return (
                    <div
                      key={di}
                      title="Rezervisano preko upita — oslobađa se odbijanjem upita"
                      className={`${base} bg-green-700 font-semibold text-white shadow-soft`}
                    >
                      {day.getUTCDate()}
                    </div>
                  );
                }
                if (isPast) {
                  return (
                    <div key={di} className={`${base} text-stone-300`}>
                      {day.getUTCDate()}
                    </div>
                  );
                }
                return (
                  <form
                    key={di}
                    action={toggleUnavailableDate.bind(null, iso, current)}
                  >
                    <button
                      className={
                        reason === "MANUAL"
                          ? `${base} bg-ink font-semibold text-white shadow-soft hover:bg-stone-700`
                          : `${base} cursor-pointer border border-stone-200 bg-white text-stone-600 hover:border-gold hover:text-ink`
                      }
                    >
                      {day.getUTCDate()}
                    </button>
                  </form>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-stone-300 bg-white" />
          slobodno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-ink" />
          zauzeto (ručno)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-green-700" />
          rezervisano preko upita
        </span>
      </div>

      {/* .ics pretplata — kalendar na telefonu se sam ažurira */}
      <section className="space-y-3 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          Kalendar na telefonu
        </h2>
        <p className="text-sm text-stone-500">
          Pretplati svoj Google ili Apple kalendar na ovaj link — svadbe i
          zauzeti dani će se sami pojavljivati na telefonu.
        </p>
        <CopyField
          value={`${process.env.SITE_URL ?? "http://localhost:3000"}/api/kalendar/${band.calendarToken}.ics`}
        />
        <p className="text-xs text-stone-400">
          Google kalendar: Podešavanja → Dodaj kalendar → Sa URL-a. iPhone:
          Podešavanja → Kalendar → Nalozi → Dodaj pretplaćeni kalendar. Link je
          tajan — ne deli ga javno.
        </p>
      </section>
    </div>
  );
}
