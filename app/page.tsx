"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [votes, setVotes] = useState();
  const [candidateGroup, setCandidateGroup] = useState();

  const fetchVotes = () => {};
  const fetchCandidateGroup = () => {};

  useEffect(() => {
    fetchVotes();
    fetchCandidateGroup();
  }, []);
  return <main>Home</main>;
}
