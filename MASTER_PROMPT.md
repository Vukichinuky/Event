# MASTER PROMPT — Platforma za rezervaciju svadbenih bendova (BiH)

> Specifikacija proizvoda za izgradnju. Daj ovaj dokument AI-u ili developeru kao kompletan brief.
> Stack: Next.js (App Router) + PostgreSQL + Prisma + NextAuth + self-host na Mac Mini preko Cloudflare Tunnel.
> Napomena: platforma NEMA regije — svi bendovi putuju po cijeloj državi, a dolaze i iz drugih država. Katalog je jedinstven, državni (i šire), od prvog dana.

-----

## KONTEKST PROIZVODA

Praviš kustosiran katalog svadbenih **bendova** za BiH. Par koji planira svadbu može — bez da zna ime nijednog benda — da pronađe bendove, pogleda i posluša njihove snimke, i pošalje upit. Bend dobija upit, prati statistiku i upravlja svojim profilom i kalendarom.

**Suština vrednosti:** otkrivanje i procena benda koji ne poznaješ (“ne znam koga da tražim — pokaži mi sve bendove sa snimcima”). NE rezervacija, NE chat, NE plaćanje.

**Primarni korisnik:** par koji planira svadbu (jednokratni korisnik, nula retencije — zato je marketing tempiran na trenutak planiranja).
**Dugoročna imovina:** bend (vraća se, svira 30+ svadbi godišnje, plaća pretplatu od mes. 6+).
**Adut osnivača:** lično poznaje bendove i radi na svadbama.

**Lansiranje:** jedinstven katalog za celu BiH od prvog dana; start sa bendovima koje osnivač lično poznaje, pa širenje kataloga bend-po-bend. Bendovi putuju svuda — i iz drugih država — pa lokacija benda nije ograničenje.

**Monetizacija:** pretplata za bendove (mesec 6+), ručna naplata u startu. NEMA online plaćanja u MVP-u.
**Cena reference:** bend uzima 3000–4000 KM po svadbi → pretplata 30–50 KM/mes je laka prodaja AKO bend vidi upite.

-----

## FAZA 1 — VALIDACIJA IDEJE (ZAKLJUČENO)

Ključni nalazi koji oblikuju sve ostalo:

- Ovo je **“vitamin”, ne “lek”** — par ima zaobilazno rešenje (preporuka, Instagram). Niko neće sam tražiti platformu → marketing mora biti prisutan u trenutku planiranja.
- **Cold-start rizik:** 10 bendova nije marketplace, to je katalog. OK za start; osnivač ručno unosi sve bendove prvih 6 meseci.
- **Merljivost vrednosti za bend je presudna:** ako bend ne vidi da mu platforma donosi upite, otkazaće pretplatu. Zato upit ide PREKO platforme (ne prikazan telefon), uz statistiku.
- **Sezonalnost:** svadbe maj–septembar; pola godine sajt izgleda mrtvo — planirati sadržaj za mrtvu sezonu.

-----

## FAZA 2 — DIZAJN PROIZVODA

### MVP (Must-have)

- Početna strana sa listom bendova (kartice: ime, žanr, naslovna slika, cena “od”).
- Profil benda: opis, **video snimci preko embeda** (YouTube/Instagram — NE upload), galerija slika, žanrovi, cenovni rang.
- Filteri: žanr, cenovni rang, (kasnije) slobodan datum.
- **Forma za upit (srce platforme):** datum, mesto, broj gostiju, poruka, kontakt para. Stiže bendu na mejl + u panel. Par BEZ naloga.
- **Bend panel:** registracija (self-service), uređivanje profila, embed snimaka, upload slika, kalendar dostupnosti, pregled upita, statistika (pregledi + broj upita), odgovor na recenzije.
- **Admin panel:** kreiranje/uređivanje bendova (uklj. “siroče” profile pre nego bend ima nalog), moderacija recenzija, pregled svih upita (praćenje “ne javlja se” problema).
- **Recenzije sa moderacijom:** ostavlja ih samo par koji je poslao upit (vezano za upit), admin odobrava, bend ima pravo javnog odgovora.

### Should-have (mesec 4–8)

- Auto-blokiranje datuma kad bend prihvati upit.
- Bend self-service potpuno preuzima svoj profil.
- Pretplata + naplata.
- `.ics` izvoz kalendara (jednosmerno sajt → telefon).

### Nice-to-have (kasnije / možda nikad)

- Dvosmerna Google/Apple Calendar sinhronizacija.
- Chat uživo, mape, online plaćanje honorara, mobilna aplikacija, AI preporuke.

### Tokovi korisnika

