/*
  Warnings:

  - You are about to drop the column `endTime` on the `CandidateGroup` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `CandidateGroup` table. All the data in the column will be lost.
  - Added the required column `endAt` to the `CandidateGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `CandidateGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateGroup" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
