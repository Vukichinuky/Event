import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await prisma.band.updateMany({
    where: { slug, status: "PUBLISHED" },
    data: { viewCount: { increment: 1 } },
  });
  return new Response(null, { status: 204 });
}
