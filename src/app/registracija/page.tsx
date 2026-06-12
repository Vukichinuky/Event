import Link from "next/link";
import { ui } from "@/lib/ui";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Registracija benda" };

export default function RegistracijaPage() {
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
            Svadbeni bendovi
          </span>
        </Link>

        <div className={`space-y-5 ${ui.card} p-7`}>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Registracija benda
            </h1>
            <p className="text-sm text-stone-500">
              Besplatno. Uredi profil, dodaj snimke i primaj upite parova.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
