"use client";

import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { Key, useEffect, useState } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import HeadbarComponent from "@/components/base/headbarComponent";
import ContainerComponent from "@/components/base/containerComponent";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AuthUser, fetchUserClient } from "@/utils/fetchUserClient";
import { toast } from "sonner";

export default function Home() {
  const [votes, setVotes] = useState<any[]>([]);
  const [candidateGroup, setCandidateGroup] = useState<any>({});
  const [authUser, setAuthUser] = useState<AuthUser | null>();

  const onVoteButtonClicked = async (c: any) => {
    try {
      const response = await axiosInstance.post(`/vote/${c.id}`);
      toast(response.data.message, {
        description: "Thank you for your vote",
      });

      fetchVotes();
      fetchCandidateGroup();
    } catch (e) {
      toast("Error Occured", {
        description: "Please check your authentication",
      });
    }
  };

  const fetchVotes = async () => {
    try {
      const response = await axiosInstance.get("/vote");
      setVotes(response.data.data);
    } catch (error) {}
  };

  const fetchCandidateGroup = async () => {
    try {
      const response = await axiosInstance.get("/candidate/group");
      setCandidateGroup(
        response.data.data.find((c: { status: string }) => c.status == "active")
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchVotes();
    fetchCandidateGroup();
    setAuthUser(fetchUserClient());
  }, []);

  if (candidateGroup == null || candidateGroup?.candidate?.length == 0) {
    return (
      <ContainerComponent>
        <main className="h-full grid place-items-center text-gray-400">
          <h1>No Candidate or Group Available Yet.</h1>
        </main>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent>
      <main className="h-full overflow-auto sm:overflow-hidden">
        <section className="flex flex-col sm:flex-row h-full">
          {candidateGroup.candidate?.map(
            (c: any, i: Key | null | undefined) => (
              <div
                key={i}
                className="flex-1"
              >
                <AlertDialog>
                  <AlertDialogTrigger className="w-full h-[92vh] relative">
                    <div className="group">
                      <div className="absolute bg-black group-hover:opacity-50 z-10 opacity-70 w-full h-full rounded-none"></div>
                      <section className="absolute z-20 text-white flex flex-col items-center justify-center w-full h-full gap-16">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <p className="text-6xl font-bold">
                            {votes.find((v) => v.candidateId == c.id)?.total ??
                              0}
                          </p>
                          <div className="text-center">
                            <p className="text-2xl">{c.chiefName}</p>
                            <p className="text-white opacity-60">
                              {c.deputyName}
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL}${c.chiefImageUrl}`}
                      className="h-[60vh] w-full object-cover"
                    />
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL}${c.deputyImageUrl}`}
                      className="h-[32vh] w-full object-cover"
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Read the vision and mission
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex flex-col gap-4">
                        <p>
                          This vote action cannot be undone. This will
                          permanently stored for your account and cannot be
                          removed from our servers.
                        </p>
                        <div>
                          <p className="font-bold text-[1.1em] text-gray-400">
                            Vision
                          </p>
                          <p className="text-sm">{c.vision}</p>
                        </div>
                        <div>
                          <p className="font-bold text-[1.1em] text-gray-400">
                            Mission
                          </p>
                          <p className="text-sm">{c.mission}</p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onVoteButtonClicked(c)}
                        disabled={authUser == null}
                      >
                        Vote
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )
          )}
        </section>
      </main>
    </ContainerComponent>
  );
}
