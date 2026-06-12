-- Dodaj calendarToken uz backfill za postojeće redove
ALTER TABLE "Band" ADD COLUMN "calendarToken" TEXT;
UPDATE "Band" SET "calendarToken" = md5(random()::text || clock_timestamp()::text || id);
ALTER TABLE "Band" ALTER COLUMN "calendarToken" SET NOT NULL;
CREATE UNIQUE INDEX "Band_calendarToken_key" ON "Band"("calendarToken");
