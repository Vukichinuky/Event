import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const bandSchema = z.object({
  name: z.string().trim().min(2, "Ime mora imati bar 2 znaka"),
  description: z.string().trim(),
  city: z.string().trim(),
  contactEmail: z.union([
    z.literal(""),
    z.string().trim().email("Neispravan email"),
  ]),
  contactPhone: z.string().trim(),
  priceFrom: z.coerce.number().int().positive("Cena „od“ je obavezna"),
  priceTo: z.union([z.literal(""), z.coerce.number().int().positive()]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
});

export function parseBandForm(formData: FormData) {
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

// Za bend self-service: status profila ne sme da se menja kroz formu benda
export function omitStatus<T extends { status: unknown; genreIds: string[] }>(
  data: T,
): Omit<T, "status" | "genreIds"> & { genreIds: string[] } {
  const { status: _status, genreIds, ...fields } = data;
  void _status;
  return { ...fields, genreIds };
}

export async function uniqueSlug(name: string, excludeBandId?: string) {
  const base = slugify(name) || "bend";
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await prisma.band.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeBandId) return slug;
    slug = `${base}-${i}`;
  }
}
