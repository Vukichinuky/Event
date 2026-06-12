import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// uvek svež sitemap iz baze; bez ovoga build pokušava prerender i traži bazu
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bands, categories] = await Promise.all([
    prisma.band.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily" as const, priority: 1 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...bands.map((band) => ({
      url: `${SITE_URL}/${band.category.slug}/${band.slug}`,
      lastModified: band.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
