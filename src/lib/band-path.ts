// Kanonska javna putanja profila: /<kategorija>/<slug>
export function bandPath(band: { slug: string; category: { slug: string } }) {
  return `/${band.category.slug}/${band.slug}`;
}
