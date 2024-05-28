"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { AxiosError } from "axios";

type DataResponse = {
  message: string;
  data?: object;
  errors?: any[];
};

export default function Login() {
  const router = useRouter();

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(form.entries());
      await axiosInstance.post("/auth/login", data);
    } catch (err) {
      const errorResponse: DataResponse = (err as AxiosError).response
        ?.data as DataResponse;

      toast(errorResponse.message),
        {
          description: errorResponse.errors![0].message,
        };
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={($event) => formSubmit($event)}
        className="w-[500px]  rounded-xl border flex flex-col p-8 gap-8 items-center"
      >
        <header className="text-center">
          <h1 className="text-2xl">Welcome Back </h1>
          <p className="text-sm text-gray-400">
            please fill your email and password
          </p>
        </header>
        <main className="w-full flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            placeholder="example@gmail.com"
          />
          <Input
            type="password"
            name="password"
            placeholder="supersecret123"
          />
        </main>
        <Button
          className="w-full"
          type="submit"
        >
          Sign In
        </Button>
        <footer className="mt-6">
          <p className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer">
            Don't have an account yet? Register now
          </p>
        </footer>
      </form>
    </main>
  );
}