- **Par:** uđe → vidi bendove → filtrira po žanru/ceni → otvori profil → pogleda 2–3 snimka → “Pošalji upit” → popuni formu → gotovo. **Nula registracije.**
- **Bend:** mejl “imaš upit” → login → vidi detalje + kontakt → javi se direktno; u panelu vidi statistiku i upravlja kalendarom.
- **Admin:** unosi bend, lepi snimke, odobrava recenzije, prati upite koji vise.

### Ključne UX odluke

- **Video je proizvod** — snimak je prva stvar na profilu, ne opis.
- **Nula registracije za para** — svako dodatno polje obara konverziju.
- **Cena “od” obavezna** — skrivena cena = nema upita = bend ne vidi vrednost.

### Gde sistem puca (ugrađene zaštite)

- Recenzije u maloj sredini = rizik drame → moderacija + pravo benda na odgovor + vezivanje za realan upit.
- Bendovi se opiru ceni → rang (“2000–4000 KM”) obavezan uslov za listanje.
- Par pošalje upit, bend ćuti → pratiti “vreme do odgovora”, opominjati bend; tihi ubica reputacije.
- Sezonalnost → planirati sadržaj/marketing za mrtvu sezonu.
- Par ne zna da platforma postoji u trenutku planiranja → rešava Faza 6.

-----

## FAZA 3 — TEHNIČKA ARHITEKTURA

### Stack i odluke

- **Next.js (App Router)** — server komponente za liste/profile (SEO bitan: parovi guglaju “bend za svadbu”).
- **PostgreSQL** — lokalno na Mac Miniju.
- **Prisma ORM** — type-safe, migracije.
- **NextAuth (Auth.js)** — ne Clerk (Clerk je plaćeni SaaS, šalje podatke napolje, protivreči self-hosted setupu). 2 role: ADMIN, BAND.
- **Slike:** lokalni disk Mac Minija + Next Image optimizacija (lagano, OK kroz tunnel).
- **Video:** embed (YouTube/IG). Nula hostovanja, nula transkodovanja. **Cloudflare Tunnel free plan ne sme da servira velik video saobraćaj.**
- **Mejl:** Resend ili SMTP (besplatni tier).
- **Plaćanje:** NEMA u MVP-u (ručno mes. 6+).
- **Chat:** NEMA (upit → mejl).
- **Bačeno:** Stripe, WebSockets/Pusher, S3/Cloudinary, mape, Google/Apple sync.

### Model baze (entiteti i ključne veze)

- **User** — email, password hash, role (ADMIN|BAND).
- **Band** — `userId` OPCIONO (admin pravi profil pre nego bend ima nalog → rešava cold-start); name, slug (SEO: `/bend/ime`), description, genres, city (sedište benda, čisto informativno — bend svira svuda), priceFrom (obavezno), priceTo, coverImage, status (DRAFT|PUBLISHED|HIDDEN), viewCount.
- **Video** — bandId, url, platform, order.
- **Photo** — bandId, lokalni path, order.
- **Genre** — name (narodna, pop, starogradska…).
- **Inquiry** — bandId; podaci para (clientName, phone, email, eventDate, eventCity, guestCount, message); status (NEW|ACCEPTED|DECLINED|NO_RESPONSE); `reviewToken` (link za recenziju); respondedAt.
- **UnavailableDate** — bandId, date, reason (ručno | rezervisano-upit).
- **Review** — bandId, inquiryId (1:1 — samo par koji je slao upit), rating 1–5, text, status (PENDING|APPROVED|REJECTED), bandReply.

Ključne odluke: NEMA Region entiteta — bendovi putuju svuda, pa se ne filtrira po lokaciji; `city` na bendu je samo informacija na profilu. `Band.userId` opciono → admin pravi “siroče” profil. `Inquiry.reviewToken` → recenzija vezana za realan upit. Prelazak upita u ACCEPTED → automatski kreira `UnavailableDate`.

### API rute

- **Javno:** lista bendova + filteri (server komponenta), profil `/bend/[slug]` (inkrementira viewCount), `POST /api/inquiries` (rate-limit po IP — inače spam), `POST /api/reviews/[token]`.
- **Bend (auth):** `/dashboard`; server actions: updateProfile, addVideo, uploadPhoto, toggleUnavailableDate, respondToInquiry (menja status + auto-blok), replyToReview.
- **Admin (auth):** CRUD bendova + “siroče” profili, moderacija recenzija, pregled svih upita.

### State management

Namerno minimalno. Server komponente + server actions nose 90%. `useState` za forme. URL search params (`nuqs`) za filtere (deljiv/SEO link). Bez Redux/Zustand — bio bi over-engineering.

### Deploy (Mac Mini + Cloudflare Tunnel)

