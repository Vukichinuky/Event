"use client";

import { useActionState } from "react";
import { ui } from "@/lib/ui";
import { submitInquiry, type InquiryFormState } from "./actions";

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
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {/* honeypot — ljudi ga ne vide, botovi ga popune */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="eventDate" className={ui.label}>
            Datum svadbe *
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            min={minDate}
            className={ui.input}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="eventCity" className={ui.label}>
            Mesto svadbe *
          </label>
          <input
            id="eventCity"
            name="eventCity"
            required
            minLength={2}
            placeholder="npr. Zvornik"
            className={ui.input}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="guestCount" className={ui.label}>
          Okvirni broj gostiju
        </label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          placeholder="npr. 200"
          className={ui.input}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className={ui.label}>
          Poruka bendu
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Sala, satnica, posebne želje…"
          className={ui.input}
        />
      </div>

      <div className="h-px bg-stone-100" />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="clientName" className={ui.label}>
            Tvoje ime *
          </label>
          <input
            id="clientName"
            name="clientName"
            required
            minLength={2}
            autoComplete="name"
            className={ui.input}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className={ui.label}>
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
            className={ui.input}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className={ui.label}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={ui.input}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={`w-full sm:w-auto ${ui.btnGold}`}
      >
        {pending ? "Slanje…" : "Pošalji upit"}
      </button>
      <p className="text-xs text-stone-400">
        Bez registracije. Tvoje podatke vidi samo bend kom šalješ upit.
      </p>
    </form>
  );
}
