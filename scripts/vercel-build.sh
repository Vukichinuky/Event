#!/bin/sh
# Vercel build: migracije + seed samo ako je baza podešena — bez nje se
# sajt svejedno deployuje (radiće tek kad se DATABASE_URL doda).
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL postoji → prisma migrate deploy + seed"
  npx prisma migrate deploy
  npx tsx prisma/seed.ts
else
  echo "!!! DATABASE_URL NIJE postavljen — preskačem migracije i seed."
  echo "!!! Sajt će raditi tek kad dodaš DATABASE_URL (Storage -> Neon) i redeploy-uješ."
fi

npx next build
