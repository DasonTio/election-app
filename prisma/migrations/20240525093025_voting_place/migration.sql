/*
  Warnings:

  - Added the required column `status` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_placeId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "placeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "VotingPlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
