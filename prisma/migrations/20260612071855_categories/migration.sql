-- Kategorije usluga + backfill postojećih profila u "bendovi"
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

INSERT INTO "Category" ("id", "name", "slug", "order") VALUES ('cat-bendovi', 'Bendovi', 'bendovi', 1);

ALTER TABLE "Band" ADD COLUMN "categoryId" TEXT;
UPDATE "Band" SET "categoryId" = 'cat-bendovi';
ALTER TABLE "Band" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Band" ADD CONSTRAINT "Band_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
