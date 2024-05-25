"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const formSubmit = async () => {
    const response = await axiosInstance.post("/api/auth/login", {
      email: "d4sontiovino@gmail.com",
      password: "password123",
    });
    console.log(response);
    router.push("/admin");
  };

  return (
    <main>
      <h1>Login</h1>
      <button onClick={formSubmit}>Login Button</button>
    </main>
  );
}
