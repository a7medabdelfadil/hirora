"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "~/_components/global/Spinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signin"); 
  }, [router]);

  return <Spinner />; 
}
