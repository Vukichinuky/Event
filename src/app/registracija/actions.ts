"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { rateLimitOk } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neispravan email"),
  password: z.string().min(8, "Lozinka mora imati bar 8 znakova"),
});

export type RegisterState = { error: string | null };

export async function registerBand(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("cf-connecting-ip") ??
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ??
    "nepoznat";
  if (!rateLimitOk(`registracija:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Previše pokušaja. Pokušaj ponovo za sat vremena." };
  }

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Nalog sa ovim mejlom već postoji — prijavi se." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "BAND",
    },
  });

  // „siroče" profil sa istim kontakt mejlom se automatski preuzima
  const orphan = await prisma.band.findFirst({
    where: { contactEmail: email, userId: null },
  });
  if (orphan) {
    await prisma.band.update({
      where: { id: orphan.id },
      data: { userId: user.id },
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) redirect("/prijava");
    throw err;
  }
  return { error: null };
}
