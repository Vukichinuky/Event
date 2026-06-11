import { loginAction } from "./actions";

export const metadata = { title: "Prijava" };

export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string }>;
}) {
  const { greska } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-stone-900">Prijava</h1>

        {greska && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Pogrešan email ili lozinka.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-stone-700"
          >
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Prijavi se
        </button>
      </form>
    </main>
  );
}
