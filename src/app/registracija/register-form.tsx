"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ui } from "@/lib/ui";
import { registerBand, type RegisterState } from "./actions";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerBand,
    { error: null },
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className={ui.label}>
          Email benda
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={ui.input}
        />
        <p className="text-xs text-stone-400">
          Ako ti je admin već napravio profil sa ovim mejlom, automatski ga
          preuzimaš.
        </p>
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
          minLength={8}
          autoComplete="new-password"
          className={ui.input}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={`w-full ${ui.btnPrimary}`}
      >
        {pending ? "Registracija…" : "Registruj se"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Već imaš nalog?{" "}
        <Link
          href="/prijava"
          className="font-medium text-gold-dark underline-offset-4 hover:underline"
        >
          Prijavi se
        </Link>
      </p>
    </form>
  );
}
