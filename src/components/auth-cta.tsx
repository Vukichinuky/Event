import Link from "next/link";
import { auth } from "@/lib/auth";

// Dugme u javnom headeru: izlogovan → prijava; ulogovan → njegov panel
export async function AuthCta() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/prijava"
        className="rounded-full border border-stone-300/80 bg-white/60 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-gold hover:text-gold-dark"
      >
        Za ponuđače
      </Link>
    );
  }

  return (
    <Link
      href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
      className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-stone-800"
    >
      Moj panel →
    </Link>
  );
}
