import { redirect } from "next/navigation";
import { requireUser } from "@/lib/require-auth";

// Posle prijave — admin u admin panel, bend u svoj panel
export default async function PreusmeriPage() {
  const user = await requireUser();
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}
