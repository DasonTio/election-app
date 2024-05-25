/*
  Warnings:

  - You are about to drop the `VotingPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VotingResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_votingPlaceId_fkey";

-- DropForeignKey
ALTER TABLE "VotingResult" DROP CONSTRAINT "VotingResult_candidateId_fkey";

-- DropTable
DROP TABLE "VotingPlace";

-- DropTable
DROP TABLE "VotingResult";

-- CreateTable
CREATE TABLE "VotePlace" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VotePlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteResult" (
    "candidateId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VoteResult_createdAt_candidateId_key" ON "VoteResult"("createdAt", "candidateId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votingPlaceId_fkey" FOREIGN KEY ("votingPlaceId") REFERENCES "VotePlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteResult" ADD CONSTRAINT "VoteResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
