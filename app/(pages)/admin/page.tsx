"use client";

import axios from "axios";

export default function DashboardPage() {
  const fetchUser = async () => {
    const response = await axios.get("/api/user/1");
    console.log(response);
  };
  return (
    <main>
      <h1>Admin</h1>
      <button onClick={fetchUser}>Fetch</button>
    </main>
  );
}
