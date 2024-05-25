/*
  Warnings:

  - You are about to drop the column `placeId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,candidateId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_placeId_fkey";

-- DropIndex
DROP INDEX "Vote_userId_candidateId_placeId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "placeId",
ADD COLUMN     "votingPlaceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_candidateId_key" ON "Vote"("userId", "candidateId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votingPlaceId_fkey" FOREIGN KEY ("votingPlaceId") REFERENCES "VotingPlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
