-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_divisionId_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "divisionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "EmployeeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
