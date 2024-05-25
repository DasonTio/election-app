/*
  Warnings:

  - You are about to drop the column `date` on the `EmployeeSchedule` table. All the data in the column will be lost.
  - Added the required column `endAt` to the `EmployeeSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `EmployeeSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" DROP COLUMN "date",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
