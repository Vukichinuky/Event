"use client";

import { useActionState } from "react";
import { submitReview, type ReviewFormState } from "./actions";

export function ReviewForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    submitReview.bind(null, token),
    { error: null },
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-stone-700">
          Ocena *
        </legend>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-stone-200 px-3 py-2 text-sm has-checked:border-stone-900 has-checked:bg-stone-900 has-checked:text-white"
            >
              <input
                type="radio"
                name="rating"
                value={value}
                required
                className="sr-only"
              />
              <span className="text-base">{value}</span>
              <span aria-hidden>★</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="text" className="text-sm font-medium text-stone-700">
          Kako je bilo?
        </label>
        <textarea
          id="text"
          name="text"
          rows={5}
          maxLength={2000}
          placeholder="Atmosfera, repertoar, dogovor — šta bi rekao paru koji bira bend?"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? "Slanje…" : "Pošalji recenziju"}
      </button>
      <p className="text-xs text-stone-400">
        Recenzija se objavljuje nakon provere administratora.
      </p>
    </form>
  );
}
