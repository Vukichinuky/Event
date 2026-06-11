import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/prijava");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

// Bend sa nalogom; vraća i njegov profil (null dok mu admin ne dodeli / ne napravi svoj)
export async function requireBand() {
  const user = await requireUser();
  if (user.role !== "BAND") redirect("/admin");
  const band = await prisma.band.findUnique({ where: { userId: user.id } });
  return { user, band };
}

// Pristup bendu ima admin ili vlasnik profila — za zajedničke akcije (mediji)
export async function requireBandAccess(bandId: string) {
  const user = await requireUser();
  if (user.role === "ADMIN") return user;
  const band = await prisma.band.findUnique({
    where: { id: bandId },
    select: { userId: true },
  });
  if (!band || band.userId !== user.id) redirect("/dashboard");
  return user;
}
