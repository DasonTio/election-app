/*
  Warnings:

  - You are about to drop the column `employeeId` on the `EmployeeSchedule` table. All the data in the column will be lost.
  - Added the required column `description` to the `EmployeeSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `EmployeeSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeSchedule" DROP CONSTRAINT "EmployeeSchedule_employeeId_fkey";

-- DropIndex
DROP INDEX "EmployeeSchedule_employeeId_date_key";

-- AlterTable
ALTER TABLE "EmployeeSchedule" DROP COLUMN "employeeId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
