"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  AddressBook,
  ChartBar,
  ChartBarHorizontal,
  FilmReel,
  InstagramLogo,
  Users,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import SidebarTileComponent from "./sidebarTileComponent";
import { HouseSimple } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";

const EmployeeSidebarComponent = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <ResizablePanel
      defaultSize={14}
      minSize={14}
      className=" h-full border-r"
    >
      <div className="flex flex-col gap-4 p-4">
        <SidebarTileComponent
          Icon={Users}
          title="Attendance"
          isActive={pathName == "/employee"}
          onClick={() => {
            router.push("/employee");
          }}
        />
        <SidebarTileComponent
          Icon={AddressBook}
          title="Schedule"
          isActive={pathName == "/employee/schedule"}
          onClick={() => {
            router.push("/employee/schedule");
          }}
        />
      </div>
    </ResizablePanel>
  );
};
export default EmployeeSidebarComponent;
