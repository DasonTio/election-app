-- CreateTable
CREATE TABLE "EmployeeAttendance" (
    "employeeId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAttendance_employeeId_key" ON "EmployeeAttendance"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAttendance_scheduleId_key" ON "EmployeeAttendance"("scheduleId");

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "EmployeeSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
