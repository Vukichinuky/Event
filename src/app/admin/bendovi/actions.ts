"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";
import { parseBandForm, uniqueSlug } from "@/lib/band-form";

export async function createBand(formData: FormData) {
  await requireAdmin();
  const { error, data } = parseBandForm(formData);
  if (error || !data) redirect(`/admin/bendovi/novi?greska=${encodeURIComponent(error ?? "")}`);

  const { genreIds, ...fields } = data;
  const band = await prisma.band.create({
    data: {
      ...fields,
      slug: await uniqueSlug(fields.name),
      genres: { connect: genreIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/bendovi");
  revalidatePath("/");
  redirect(`/admin/bendovi/${band.id}`);
}

export async function updateBand(bandId: string, formData: FormData) {
  await requireAdmin();
  const { error, data } = parseBandForm(formData);
  if (error || !data) {
    redirect(`/admin/bendovi/${bandId}?greska=${encodeURIComponent(error ?? "")}`);
  }

  const { genreIds, ...fields } = data;
  const slug = await uniqueSlug(fields.name, bandId);
  const band = await prisma.band.update({
    where: { id: bandId },
    data: {
      ...fields,
      slug,
      genres: { set: genreIds.map((id) => ({ id })) },
    },
    include: { category: true },
  });

  revalidatePath("/admin/bendovi");
  revalidatePath("/");
  revalidatePath(`/${band.category.slug}`);
  revalidatePath(`/${band.category.slug}/${slug}`);
  redirect(`/admin/bendovi/${bandId}?sacuvano=1`);
}

// Dodela „siroče" profila postojećem bend nalogu (po mejlu naloga)
export async function assignBandUser(bandId: string, formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const fail: (msg: string) => never = (msg) =>
    redirect(`/admin/bendovi/${bandId}?greska=${encodeURIComponent(msg)}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { band: { select: { id: true } } },
  });
  if (!user) fail("Ne postoji nalog sa tim mejlom");
  if (user.role !== "BAND") fail("Taj nalog nije bend nalog");
  if (user.band && user.band.id !== bandId) {
    fail("Taj nalog već ima svoj profil");
  }

  await prisma.band.update({
    where: { id: bandId },
    data: { userId: user.id },
  });
  revalidatePath("/admin/bendovi");
  redirect(`/admin/bendovi/${bandId}?sacuvano=1`);
}

export async function unassignBandUser(bandId: string) {
  await requireAdmin();
  await prisma.band.update({
    where: { id: bandId },
    data: { userId: null },
  });
  revalidatePath("/admin/bendovi");
  redirect(`/admin/bendovi/${bandId}?sacuvano=1`);
}

export async function deleteBand(bandId: string) {
  await requireAdmin();
  await prisma.band.delete({ where: { id: bandId } });
  revalidatePath("/admin/bendovi");
  revalidatePath("/");
  redirect("/admin/bendovi");
}
