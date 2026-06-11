import Link from "next/link";
import { requireBand } from "@/lib/require-auth";
import { signOut } from "@/lib/auth";

export const metadata = { title: "Bend panel" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, band } = await requireBand();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6">
            <span className="font-semibold text-stone-900">
              {band?.name ?? "Bend panel"}
            </span>
            <Link
              href="/dashboard"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Pregled
            </Link>
            <Link
              href="/dashboard/upiti"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Upiti
            </Link>
            <Link
              href="/dashboard/profil"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Profil
            </Link>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/prijava" });
            }}
            className="flex items-center gap-3"
          >
            <span className="hidden text-sm text-stone-500 sm:inline">
              {user.email}
            </span>
            <button
              type="submit"
              className="text-sm text-stone-600 underline hover:text-stone-900"
            >
              Odjava
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
