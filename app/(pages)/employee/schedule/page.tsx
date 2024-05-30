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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Schedule = {
  id: number;
  divisionId: number | null;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
};

export default function EmployeeSchedulePage() {
  const user = useMemo(() => fetchUserClient(), []);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const fetchSchedule = async () => {
    const date = DateTime.now().toFormat("yyyy-MM-dd");
    const response = await axiosInstance.get("/employee/schedule");
    setSchedule(response.data.data);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <main className="w-full h-full p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-bold">Schedule</h1>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Division ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start At</TableHead>
            <TableHead>End At</TableHead>
            {user?.role === "admin" && (
              <TableHead className="w-[150px]"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.id}</TableCell>
              <TableCell>{entry.divisionId}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>
                {DateTime.fromISO(entry.startAt).toLocaleString(
                  DateTime.DATETIME_MED_WITH_WEEKDAY,
                  { locale: "id" }
                )}
              </TableCell>
              <TableCell>
                {DateTime.fromISO(entry.endAt).toLocaleString(
                  DateTime.DATETIME_MED_WITH_WEEKDAY,
                  { locale: "id" }
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
