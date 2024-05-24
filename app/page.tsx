"use client";

import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const formSubmit = async () => {
    try {
      const response = await axios.get("/api/auth/login");
      console.log(response);
    } catch (error) {
      console.error("Login Error");
    }
  };
  useEffect(() => {
    formSubmit();
  }, []);
  // formSubmit();
  return <main>Test</main>;
}
