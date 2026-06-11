export function formatKM(amount: number): string {
  return `${amount.toLocaleString("sr-Latn-BA")} KM`;
}

export function formatPriceRange(priceFrom: number, priceTo: number | null) {
  return priceTo
    ? `${priceFrom.toLocaleString("sr-Latn-BA")}–${priceTo.toLocaleString("sr-Latn-BA")} KM`
    : `od ${formatKM(priceFrom)}`;
}
