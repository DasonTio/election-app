/*
  Warnings:

  - A unique constraint covering the columns `[candidateId]` on the table `VoteResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VoteResult_createdAt_candidateId_key";

-- CreateIndex
CREATE UNIQUE INDEX "VoteResult_candidateId_key" ON "VoteResult"("candidateId");
