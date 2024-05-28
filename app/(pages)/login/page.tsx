"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
// import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axiosInstance.post("/api/auth/login", {
      email: "d4sontiovino@gmail.com",
      password: "password123",
    });
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={($event) => formSubmit($event)}
        className="w-[500px] h-[500px] rounded-xl border flex flex-col p-8"
      >
        <h1 className="text-2xl">Welcome back</h1>
        <button type="submit">Login Button</button>
      </form>
    </main>
  );
}
