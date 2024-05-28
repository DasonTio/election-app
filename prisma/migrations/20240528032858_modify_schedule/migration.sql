-- DropForeignKey
ALTER TABLE "EmployeeSchedule" DROP CONSTRAINT "EmployeeSchedule_divisionId_fkey";

-- AlterTable
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "divisionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "EmployeeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
