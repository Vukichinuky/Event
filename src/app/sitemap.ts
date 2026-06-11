import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// uvek svež sitemap iz baze; bez ovoga build pokušava prerender i traži bazu
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bands = await prisma.band.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...bands.map((band) => ({
      url: `${SITE_URL}/bend/${band.slug}`,
      lastModified: band.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
