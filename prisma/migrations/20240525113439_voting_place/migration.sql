/*
  Warnings:

  - You are about to drop the column `votingPlaceId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,candidateId,placeId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_votingPlaceId_fkey";

-- DropIndex
DROP INDEX "Vote_userId_candidateId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "votingPlaceId",
ADD COLUMN     "placeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_candidateId_placeId_key" ON "Vote"("userId", "candidateId", "placeId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "VotingPlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
