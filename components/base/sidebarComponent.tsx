"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  AddressBook,
  CalendarBlank,
  ChartBar,
  ChartBarHorizontal,
  FilmReel,
  InstagramLogo,
  MapTrifold,
  Users,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import SidebarTileComponent from "./sidebarTileComponent";
import { HouseSimple } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";

const SidebarComponent = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="flex flex-col gap-4 p-4">
      <SidebarTileComponent
        Icon={Users}
        title="Candidate"
        isActive={pathName == "/admin"}
        onClick={() => {
          router.push("/admin");
        }}
      />
      <SidebarTileComponent
        Icon={AddressBook}
        title="User"
        isActive={pathName == "/admin/user"}
        onClick={() => {
          router.push("/admin/user");
        }}
      />
      <SidebarTileComponent
        Icon={MapTrifold}
        title="Vote"
        isActive={pathName == "/admin/vote"}
        onClick={() => {
          router.push("/admin/vote");
        }}
      />
    </div>
  );
};
export default SidebarComponent;
