"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchUserClient } from "@/utils/fetchUserClient";
import { useMemo } from "react";
import { DateTime } from "luxon";

type Attendance = {
  inTime: string;
  outTime: string;
};

export default function EmployeePage() {
  const user = useMemo(() => fetchUserClient(), []);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const fetchAttendance = async () => {
    const date = DateTime.now().toFormat("yyyy-MM-dd");
    const response = await axiosInstance.get(
      `/employee/attendance/date?date=${date}`
    );
    setAttendance(response.data.data);
  };
  const today = useMemo(() => new Date(), []);

  const submitAttendance = async () => {
    await axiosInstance.post("/employee/attendance");
    await fetchAttendance();
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <main className="w-full h-full p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-bold">Attendance Today</h1>
          <p>
            {DateTime.now().toLocaleString(DateTime.DATE_FULL, {
              locale: "id-ID",
            })}
          </p>
        </div>
        {user?.role === "employee" && !attendance?.outTime && (
          <Button onClick={submitAttendance}>
            Check {attendance?.inTime ? "Out" : "In"}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Check In</CardTitle>
            <CardDescription>
              {attendance?.inTime
                ? DateTime.fromISO(attendance.inTime).toLocaleString(
                    DateTime.TIME_24_SIMPLE,
                    {
                      locale: "id-ID",
                    }
                  )
                : "Not Checked In Yet"}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Check Out</CardTitle>
            <CardDescription>
              {attendance?.outTime
                ? DateTime.fromISO(attendance.outTime).toLocaleString(
                    DateTime.TIME_24_SIMPLE,
                    {
                      locale: "id-ID",
                    }
                  )
                : "Not Checked In Yet"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
