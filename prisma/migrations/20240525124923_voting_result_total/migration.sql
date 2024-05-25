/*
  Warnings:

  - Added the required column `total` to the `VotingResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VotingResult" ADD COLUMN     "total" INTEGER NOT NULL;