1. PostgreSQL lokalno (Postgres.app ili Docker).
1. Next.js build → **PM2** (preživi restart/pad), kao 4. app pored postojeće 3.
1. Cloudflare Tunnel → domen `→ localhost:3000` (novi ingress u config.yml).
1. Slike u folderu van build-a (npr. `/data/uploads`), bekapovati.
1. **`pg_dump` cron dnevno — životno osiguranje. Bekap MORA van Mac Minija** (jedna tačka otkaza = ceo biznis).
1. `prisma migrate deploy` u deploy skripti.
1. `.env`: DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY.

-----

## FAZA 4 — RAZLAGANJE FUNKCIONALNOSTI

### MUST-HAVE

**Lista bendova + filteri**

- Svrha: par otkriva bendove bez znanja imena.
- Backend: query po genre/priceFrom-To, samo status=PUBLISHED, paginacija.
- Frontend: grid kartica, filteri u URL-u, prazno stanje (“nema bendova za izabrane filtere”).
- Edge: nula rezultata; bend bez slike (placeholder); jako dugačka imena.

**Profil benda**

- Svrha: par procenjuje bend (snimci + cena + utisak).
- Backend: fetch po slug, inkrement viewCount (deduplikovati po sesiji da se ne napumpava).
- Frontend: video prvo, pa galerija, opis, cena, dugme “Pošalji upit”.
- Edge: neispravan/obrisan embed link; bend HIDDEN/DRAFT (404 za javnost).

**Forma za upit**

- Svrha: srce platforme — spaja para i bend, dokaz vrednosti.
- Backend: validacija, rate-limit po IP, kreira Inquiry (status NEW), šalje mejl bendu, generiše reviewToken.
- Frontend: minimalna forma (datum, mesto, gosti, poruka, kontakt), potvrda uspeha.
- Edge: spam/botovi (rate-limit, honeypot); bend bez mejla; nevažeći datum (prošlost).

**Bend panel — upiti + statistika**

- Svrha: bend vidi vrednost (zato i plaća kasnije).
- Backend: lista upita po bandId, brojači (viewCount, broj upita po periodu).
- Frontend: lista upita sa statusom, dugmad Prihvati/Odbij, statistika.
- Edge: nula upita (poruka ohrabrenja, ne prazan ekran); stari upiti.

**Bend panel — profil/snimci/slike/kalendar**

- Svrha: bend sam održava sadržaj.
- Backend: update polja, validacija embed URL-a (samo YT/IG), upload slike na disk, toggle UnavailableDate.
- Frontend: forma profila, lista snimaka (dodaj/obriši/redosled), kalendar klik-na-zauzeto.
- Edge: pogrešan video link; preveliki upload (limit veličine/tip); duplikat datuma.

**Recenzije sa moderacijom**

- Svrha: poverenje, socijalni dokaz.
- Backend: kreira se preko reviewToken (samo par koji je slao upit), status PENDING; admin APPROVE/REJECT; bandReply.
- Frontend: forma recenzije preko linka; prikaz samo APPROVED; odgovor benda ispod.
- Edge: pokušaj recenzije bez upita (token obavezan); osvetnička recenzija (moderacija); jedan upit = jedna recenzija.

**Admin panel**

- Svrha: osnivač kontroliše katalog i kvalitet.
- Backend: CRUD bendova, kreiranje “siroče” profila (userId null), moderacija recenzija, pregled svih upita.
- Frontend: tabele bendova/recenzija/upita, filteri po statusu.
- Edge: dodela “siroče” profila bendu kad se registruje; upiti koji vise (NO_RESPONSE).

### SHOULD-HAVE

- Auto-blok datuma (ACCEPTED → UnavailableDate).
- Potpuni self-service preuzimanja profila.
- Pretplata + naplata (status PUBLISHED vezan za aktivnu pretplatu).
- `.ics` izvoz/feed kalendara.

### NICE-TO-HAVE

- Dvosmerna Google/Apple sync (poseban projekat — OAuth, security review, CalDAV — tek na 200+ bendova).
- Chat, mape, online plaćanje, mobilna app, AI preporuke.

-----

## FAZA 5 — UX/UI STRATEGIJA

**Landing strana**

- Cilj: par za 5 sekundi shvati “ovde nalazim bend za svadbu i čujem kako sviraju”.
- Heroj: jasna izjava + odmah lista/pretraga bendova (ne marketing blabla).
- Fokus: konverzija ka profilima. Filteri vidljivi odmah.

**Profil benda**

- Video na vrhu (autoplay isključen, thumbnail vidljiv). Cena “od” jasno. Dugme “Pošalji upit” lepljivo na mobilnom.
- Poverenje: recenzije, godine iskustva, broj odsviranih svadbi (ako se prati). Istaknuti da bend svira na celoj teritoriji BiH (i šire).

