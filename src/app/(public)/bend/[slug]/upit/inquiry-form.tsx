"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryFormState } from "./actions";

const inputClass =
  "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none";

export function InquiryForm({
  slug,
  minDate,
}: {
  slug: string;
  minDate: string;
}) {
  const [state, formAction, pending] = useActionState<
    InquiryFormState,
    FormData
  >(submitInquiry.bind(null, slug), { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {/* honeypot — ljudi ga ne vide, botovi ga popune */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="eventDate" className="text-sm font-medium text-stone-700">
            Datum svadbe *
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            min={minDate}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="eventCity" className="text-sm font-medium text-stone-700">
            Mesto svadbe *
          </label>
          <input
            id="eventCity"
            name="eventCity"
            required
            minLength={2}
            placeholder="npr. Zvornik"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="guestCount" className="text-sm font-medium text-stone-700">
          Okvirni broj gostiju
        </label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          placeholder="npr. 200"
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-stone-700">
          Poruka bendu
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Sala, satnica, posebne želje…"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="clientName" className="text-sm font-medium text-stone-700">
            Tvoje ime *
          </label>
          <input
            id="clientName"
            name="clientName"
            required
            minLength={2}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-stone-700">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            minLength={6}
            autoComplete="tel"
            placeholder="+387 6x xxx xxx"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-stone-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Slanje…" : "Pošalji upit"}
      </button>
      <p className="text-xs text-stone-400">
        Bez registracije. Tvoje podatke vidi samo bend kom šalješ upit.
      </p>
    </form>
  );
}
