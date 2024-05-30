"use client";

import { fetchUserClient } from "@/utils/fetchUserClient";
import { redirect } from "next/navigation";
import ContainerComponent from "@/components/base/containerComponent";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React from "react";
import EmployeeSidebarComponent from "@/components/base/employeeSidebarComponent";
import { toast } from "sonner";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (
      fetchUserClient()?.role != "employee" &&
      fetchUserClient()?.role != "admin"
    ) {
      toast("Access Denied", {
        description: "Unauthorized for Employee Dashboard",
      });
      return redirect("/");
    }
  }, []);

  return (
    <ContainerComponent>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={14}>
          <EmployeeSidebarComponent />
        </ResizablePanel>
        <ResizablePanel defaultSize={84}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </ContainerComponent>
  );
}
