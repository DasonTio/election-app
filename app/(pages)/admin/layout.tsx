"use client";

import { fetchUserClient } from "@/utils/fetchUserClient";
import { redirect } from "next/navigation";
import ContainerComponent from "@/components/base/containerComponent";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React, { useEffect } from "react";
import SidebarComponent from "@/components/base/sidebarComponent";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (fetchUserClient()?.role != "admin") {
      toast("Access Denied", {
        description: "Unauthorized for Admin Dashboard",
      });
      return redirect("/");
    }
    console.clear();
  });
  return (
    <ContainerComponent>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={14}>
          <SidebarComponent />
        </ResizablePanel>
        <ResizablePanel defaultSize={86}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </ContainerComponent>
  );
}
