import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const GENRES = [
  { name: "Narodna", slug: "narodna" },
  { name: "Pop", slug: "pop" },
  { name: "Rok", slug: "rok" },
  { name: "Starogradska", slug: "starogradska" },
  { name: "Zabavna", slug: "zabavna" },
  { name: "Etno", slug: "etno" },
];

async function main() {
  for (const genre of GENRES) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre,
    });
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log(
      "ADMIN_EMAIL/ADMIN_PASSWORD nisu postavljeni — preskačem kreiranje admina.",
    );
    return;
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(`Admin nalog spreman: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
