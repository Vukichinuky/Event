// Klizni prozor u memoriji — dovoljno za jedan PM2 proces na Mac Miniju.
// Restart procesa prazni brojače, što je za MVP prihvatljivo.
const hits = new Map<string, number[]>();

export function rateLimitOk(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // ne dozvoli mapi da raste unedogled
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}
