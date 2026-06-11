import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL je opciono na nivou configa: `prisma generate` (postinstall)
// mora da radi i bez .env fajla — baza treba tek za migrate/studio.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  ...(process.env.DATABASE_URL
    ? { datasource: { url: process.env.DATABASE_URL } }
    : {}),
});
