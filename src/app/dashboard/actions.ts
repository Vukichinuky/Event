"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireBand } from "@/lib/require-auth";
import { parseBandForm, uniqueSlug, omitStatus } from "@/lib/band-form";

// Bend bez profila (i bez „siroče" profila za preuzimanje) pravi svoj — DRAFT,
// admin ga pregleda i objavljuje
export async function createOwnBand(formData: FormData) {
  const { user, band } = await requireBand();
  if (band) redirect("/dashboard/profil");

  const { error, data } = parseBandForm(formData);
  if (error || !data) {
    redirect(`/dashboard?greska=${encodeURIComponent(error ?? "")}`);
  }

  const { genreIds, ...fields } = omitStatus(data);
  await prisma.band.create({
    data: {
      ...fields,
      status: "DRAFT",
      userId: user.id,
      contactEmail: fields.contactEmail ?? user.email,
      slug: await uniqueSlug(fields.name),
      genres: { connect: genreIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/bendovi");
  redirect("/dashboard/profil");
}

export async function updateOwnProfile(formData: FormData) {
  const { band } = await requireBand();
  if (!band) redirect("/dashboard");

  const { error, data } = parseBandForm(formData);
  if (error || !data) {
    redirect(`/dashboard/profil?greska=${encodeURIComponent(error ?? "")}`);
  }

  // status profila ostaje kakav jeste — objavu kontroliše admin
  const { genreIds, ...fields } = omitStatus(data);
  const slug = await uniqueSlug(fields.name, band.id);
  await prisma.band.update({
    where: { id: band.id },
    data: {
      ...fields,
      slug,
      genres: { set: genreIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/");
  revalidatePath(`/bend/${slug}`);
  revalidatePath("/admin/bendovi");
  redirect("/dashboard/profil?sacuvano=1");
}

export async function respondToInquiry(
  inquiryId: string,
  status: "ACCEPTED" | "DECLINED",
) {
  const { band } = await requireBand();
  if (!band) redirect("/dashboard");

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
  });
  if (inquiry && inquiry.bandId === band.id) {
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: {
        status,
        // vreme do PRVOG odgovora je metrika — ne prepisuje se
        respondedAt: inquiry.respondedAt ?? new Date(),
      },
    });

    if (status === "ACCEPTED") {
      // auto-blok: prihvaćena svadba zauzima datum u kalendaru
      await prisma.unavailableDate.upsert({
        where: {
          bandId_date: { bandId: band.id, date: inquiry.eventDate },
        },
        update: {},
        create: { bandId: band.id, date: inquiry.eventDate, reason: "BOOKED" },
      });
    } else {
      // odustajanje oslobađa datum, osim ako ga drži druga prihvaćena
      // svadba ili ga je bend ručno blokirao
      const stillBooked = await prisma.inquiry.count({
        where: {
          bandId: band.id,
          eventDate: inquiry.eventDate,
          status: "ACCEPTED",
          id: { not: inquiry.id },
        },
      });
      if (stillBooked === 0) {
        await prisma.unavailableDate.deleteMany({
          where: {
            bandId: band.id,
            date: inquiry.eventDate,
            reason: "BOOKED",
          },
        });
      }
    }
  }

  revalidatePath("/dashboard/upiti");
  revalidatePath("/dashboard/kalendar");
  redirect("/dashboard/upiti");
}

// Klik na dan u kalendaru: slobodan ↔ ručno blokiran.
// Datume rezervisane preko upita (BOOKED) ne dira — njih vodi upit.
export async function toggleUnavailableDate(dateStr: string, month: string) {
  const { band } = await requireBand();
  if (!band) redirect("/dashboard");
  const backTo = `/dashboard/kalendar?mesec=${encodeURIComponent(month)}`;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) redirect(backTo);
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) redirect(backTo);

  const existing = await prisma.unavailableDate.findUnique({
    where: { bandId_date: { bandId: band.id, date } },
  });
  if (!existing) {
    await prisma.unavailableDate.create({
      data: { bandId: band.id, date, reason: "MANUAL" },
    });
  } else if (existing.reason === "MANUAL") {
    await prisma.unavailableDate.delete({ where: { id: existing.id } });
  }

  revalidatePath("/dashboard/kalendar");
  redirect(backTo);
}

// Javni odgovor benda na odobrenu recenziju
export async function replyToReview(reviewId: string, formData: FormData) {
  const { band } = await requireBand();
  if (!band) redirect("/dashboard");

  const reply = String(formData.get("reply") ?? "")
    .trim()
    .slice(0, 1000);
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (review && review.bandId === band.id && reply) {
    await prisma.review.update({
      where: { id: review.id },
      data: { bandReply: reply },
    });
    const slug = (await prisma.band.findUnique({
      where: { id: band.id },
      select: { slug: true },
    }))!.slug;
    revalidatePath(`/bend/${slug}`);
  }

  revalidatePath("/dashboard/recenzije");
  redirect("/dashboard/recenzije");
}
