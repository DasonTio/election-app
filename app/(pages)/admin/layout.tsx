import { fetchUser } from "@/utils/fetchUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await fetchUser())) {
    return redirect("/login");
  }
  return children;
}
