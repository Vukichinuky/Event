import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-stone-900">
            Svadbeni bendovi
          </Link>
          <Link
            href="/prijava"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            Za bendove
          </Link>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-stone-500">
          Svadbeni bendovi — pronađi i poslušaj bend za svadbu, pošalji upit
          bez registracije.
        </div>
      </footer>
    </div>
  );
}
