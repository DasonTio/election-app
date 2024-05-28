/*
  Warnings:

  - Added the required column `status` to the `CandidateGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateGroup" ADD COLUMN     "status" "Status" NOT NULL;
