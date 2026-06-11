"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimitOk } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { formatKM } from "@/lib/format";

export type InquiryFormState = { error: string | null };

const inquirySchema = z.object({
  clientName: z.string().trim().min(2, "Upiši svoje ime"),
  phone: z.string().trim().min(6, "Upiši broj telefona"),
  email: z.string().trim().email("Neispravan email"),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Izaberi datum svadbe"),
  eventCity: z.string().trim().min(2, "Upiši mesto svadbe"),
  guestCount: z.union([
    z.literal(""),
    z.coerce.number().int().positive("Broj gostiju mora biti pozitivan"),
  ]),
  message: z.string().trim().max(2000, "Poruka je predugačka"),
});

export async function submitInquiry(
  slug: string,
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const band = await prisma.band.findUnique({ where: { slug } });
  if (!band || band.status !== "PUBLISHED") {
    return { error: "Bend nije pronađen." };
  }

  // honeypot — botovi popune skriveno polje; pravimo se da je prošlo
  if (String(formData.get("website") ?? "") !== "") {
    redirect(`/bend/${slug}/upit/hvala`);
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("cf-connecting-ip") ??
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ??
    "nepoznat";
  if (!rateLimitOk(`upit:${ip}`, 5, 60 * 60 * 1000)) {
    return {
      error: "Poslato je previše upita sa ove mreže. Pokušaj ponovo za sat vremena.",
    };
  }

  const parsed = inquirySchema.safeParse({
    clientName: formData.get("clientName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    eventDate: formData.get("eventDate"),
    eventCity: formData.get("eventCity"),
    guestCount: formData.get("guestCount") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const eventDate = new Date(`${data.eventDate}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(eventDate.getTime()) || eventDate < today) {
    return { error: "Datum svadbe ne može biti u prošlosti." };
  }

  // ne troši vreme para na bend koji je već zauzet tog datuma
  const taken = await prisma.unavailableDate.findUnique({
    where: { bandId_date: { bandId: band.id, date: eventDate } },
  });
  if (taken) {
    return {
      error: `${band.name} je već zauzet tog datuma. Probaj drugi datum ili pogledaj ostale bendove.`,
    };
  }

  await prisma.inquiry.create({
    data: {
      bandId: band.id,
      clientName: data.clientName,
      phone: data.phone,
      email: data.email,
      eventDate,
      eventCity: data.eventCity,
      guestCount: data.guestCount === "" ? null : data.guestCount,
      message: data.message,
    },
  });

  // mejl bendu posle odgovora korisniku — da ne usporava potvrdu
  if (band.contactEmail) {
    const to = band.contactEmail;
    after(() =>
      sendEmail({
        to,
        subject: `Novi upit za svadbu — ${data.eventDate} u ${data.eventCity}`,
        text: [
          `Imaš novi upit preko platforme Svadbeni bendovi!`,
          ``,
          `Bend: ${band.name}`,
          `Datum svadbe: ${data.eventDate}`,
          `Mesto: ${data.eventCity}`,
          data.guestCount ? `Broj gostiju: ${data.guestCount}` : null,
          `Cenovni rang na profilu: od ${formatKM(band.priceFrom)}`,
          ``,
          `Ko pita:`,
          `Ime: ${data.clientName}`,
          `Telefon: ${data.phone}`,
          `Email: ${data.email}`,
          data.message ? `\nPoruka:\n${data.message}` : null,
          ``,
          `Javi se paru što pre — brz odgovor donosi posao.`,
        ]
          .filter((line) => line !== null)
          .join("\n"),
      }),
    );
  }

  redirect(`/bend/${slug}/upit/hvala`);
}
