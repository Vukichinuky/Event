import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 p-8 text-center">
      <div className="text-5xl">🎸</div>
      <h1 className="text-2xl font-bold text-stone-900">
        Ova strana ne postoji
      </h1>
      <p className="max-w-md text-stone-600">
        Možda je bend sklonjen, ili je link pogrešan. Katalog bendova te čeka
        na početnoj strani.
      </p>
      <Link
        href="/"
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
      >
        ← Svi bendovi
      </Link>
    </main>
  );
}
