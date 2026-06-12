import { prisma } from "@/lib/prisma";

// Zajednički podaci za sve tri dizajn varijante početne
export async function getHomeData() {
  const [categories, bands, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { bands: { where: { status: "PUBLISHED" } } } },
      },
    }),
    prisma.band.findMany({
      where: { status: "PUBLISHED" },
      include: { genres: true, category: true },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.band.count({ where: { status: "PUBLISHED" } }),
  ]);
  return { categories, bands, total };
}