**Pretraga i filteri**

- Žanr + cena = dva glavna filtera (kasnije i slobodan datum). Filteri u URL-u (deljivo, SEO).
- Brzina: server render, bez “loading spinner pakla”.

**Booking (upit) flow**

- Što kraće. Jedan ekran. Datum, mesto, gosti, poruka, kontakt. Potvrda + “bend će ti se javiti”.
- Bez prisile na registraciju.

**Chat između korisnika**

- NEMA u MVP-u. Komunikacija = upit → bend zove para. Ne gradi chat dok ne dokažeš protok.

**Prioriteti dizajna:** (1) brzina rezervacije, (2) poverenje, (3) konverzija. Mobile-first — parovi pretražuju na telefonu.

-----

## FAZA 6 — GROWTH STRATEGIJA

**Prvih 100 bendova (teška strana — ali osnivačev adut):**

- Mesec 1–6: osnivač ručno unosi bendove koje lično poznaje + sreće na svadbama. Besplatno. “Siroče” profili dok bend ne preuzme nalog.
- Argument bendu: “Besplatno te listamo, vidiš koliko upita stiže, plaćaš tek kad vidiš vrednost.” Cena pretplate = 1% jedne svadbe.
- Bend po bend: prvo 10–15 bendova iz osnivačeve mreže = pun, kvalitetan katalog od starta; pošto svaki bend svira svuda, svaki novi bend odmah povećava ponudu za SVE parove u državi. **Pun katalog kvalitetnih bendova > velika lista praznih profila.**

**Prvi klijenti (parovi):**

- SEO: strane tipa “bend za svadbu [grad]” — parovi guglaju po svom gradu, a pošto bendovi putuju svuda, svaka takva strana prikazuje ceo katalog. Prednost ranog ulaska.
- Prisustvo u trenutku planiranja: saradnja sa salama, dekoraterima, fotografima, wedding grupama na FB. Tu su parovi.
- Sam bend deli svoj profil (“evo me na platformi”) → besplatan dolazak parova.

**Viralni mehanizmi:**

- Bend deli link profila umesto da svaki put šalje snimke ručno → platforma postaje alat koji bend SAM širi.
- Recenzija nakon svadbe → svež sadržaj → bolji SEO.

**Retencija:**

- Para nema (jednokratni) — i to je OK.
- Bend = prava retencija: statistika upita, vidljivost, lakoća deljenja profila. Bend ostaje dok vidi upite.

-----

## FAZA 7 — PLAN IZVRŠENJA

Princip: prvo ono što dokazuje vrednost (upit + profil), pa ostalo. Ne gradi ništa iz Nice-to-have dok MVP ne radi sa pravim bendovima.

**Nedelja 1–2 — Temelj**

- Setup: Next.js, PostgreSQL, Prisma schema, NextAuth (admin), deploy pipeline (PM2 + Tunnel), bekap baze.
- Admin može da kreira bend (uklj. “siroče” profil).

**Nedelja 3–4 — Javni katalog**

- Lista bendova + filteri (žanr/cena).
- Profil benda (video embed, galerija, cena).
- SEO osnove (slug, meta, sitemap).

**Nedelja 5 — Srce: upit**

- Forma za upit + mejl bendu + rate-limit.
- Admin pregled svih upita.

**Nedelja 6 — Bend panel**

- Registracija benda, preuzimanje “siroče” profila, uređivanje profila/snimaka/slika.
- Pregled upita + statistika.

**Nedelja 7 — Kalendar + recenzije**

- Kalendar dostupnosti + auto-blok na ACCEPTED.
- Recenzije preko reviewToken + admin moderacija + odgovor benda.

**Nedelja 8 — Poliranje + lansiranje**

- Mobile poliranje, prazna stanja, bekap test, opominjanje za upite bez odgovora.
- Ručni unos prvih 10–15 bendova iz osnivačeve mreže. Lansiranje.

**Šta IGNORISATI dok ne dođe vreme:**

- Online plaćanje (mes. 6+, prvo ručno).
- Google/Apple kalendar sync.
- Chat, mape, mobilna app, AI.
- Masovni marketing (prvo napuni katalog i dokaži protok upita).

-----

## STALNA PRAVILA ZA IZVOĐENJE

- Ne graditi ništa van trenutne nedelje iz plana.
- Skalabilna tehnika, lansiranje sa malim katalogom.
- Svaka funkcija mora da dokazuje vrednost bendu (jer bend plaća) ili konverziju paru.
- Bekap baze van Mac Minija pre bilo kakve naplate.
- Kad nešto usporava lansiranje a ne menja vrednost za korisnika — odložiti.
