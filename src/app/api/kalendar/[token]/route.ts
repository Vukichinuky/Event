import { prisma } from "@/lib/prisma";

// .ics feed kalendara benda — jednosmerno sajt → telefon (Google/Apple
// kalendar se pretplati na URL i sam povlači izmene)

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function dateBasic(d: Date) {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const calendarToken = token.replace(/\.ics$/, "");

  const band = await prisma.band.findUnique({
    where: { calendarToken },
    include: {
      unavailableDates: { orderBy: { date: "asc" } },
      inquiries: { where: { status: "ACCEPTED" } },
    },
  });
  if (!band) return new Response("Not found", { status: 404 });

  const acceptedByDate = new Map(
    band.inquiries.map((inquiry) => [dateBasic(inquiry.eventDate), inquiry]),
  );

  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  const events = band.unavailableDates.map((entry) => {
    const day = dateBasic(entry.date);
    const nextDay = dateBasic(new Date(entry.date.getTime() + 86_400_000));
    const inquiry =
      entry.reason === "BOOKED" ? acceptedByDate.get(day) : undefined;

    const summary = inquiry
      ? `Svadba — ${inquiry.eventCity}`
      : entry.reason === "BOOKED"
        ? "Svadba (rezervisano)"
        : "Zauzeto";
    const description = inquiry
      ? [
          inquiry.clientName,
          inquiry.phone,
          inquiry.guestCount ? `~${inquiry.guestCount} gostiju` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "";

    return [
      "BEGIN:VEVENT",
      `UID:${entry.id}@svadbeni-bendovi`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`,
      `DTEND;VALUE=DATE:${nextDay}`,
      `SUMMARY:${escapeText(summary)}`,
      description ? `DESCRIPTION:${escapeText(description)}` : null,
      inquiry ? `LOCATION:${escapeText(inquiry.eventCity)}` : null,
      "END:VEVENT",
    ]
      .filter(Boolean)
      .join("\r\n");
  });

  const body =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Svadbeni bendovi//SR",
      "CALSCALE:GREGORIAN",
      `X-WR-CALNAME:${escapeText(band.name)} — svadbe`,
      ...events,
      "END:VCALENDAR",
    ].join("\r\n") + "\r\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
