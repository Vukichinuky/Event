import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ui } from "@/lib/ui";
import { loginAction } from "./actions";

export const metadata = { title: "Prijava" };

export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string }>;
}) {
  const { greska } = await searchParams;

  // već ulogovan — pravo u panel
  const session = await auth();
  if (session?.user) redirect("/preusmeri");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.18),transparent_70%)]"
      />
      <div className="relative w-full max-w-sm animate-[rise_0.5s_ease-out_both] space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg text-gold shadow-soft">
            ♫
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Sve za svadbu
          </span>
        </Link>

        <form action={loginAction} className={`space-y-5 ${ui.card} p-7`}>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Prijava
            </h1>
            <p className="text-sm text-stone-500">Panel za ponuđače i admina.</p>
          </div>

          {greska && (
            <p className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
              Pogrešan email ili lozinka.
            </p>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className={ui.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={ui.input}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className={ui.label}>
              Lozinka
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={ui.input}
            />
          </div>

          <button type="submit" className={`w-full ${ui.btnPrimary}`}>
            Prijavi se
          </button>

          <p className="text-center text-sm text-stone-500">
            Nemaš nalog?{" "}
            <Link
              href="/registracija"
              className="font-medium text-gold-dark underline-offset-4 hover:underline"
            >
              Registruj se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
