/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `EmployeeAttendance` table. All the data in the column will be lost.
  - Added the required column `date` to the `EmployeeAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inTime` to the `EmployeeAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outTime` to the `EmployeeAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeAttendance" DROP CONSTRAINT "EmployeeAttendance_scheduleId_fkey";

-- DropIndex
DROP INDEX "EmployeeAttendance_scheduleId_key";

-- AlterTable
ALTER TABLE "EmployeeAttendance" DROP COLUMN "scheduleId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "inTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "outTime" TIMESTAMP(3) NOT NULL;
