"use client";

import axiosInstance from "@/utils/axiosInstance";
import { fetchUserClient } from "@/utils/fetchUserClient";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, {
  ReactElement,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import { Pencil } from "@phosphor-icons/react";
import { Trash } from "lucide-react";
import { headers } from "next/headers";
import { DateTime } from "luxon";

interface ModalProps {
  children: React.ReactNode;
  buttonText: string;
  data: any;
  formSubmitHandler: (e: any, data: any, setModalState: any) => void;
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
                <Input
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formValue.name}
                  onChange={handleInputChange}
                />
                <Input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={formValue.address}
                  onChange={handleInputChange}
                />
                <Input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  value={formValue.phoneNumber}
                  onChange={handleInputChange}
                />
                <Select
                  name="role"
                  value={formValue.role}
                  onValueChange={(val) => handleInputChange(val, "role")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">{buttonText}</Button>
              </form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default function UserDashboardPage() {
  const [user, setUser] = useState([]);
  const [formValue, setFormValue] = useState({
    id: "",
    name: "",
    email: "",
  });

  const fetchUser = async () => {
    const response = await axiosInstance.get("/user");
    setUser(response.data.data);
  };

  const formSubmitHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();
    await axiosInstance.post(`/user`, data);
    setModalState(false);
    fetchUser();
  };

  const formUpdateHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();

    console.log(data);
    await axiosInstance.put(`/user/${data.id}`, data);
    setModalState(false);
    fetchUser();
  };

  const onDeleteButtonClicked = async (id: any) => {
    await axiosInstance.delete(`/user/${id}`);
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main className="w-full h-full p-8 overflow-auto flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-bold">User</h1>
          <div>
            {/* <CandidateForm
              handleInputChange={handleInputChange}
              formValue={formValue}
              formSubmitHandler={formSubmitHandler}
              buttonText="Save"
            >
              + Add Data
            </CandidateForm> */}
          </div>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>BirthDate</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>SubDistrict</TableHead>
              <TableHead>Regency</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.address}</TableCell>
                <TableCell>{u.phoneNumber}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.birthDate}</TableCell>
                <TableCell>{u.ward}</TableCell>
                <TableCell>{u.subDistrict}</TableCell>
                <TableCell>{u.regency}</TableCell>
                <TableCell>{u.city}</TableCell>
                <TableCell>{u.province}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-4">
                    <Modal
                      data={u}
                      formSubmitHandler={formUpdateHandler}
                      buttonText="Update"
                    >
                      <Pencil className="flex-shrink-0 size-3" />
                    </Modal>
                    <Button
                      className="aspect-square bg-red-500 hover:bg-red-400"
                      onClick={() => onDeleteButtonClicked(u.id)}
                    >
                      <Trash className="flex-shrink-0 size-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
