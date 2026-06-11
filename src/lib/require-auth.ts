import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/prijava");
  if (session.user.role !== "ADMIN") redirect("/");
  return session.user;
}
