-- AlterTable
ALTER TABLE "User" ADD COLUMN "nickname" TEXT;

-- Backfill existing rows with their current display name
UPDATE "User" SET "nickname" = "name" WHERE "nickname" IS NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nickname" SET NOT NULL;
