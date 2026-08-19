-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('EMPATHY', 'SAME');

-- DropIndex
DROP INDEX "Vote_painPointId_userId_key";

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "type" "ReactionType" NOT NULL DEFAULT 'EMPATHY';

-- CreateIndex
CREATE UNIQUE INDEX "Vote_painPointId_userId_type_key" ON "Vote"("painPointId", "userId", "type");
