// Zajednički vizuelni rečnik — jedna tačka istine za dugmad, polja, kartice
export const ui = {
  input:
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-ink shadow-[0_1px_2px_rgb(27_21_15/0.03)] transition placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15",
  label: "text-[13px] font-medium text-stone-600",
  btnPrimary:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-px hover:bg-stone-800 hover:shadow-lift active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
  btnGold:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-px hover:bg-gold-dark hover:shadow-lift active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
  btnGhost:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-ink transition duration-200 hover:border-stone-400 hover:bg-stone-50",
  btnDangerLink:
    "cursor-pointer text-xs font-medium text-red-700/80 underline-offset-2 transition hover:text-red-700 hover:underline",
  card: "rounded-2xl border border-stone-200/70 bg-white shadow-soft",
  cardHover:
    "rounded-2xl border border-stone-200/70 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark",
  chip: "rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold-dark",
  emptyState:
    "rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-sm text-stone-500",
};
