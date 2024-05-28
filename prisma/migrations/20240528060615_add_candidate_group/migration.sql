/*
  Warnings:

  - Added the required column `candidateGroupId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "candidateGroupId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CandidateGroup" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_candidateGroupId_fkey" FOREIGN KEY ("candidateGroupId") REFERENCES "CandidateGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
