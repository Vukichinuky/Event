"use client";

import { useActionState } from "react";
import { ui } from "@/lib/ui";
import { submitReview, type ReviewFormState } from "./actions";

export function ReviewForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    submitReview.bind(null, token),
    { error: null },
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <fieldset className="space-y-2.5">
        <legend className={ui.label}>Ocena *</legend>
        <div className="flex gap-2.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={value}
                required
                className="peer sr-only"
              />
              <span className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-stone-200 bg-white text-sm shadow-soft transition duration-200 select-none peer-checked:border-gold peer-checked:bg-gold peer-checked:text-white peer-checked:shadow-lift peer-focus-visible:ring-4 peer-focus-visible:ring-gold/25 hover:-translate-y-0.5 hover:border-gold">
                <span className="font-semibold">{value}</span>
                <span aria-hidden className="text-xs">
                  ★
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="text" className={ui.label}>
          Kako je bilo?
        </label>
        <textarea
          id="text"
          name="text"
          rows={5}
          maxLength={2000}
          placeholder="Atmosfera, repertoar, dogovor — šta bi rekao paru koji bira bend?"
          className={ui.input}
        />
      </div>

      <button type="submit" disabled={pending} className={ui.btnGold}>
        {pending ? "Slanje…" : "Pošalji recenziju"}
      </button>
      <p className="text-xs text-stone-400">
        Recenzija se objavljuje nakon provere administratora.
      </p>
    </form>
  );
}
