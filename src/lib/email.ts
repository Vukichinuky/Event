// Slanje mejlova preko Resend HTTP API-ja (bez SDK zavisnosti).
// Bez RESEND_API_KEY mejl se preskače — upit svejedno ostaje u bazi i panelu.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY nije postavljen — mejl nije poslat:", opts.subject);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ?? "Svadbeni bendovi <onboarding@resend.dev>",
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("Slanje mejla nije uspelo:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Slanje mejla nije uspelo:", err);
    return false;
  }
}
