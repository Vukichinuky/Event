"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type ReviewFormState = { error: string | null };

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Izaberi ocenu").max(5),
  text: z.string().trim().max(2000, "Recenzija je predugačka"),
});

export async function submitReview(
  token: string,
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const inquiry = await prisma.inquiry.findUnique({
    where: { reviewToken: token },
    include: { review: true, band: { select: { slug: true } } },
  });
  // recenzija postoji samo uz realan, prihvaćen upit — i samo jedna
  if (!inquiry || inquiry.status !== "ACCEPTED") {
    return { error: "Link za recenziju nije važeći." };
  }
  if (inquiry.review) {
    return { error: "Recenzija za ovaj upit je već ostavljena." };
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    text: formData.get("text") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.review.create({
    data: {
      bandId: inquiry.bandId,
      inquiryId: inquiry.id,
      rating: parsed.data.rating,
      text: parsed.data.text,
      status: "PENDING",
    },
  });

  redirect(`/recenzija/${token}?poslato=1`);
}
