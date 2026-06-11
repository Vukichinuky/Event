import { RegisterForm } from "./register-form";

export const metadata = { title: "Registracija benda" };

export default function RegistracijaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-stone-900">
            Registracija benda
          </h1>
          <p className="text-sm text-stone-500">
            Besplatno. Uredi profil, dodaj snimke i primaj upite parova.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
