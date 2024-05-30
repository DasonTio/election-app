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

interface CandidateFormProps {
  children: React.ReactNode;
  formValue: any;
  buttonText: string;
  handleInputChange: (
    event: string | React.ChangeEvent<HTMLInputElement>,
    name?: any
  ) => void;
  formSubmitHandler: (e: any, data: any, setModalState: any) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  formSubmitHandler,
  formValue,
  handleInputChange,
  children,
  buttonText,
}) => {
  const [modalState, setModalState] = useState(false);
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
                  name="candidateGroupId"
                  type="text"
                  placeholder="Candidate Group ID"
                  value={formValue.candidateGroupId}
                  onChange={handleInputChange}
                />
                <Input
                  name="chiefName"
                  type="text"
                  placeholder="Chief Name"
                  value={formValue.chiefName}
                  onChange={handleInputChange}
                />
                <Input
                  name="deputyName"
                  type="text"
                  placeholder="Deputy Name"
                  value={formValue.deputyName}
                  onChange={handleInputChange}
                />
                <Input
                  name="vision"
                  type="text"
                  placeholder="Vision"
                  value={formValue.vision}
                  onChange={handleInputChange}
                />
                <Input
                  name="mission"
                  type="text"
                  placeholder="Mission"
                  value={formValue.mission}
                  onChange={handleInputChange}
                />
                <Input
                  name="chiefImage"
                  type="file"
                  onChange={handleInputChange}
                />
                <Input
                  name="deputyImage"
                  type="file"
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

const CandidateRow = ({
  group,
  candidate,
  onDeleteButtonClicked,
  formUpdateHandler,
}: {
  [key: string]: any;
}) => {
  const [formValue, setFormValue] = useState({
    id: candidate.id,
    candidateGroupId: candidate.candidateGroupId,
    chiefName: candidate.chiefName,
    deputyName: candidate.deputyName,
    vision: candidate.vision,
    mission: candidate.mission,
    chiefImage: candidate.chiefImage,
    deputyImage: candidate.deputyImage,
  });

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormValue({
      ...formValue,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <TableRow key={candidate.id}>
      <TableCell className="font-medium">{candidate.id}</TableCell>
      <TableCell>{group.id}</TableCell>
      <TableCell>{candidate.chiefName}</TableCell>
      <TableCell>{candidate.deputyName}</TableCell>
      <TableCell>{candidate.vision}</TableCell>
      <TableCell>{candidate.mission}</TableCell>
      <TableCell>
        <img
          src={`${process.env.NEXT_PUBLIC_URL}${candidate.chiefImageUrl}`}
          alt=""
          className="w-[20vw] object-cover"
        />
      </TableCell>
      <TableCell>
        <img
          src={`${process.env.NEXT_PUBLIC_URL}${candidate.deputyImageUrl}`}
          alt=""
        />
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-4">
          <CandidateForm
            formValue={formValue}
            formSubmitHandler={formUpdateHandler}
            handleInputChange={handleInputChange}
            buttonText="Update"
          >
            <Pencil className="flex-shrink-0 size-3" />
          </CandidateForm>
          <Button
            className="aspect-square bg-red-500 hover:bg-red-400"
            onClick={() => onDeleteButtonClicked(candidate.id)}
          >
            <Trash className="flex-shrink-0 size-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const CandidateGroupForm: React.FC<CandidateFormProps> = ({
  formSubmitHandler,
  formValue,
  handleInputChange,
  children,
  buttonText,
}) => {
  const [modalState, setModalState] = useState(false);
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
          <DialogTitle>{buttonText} Candidate Group</DialogTitle>
          <DialogDescription>
            <div className="mt-4">
              <form
                onSubmit={($event) =>
                  formSubmitHandler($event, formValue, setModalState)
                }
                className="flex flex-col gap-4"
              >
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
                <p className="font-bold">End At</p>
                <Select
                  name="status"
                  value={formValue.status}
                  onValueChange={(val) => handleInputChange(val, "status")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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

const CandidateGroupRow = ({
  group,
  onDeleteButtonClicked,
  formUpdateHandler,
}: {
  [key: string]: any;
}) => {
  const [formValue, setFormValue] = useState({
    ...group,
    startAt: DateTime.fromISO(group.startAt).toFormat("yyyy-MM-dd"),
    endAt: DateTime.fromISO(group.endAt).toFormat("yyyy-MM-dd"),
  });

  const handleInputChange = (
    e: string | ChangeEvent<HTMLInputElement>,
    name: any
  ) => {
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
    <TableRow key={group.id}>
      <TableCell>{group.id}</TableCell>
      <TableCell>{group.startAt}</TableCell>
      <TableCell>{group.endAt}</TableCell>
      <TableCell>{group.status}</TableCell>
      <TableCell>
        <div className="flex justify-center gap-4">
          <CandidateGroupForm
            formValue={formValue}
            formSubmitHandler={formUpdateHandler}
            handleInputChange={handleInputChange}
            buttonText="Update"
          >
            <Pencil className="flex-shrink-0 size-3" />
          </CandidateGroupForm>
          <Button
            className="aspect-square bg-red-500 hover:bg-red-400"
            onClick={() => onDeleteButtonClicked(group.id)}
          >
            <Trash className="flex-shrink-0 size-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function AdminDashboardPage() {
  const [candidateGroup, setCandidateGroup] = useState([]);
  const [formValue, setFormValue] = useState({
    chiefName: "",
    deputyName: "",
    vision: "",
    mission: "",
    chiefImage: "",
    deputyImage: "",
  });

  const [formGroupValue, setFormGroupValue] = useState({
    startAt: "",
    endAt: "",
    status: "",
  });

  const handleGroupInputChange = (
    e: string | ChangeEvent<HTMLInputElement>,
    name: any
  ) => {
    if (typeof e == "string") {
      setFormGroupValue({
        ...formGroupValue,
        [name]: e,
      });
    } else {
      const { name, value } = e.target as HTMLInputElement;
      setFormGroupValue({
        ...formGroupValue,
        [name]: value,
      });
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormValue({
      ...formValue,
      [name]: files ? files[0] : value,
    });
  };

  const fetchCandidateGroup = async () => {
    const response = await axiosInstance.get("/candidate/group");
    setCandidateGroup(response.data.data);
  };

  const formSubmitGroupHandler = async (
    e: any,
    data: any,
    setModalState: any
  ) => {
    e.preventDefault();
    await axiosInstance.post(`/candidate/group`, data);
    setModalState(false);
    fetchCandidateGroup();
  };

  const formUpdateGroupHandler = async (
    e: any,
    data: any,
    setModalState: any
  ) => {
    e.preventDefault();
    await axiosInstance.put(`/candidate/group/${data.id}`, data);
    setModalState(false);
    fetchCandidateGroup();
  };

  const onDeleteGroupButtonClicked = async (id: any) => {
    await axiosInstance.delete(`/candidate/group/${id}`);
    fetchCandidateGroup();
  };

  const formSubmitHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();
    await axiosInstance.post(`/candidate`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setModalState(false);
    fetchCandidateGroup();
  };

  const formUpdateHandler = async (e: any, data: any, setModalState: any) => {
    e.preventDefault();

    console.log(data);
    await axiosInstance.put(`/candidate/${data.id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setModalState(false);
    fetchCandidateGroup();
  };

  const onDeleteButtonClicked = async (id: any) => {
    await axiosInstance.delete(`/candidate/${id}`);
    fetchCandidateGroup();
  };

  useEffect(() => {
    fetchCandidateGroup();
  }, []);

  return (
    <main className="w-full h-full p-8 overflow-auto flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-bold">Candidate Group</h1>
          <div>
            <CandidateGroupForm
              handleInputChange={handleGroupInputChange}
              formValue={formGroupValue}
              formSubmitHandler={formSubmitGroupHandler}
              buttonText="Save"
            >
              + Add Data
            </CandidateGroupForm>
          </div>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Group ID</TableHead>
              <TableHead>Start At</TableHead>
              <TableHead>End At</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidateGroup?.map((group: any) => (
              <CandidateGroupRow
                key={group.id}
                group={group}
                onDeleteButtonClicked={onDeleteGroupButtonClicked}
                formUpdateHandler={formUpdateGroupHandler}
              />
            ))}
          </TableBody>{" "}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-bold">Candidate</h1>
          <div>
            <CandidateForm
              handleInputChange={handleInputChange}
              formValue={formValue}
              formSubmitHandler={formSubmitHandler}
              buttonText="Save"
            >
              + Add Data
            </CandidateForm>
          </div>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Group ID</TableHead>
              <TableHead>Chief Name</TableHead>
              <TableHead>Deputy Name</TableHead>
              <TableHead>Vision</TableHead>
              <TableHead>Mission</TableHead>
              <TableHead>Chief Image</TableHead>
              <TableHead>Deputy Image</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidateGroup?.map((group: any) =>
              group.candidate.map((candidate: any, i: any) => (
                <CandidateRow
                  key={candidate.id}
                  group={group}
                  candidate={candidate}
                  onDeleteButtonClicked={onDeleteButtonClicked}
                  formUpdateHandler={formUpdateHandler}
                />
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
