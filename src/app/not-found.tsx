import Link from "next/link";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-cream p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_-10%,rgb(176_141_87/0.16),transparent_70%)]"
      />
      <div className="relative flex h-16 w-16 animate-[rise_0.5s_ease-out_both] items-center justify-center rounded-full bg-gold-soft text-3xl shadow-soft">
        🎸
      </div>
      <h1 className="relative animate-[rise_0.5s_ease-out_0.06s_both] font-display text-3xl font-semibold tracking-tight text-ink">
        Ova strana ne postoji
      </h1>
      <p className="relative max-w-md animate-[rise_0.5s_ease-out_0.12s_both] leading-relaxed text-stone-600">
        Možda je bend sklonjen, ili je link pogrešan. Katalog bendova te čeka
        na početnoj strani.
      </p>
      <div className="relative animate-[rise_0.5s_ease-out_0.18s_both]">
        <Link href="/" className={ui.btnPrimary}>
          ← Svi bendovi
        </Link>
      </div>
    </main>
  );
}
