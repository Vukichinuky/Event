// Pomoćne funkcije za mesečni kalendar (UTC datumi, ponedeljak prvi dan)

export function parseMonth(raw: string | undefined, fallback: Date) {
  const match = raw?.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }
  return {
    year: fallback.getUTCFullYear(),
    month: fallback.getUTCMonth() + 1,
  };
}

export function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function dateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Nedelje meseca kao matrica; null = polje van meseca
export function monthWeeks(year: number, month: number): (Date | null)[][] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // ponedeljak = 0

  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      new Date(Date.UTC(year, month - 1, i + 1)),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export const MONTH_NAMES = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];
