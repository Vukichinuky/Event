"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";
import { slugify } from "@/lib/slug";

const bandSchema = z.object({
  name: z.string().trim().min(2, "Ime mora imati bar 2 znaka"),
  description: z.string().trim(),
  city: z.string().trim(),
  contactEmail: z.union([z.literal(""), z.string().trim().email("Neispravan email")]),
  contactPhone: z.string().trim(),
  priceFrom: z.coerce.number().int().positive("Cena „od“ je obavezna"),
  priceTo: z.union([z.literal(""), z.coerce.number().int().positive()]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
});

function parseBandForm(formData: FormData) {
  const parsed = bandSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    city: formData.get("city") ?? "",
    contactEmail: formData.get("contactEmail") ?? "",
    contactPhone: formData.get("contactPhone") ?? "",
    priceFrom: formData.get("priceFrom"),
    priceTo: formData.get("priceTo") ?? "",
    status: formData.get("status") ?? "DRAFT",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, data: null };
  }
  const d = parsed.data;
  if (d.priceTo !== "" && d.priceTo < d.priceFrom) {
    return { error: "Cena „do“ ne može biti manja od cene „od“", data: null };
  }
  return {
    error: null,
    data: {
      name: d.name,
      description: d.description,
      city: d.city,
      contactEmail: d.contactEmail === "" ? null : d.contactEmail,
      contactPhone: d.contactPhone === "" ? null : d.contactPhone,
      priceFrom: d.priceFrom,
      priceTo: d.priceTo === "" ? null : d.priceTo,
      status: d.status,
      genreIds: formData.getAll("genres").map(String),
    },
  };
}

async function uniqueSlug(name: string, excludeBandId?: string) {
  const base = slugify(name) || "bend";
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await prisma.band.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeBandId) return slug;
    slug = `${base}-${i}`;
  }
}

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
  redirect(`/admin/bendovi/${band.id}`);
}

export async function updateBand(bandId: string, formData: FormData) {
  await requireAdmin();
  const { error, data } = parseBandForm(formData);
  if (error || !data) {
    redirect(`/admin/bendovi/${bandId}?greska=${encodeURIComponent(error ?? "")}`);
  }

  const { genreIds, ...fields } = data;
  await prisma.band.update({
    where: { id: bandId },
    data: {
      ...fields,
      slug: await uniqueSlug(fields.name, bandId),
      genres: { set: genreIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/bendovi");
  redirect(`/admin/bendovi/${bandId}?sacuvano=1`);
}

export async function deleteBand(bandId: string) {
  await requireAdmin();
  await prisma.band.delete({ where: { id: bandId } });
  revalidatePath("/admin/bendovi");
  redirect("/admin/bendovi");
}
