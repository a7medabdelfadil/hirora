"use client";

import dynamic from "next/dynamic";

const CvExtractor = dynamic(() => import("../../_components/CvExtractor"), {
  ssr: false,
});

export default function Page() {
  return <CvExtractor />;
}