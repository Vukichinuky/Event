import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const H = 60 * 60 * 1000;
const D = 24 * H;

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

// Dnevni održavajući posao — poziva ga cron na Mac Miniju:
//   15 8 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/podsetnici
//
// Vremenski prozori su širine 24h, pa dnevno pokretanje svaki upit
// pogodi tačno jednom — nema potrebe za poljem "podsetnik poslat".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();

  // 1) Podsetnik bendu: nov upit čeka 48–72h bez odgovora
  const waiting = await prisma.inquiry.findMany({
    where: {
      status: "NEW",
      createdAt: { lte: new Date(now - 48 * H), gt: new Date(now - 72 * H) },
    },
    include: { band: true },
  });
  let reminded = 0;
  for (const inquiry of waiting) {
    if (!inquiry.band.contactEmail) continue;
    const sent = await sendEmail({
      to: inquiry.band.contactEmail,
      subject: `Podsetnik: upit za ${inquiry.eventDate.toISOString().slice(0, 10)} čeka tvoj odgovor`,
      text: [
        `Par ${inquiry.clientName} ti je pre dva dana poslao upit za svadbu`,
        `${inquiry.eventDate.toISOString().slice(0, 10)} u mestu ${inquiry.eventCity} — i još čeka odgovor.`,
        ``,
        `Telefon: ${inquiry.phone}`,
        `Email: ${inquiry.email}`,
        ``,
        `Parovi obično pitaju više bendova — ko se prvi javi, taj svira.`,
        `Detalji i odgovor: ${SITE_URL}/dashboard/upiti`,
      ].join("\n"),
    });
    if (sent) reminded++;
  }

  // 2) Upit bez odgovora 7 dana → NO_RESPONSE (admin ga vidi crveno)
  const expired = await prisma.inquiry.updateMany({
    where: { status: "NEW", createdAt: { lt: new Date(now - 7 * D) } },
    data: { status: "NO_RESPONSE" },
  });

  // 3) Posle odsvirane svadbe (2–3 dana) par dobija link za recenziju
  const played = await prisma.inquiry.findMany({
    where: {
      status: "ACCEPTED",
      review: null,
      eventDate: { lte: new Date(now - 2 * D), gt: new Date(now - 3 * D) },
    },
    include: { band: { select: { name: true } } },
  });
  let reviewAsked = 0;
  for (const inquiry of played) {
    const sent = await sendEmail({
      to: inquiry.email,
      subject: `Kako je sviralo — ${inquiry.band.name}?`,
      text: [
        `Čestitamo na svadbi, ${inquiry.clientName}! 🎉`,
        ``,
        `Nadamo se da je ${inquiry.band.name} napravio atmosferu za pamćenje.`,
        `Tvoja recenzija pomaže parovima koji tek biraju bend — treba ti minut:`,
        ``,
        `${SITE_URL}/recenzija/${inquiry.reviewToken}`,
      ].join("\n"),
    });
    if (sent) reviewAsked++;
  }

  return Response.json({
    podsetniciBendu: { kandidata: waiting.length, poslato: reminded },
    oznacenoBezOdgovora: expired.count,
    linkoviZaRecenziju: { kandidata: played.length, poslato: reviewAsked },
  });
}
