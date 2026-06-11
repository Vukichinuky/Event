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
  }

  revalidatePath("/dashboard/upiti");
  redirect("/dashboard/upiti");
}
