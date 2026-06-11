"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";

export async function moderateReview(
  reviewId: string,
  status: "APPROVED" | "REJECTED",
) {
  await requireAdmin();

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
    include: { band: { select: { slug: true } } },
  });

  revalidatePath(`/bend/${review.band.slug}`);
  revalidatePath("/admin/recenzije");
  redirect("/admin/recenzije");
}
