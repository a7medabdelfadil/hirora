"use client";

import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex mt-4 mb-6 items-center gap-2 text-md font-medium text-[#9810FA] transition hover:text-purple-800"
    >
      <HiArrowLeft className="h-4 w-4" />
      Back to search
    </button>
  );
}
