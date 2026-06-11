# Svadbeni bendovi

Kustosiran katalog svadbenih bendova za BiH. Par pronađe bend, posluša snimke i
pošalje upit — bez registracije. Bend dobija upite, statistiku i upravlja
profilom. Kompletna specifikacija: [MASTER_PROMPT.md](./MASTER_PROMPT.md).

**Stack:** Next.js (App Router) · PostgreSQL · Prisma 7 · NextAuth (Auth.js v5) ·
self-host na Mac Mini preko Cloudflare Tunnel.

## Pokretanje lokalno

1. PostgreSQL mora da radi lokalno (Postgres.app ili Docker), sa praznom bazom:

   ```bash
   createdb svadbeni_bendovi
   ```

2. Kopiraj env fajl i popuni vrednosti:

   ```bash
   cp .env.example .env
   # AUTH_SECRET generiši sa: openssl rand -base64 32
   # ADMIN_EMAIL / ADMIN_PASSWORD — početni admin nalog
   ```

3. Instalacija, migracije, seed (žanrovi + admin nalog):

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

4. Dev server:

   ```bash
   npm run dev
   ```

Admin panel: `http://localhost:3000/admin` (prijava na `/prijava`).

## Skripte

| Komanda              | Šta radi                                    |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | dev server                                  |
| `npm run build`      | produkcioni build                           |
| `npm run start`      | produkcioni server                          |
| `npm run db:migrate` | nova migracija u developmentu               |
| `npm run db:deploy`  | primena migracija u produkciji              |
| `npm run db:seed`    | seed žanrova i admin naloga                 |
| `npm run lint`       | eslint                                      |

## Deploy (Mac Mini)

- `scripts/deploy.sh` — pull, install, migracije, build, PM2 reload.
- `ecosystem.config.cjs` — PM2 konfiguracija (port 3000, za Cloudflare Tunnel
  ingress).
- `scripts/backup.sh` — dnevni `pg_dump` iz cron-a; postavi `BACKUP_REMOTE` da
  bekap završi VAN Mac Minija.

## Status razvoja

Plan po nedeljama je u [MASTER_PROMPT.md](./MASTER_PROMPT.md) (Faza 7).

- [x] Nedelja 1–2 — temelj: Next.js, Prisma šema (cela baza), NextAuth (admin),
      admin CRUD bendova (uklj. „siroče“ profile), deploy/bekap skripte
- [x] Nedelja 3–4 — javni katalog: lista + filteri (žanr/budžet u URL-u,
      paginacija), profil benda (YouTube/IG embed, galerija, cena, CTA),
      admin upravljanje snimcima i slikama (upload na disk), brojač pregleda
      (dedup po sesiji), SEO (meta, JSON-LD, sitemap, robots)
- [x] Nedelja 5 — forma za upit (bez registracije, validacija, honeypot,
      rate-limit 5/h po IP), mejl bendu preko Resend-a, strana potvrde,
      admin pregled svih upita sa filterima i oznakom „čeka X dana"
- [x] Nedelja 6 — bend panel: registracija (auto-preuzimanje „siroče"
      profila po kontakt mejlu), uređivanje profila/snimaka/slika bez
      kontrole objave, upiti sa Prihvati/Odbij (+ vreme prvog odgovora),
      statistika (pregledi, upiti, prihvaćene svadbe), admin dodela naloga
- [x] Nedelja 7 — kalendar dostupnosti (klik-na-zauzeto, mesečna
      navigacija), auto-blok datuma na prihvaćen upit (+ oslobađanje na
      odbijanje), upit za zauzet datum se odbija, recenzije preko
      reviewToken-a (samo prihvaćen upit, 1:1), admin moderacija,
      javni prikaz sa prosečnom ocenom i odgovorom benda
- [ ] Nedelja 8 — poliranje + lansiranje
