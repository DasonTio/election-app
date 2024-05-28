/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Candidate` table. All the data in the column will be lost.
  - Added the required column `chiefImageUrl` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chiefName` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deputyImageUrl` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deputyName` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "imageUrl",
DROP COLUMN "name",
ADD COLUMN     "chiefImageUrl" TEXT NOT NULL,
ADD COLUMN     "chiefName" TEXT NOT NULL,
ADD COLUMN     "deputyImageUrl" TEXT NOT NULL,
ADD COLUMN     "deputyName" TEXT NOT NULL;
