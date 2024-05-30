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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FormLabel } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, {
  ReactElement,
  ChangeEventHandler,
  FormEvent,
  ChangeEvent,
} from "react";
import { Pencil } from "lucide-react";
import { Trash } from "@phosphor-icons/react";
import { Description } from "@radix-ui/react-dialog";

interface ModalProps {
  children: React.ReactNode;
  buttonText: string;
  data: any;
  formSubmitHandler: (e: any, data: any, setModalState: any) => void;
}

function formatDateTimeLocal(date: any) {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd'T'HH:mm");
}

const Modal: React.FC<ModalProps> = ({
  formSubmitHandler,
  data,
  children,
  buttonText,
}) => {
  const [formValue, setFormValue] = useState(data);
  const [modalState, setModalState] = useState(false);
  const handleInputChange: (
    event: string | React.ChangeEvent<HTMLInputElement>,
    name?: any
  ) => void = (e: string | ChangeEvent<HTMLInputElement>, name: any) => {
    if (typeof e == "string") {
      setFormValue({
        ...formValue,
        [name]: e,
      });
    } else {
      const { name, value } = e.target as HTMLInputElement;
      setFormValue({
        ...formValue,
        [name]: value,
      });
    }
  };

  return (
    <Dialog
      open={modalState}
      onOpenChange={setModalState}
    >
      <DialogTrigger className="bg-black text-white text-sm px-4 rounded-lg py-2">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {buttonText} Candidate </DialogTitle>
          <DialogDescription>
            <div className="mt-4">
              <form
                onSubmit={($event) =>
                  formSubmitHandler($event, formValue, setModalState)
                }
                className="flex flex-col gap-4"
              >
                <p className="font-bold">Name</p>
                <Input
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formValue.name}
                  onChange={handleInputChange}
                />
                <p className="font-bold">Description</p>
                <Input
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={formValue.description}
                  onChange={handleInputChange}
                />
                <p className="font-bold">Start At</p>

                <Input
                  name="startAt"
                  type="datetime-local"
                  value={formValue.startAt}
                  onChange={handleInputChange}
                />
                <p className="font-bold">End At</p>
                <Input
                  name="endAt"
                  type="datetime-local"
                  value={formValue.endAt}
                  onChange={handleInputChange}
                />
                <Button type="submit">{buttonText}</Button>
              </form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
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
  const [formValue, setFormValue] = useState({
    divisionId: null,
    name: "",
    Description: "",
    startAt: "",
    endAt: "",
  });
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const fetchSchedule = async () => {
    const date = DateTime.now().toFormat("yyyy-MM-dd");
    const response = await axiosInstance.get("/employee/schedule");
    setSchedule(response.data.data);
  };

  const formSubmitHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();
    await axiosInstance.post(`/employee/schedule`, data);
    setModalState(false);
    fetchSchedule();
  };

  const formUpdateHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();

    console.log(data);
    await axiosInstance.put(`/employee/schedule/${data.id}`, data);
    setModalState(false);
    fetchSchedule();
  };

  const onDeleteButtonClicked = async (id: any) => {
    await axiosInstance.delete(`/employee/schedule/${id}`);
    fetchSchedule();
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <main className="w-full h-full p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex justify-between items-center  w-full">
          <h1 className="font-bold">Schedule</h1>
          <Modal
            data={formValue}
            formSubmitHandler={formSubmitHandler}
            buttonText="Save"
          >
            + Add Data
          </Modal>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
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
              {user?.role === "admin" && (
                <TableCell className="w-[150px]">
                  <div className="flex justify-center gap-4">
                    <Modal
                      data={{
                        ...entry,
                        startAt: formatDateTimeLocal(entry.startAt),
                        endAt: formatDateTimeLocal(entry.endAt),
                      }}
                      formSubmitHandler={formUpdateHandler}
                      buttonText="Update"
                    >
                      <Pencil className="flex-shrink-0 size-3" />
                    </Modal>
                    <Button
                      className="aspect-square bg-red-500 hover:bg-red-400"
                      onClick={() => onDeleteButtonClicked(entry.id)}
                    >
                      <Trash className="flex-shrink-0 size-3" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
