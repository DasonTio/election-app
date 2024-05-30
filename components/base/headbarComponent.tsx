import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  User,
  SignOut,
  SignIn,
  AppWindow,
  AddressBook,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { AuthUser, fetchUserClient } from "@/utils/fetchUserClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { cn } from "@/lib/utils";

const HeadbarButtonComponent = ({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
}) => {
  return (
    <Button
      onClick={onClick}
      className="grid grid-cols-[1fr_3fr] items-center bg-white hover:bg-gray-200 text-black border px-8 gap-4 w-full"
    >
      {icon}
      <p>{label}</p>
    </Button>
  );
};

const HeadbarComponent = () => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>();
  useEffect(() => {
    setAuthUser(fetchUserClient());
  }, []);

  return (
    <div className="flex h-full px-16 items-center justify-between border-b">
      <div className="flex gap-8 items-center">
        <p
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          Election
        </p>

        <p
          onClick={() => router.push("/place")}
          className="cursor-pointer text-sm text-gray-400 hover:text-black"
        >
          Vote Place
        </p>
      </div>
      <div className="relative">
        <Popover>
          <PopoverTrigger className="rounded-full aspect-square border p-2">
            <User />
          </PopoverTrigger>
          <PopoverContent
            className="absolute -left-[10rem] p-0 w-[200px]"
            side="bottom"
            sideOffset={10}
          >
            <span
              className={cn({
                hidden: authUser?.role != "admin",
              })}
            >
              <HeadbarButtonComponent
                onClick={() => router.push("/admin")}
                label="Admin"
                icon={<AppWindow />}
              />
            </span>
            <span
              className={cn({
                hidden: authUser?.role == "user" || authUser == null,
              })}
            >
              <HeadbarButtonComponent
                onClick={() => router.push("/employee")}
                label="Employee"
                icon={<AddressBook />}
              />
            </span>
            <span
              className={cn({
                hidden: authUser != null,
              })}
            >
              <HeadbarButtonComponent
                onClick={() => router.push("/login")}
                label="Sign In"
                icon={<SignIn />}
              />
            </span>
            <span
              className={cn({
                hidden: authUser == null,
              })}
            >
              <HeadbarButtonComponent
                onClick={() => {
                  axiosInstance.post("/auth/logout");
                  router.push("/login");
                }}
                label="Sign Out"
                icon={<SignOut />}
              />
            </span>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default HeadbarComponent;
