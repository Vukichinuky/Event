"use client";

import { useActionState } from "react";
import { registerBand, type RegisterState } from "./actions";

const inputClass =
  "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerBand,
    { error: null },
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          Email benda
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
        <p className="text-xs text-stone-400">
          Ako ti je admin već napravio profil sa ovim mejlom, automatski ga
          preuzimaš.
        </p>
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
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? "Registracija…" : "Registruj se"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Već imaš nalog?{" "}
        <a href="/prijava" className="underline">
          Prijavi se
        </a>
      </p>
    </form>
  );
}
