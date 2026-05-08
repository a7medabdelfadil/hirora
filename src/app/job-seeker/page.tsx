"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FiClock } from "react-icons/fi";
import { HiOutlineTrendingUp } from "react-icons/hi";
import {
  HiArrowRight,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import Container from "~/_components/global/Container";
import JobCard from "~/_components/job-seeker/JobCard";
import { useAuthMe } from "~/APIs/hooks/useAuth";
import {
  useJobseekerApplicationsStats,
  useJobseekerJobs,
} from "~/APIs/hooks/useJobSeeker";

// AI endpoint to get matches
const AI_MATCH_ENDPOINT = "https://jobai.sell-io.app/match";
// Base URL to download CV
const BASE_URL = "https://hire-hub-backend-24125c11c709.herokuapp.com";

export default function JobSeekerPage() {
  // App state
  const { data: statsData } = useJobseekerApplicationsStats();
  const { data: user } = useAuthMe();
  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useJobseekerJobs();

  // Matching state
  const [cvText, setCvText] = useState<string>("");
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string>("");
  const [aiMatches, setAiMatches] = useState<
    { job: any; score: number; percentage: number }[]
  >([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string>("");

  // Step 1: Fetch, download and extract CV text if jobseeker and has a resume
  useEffect(() => {
    const extractTextFromPdf = async (file: File) => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += `\n ${pageText}`;
        }
        return fullText.trim();
      } catch (err) {
        throw new Error(
          "Failed to read the PDF. Make sure your CV is a real text-based PDF."
        );
      }
    };

    const fetchAndExtract = async () => {
      setCvError("");
      setCvText("");
      if (
        user &&
        user.role === "jobseeker" &&
        user.profile &&
        user.profile.resume
      ) {
        setCvLoading(true);
        try {
          const resumePath = user.profile.resume;
          const url = resumePath.startsWith("/")
            ? `${BASE_URL}${resumePath}`
            : resumePath;
          const response = await fetch(url);
          if (!response.ok) throw new Error("CV download failed");
          const blob = await response.blob();
          const file = new File(
            [blob],
            resumePath.split("/").pop() || "CV.pdf",
            {
              type: "application/pdf",
            }
          );
          const text = await extractTextFromPdf(file);
          setCvText(text);
        } catch (err: any) {
          setCvError(
            err instanceof Error ? err.message : "Couldn't load the CV file."
          );
        } finally {
          setCvLoading(false);
        }
      }
    };

    fetchAndExtract();
    // eslint-disable-next-line
  }, [user]);

  // Step 2: When (cvText, jobsData) are ready, call AI endpoint to rank jobs
  useEffect(() => {
    if (
      !cvText ||
      !jobsData ||
      jobsData.length === 0 ||
      cvLoading ||
      jobsLoading
    ) {
      setAiMatches([]);
      return;
    }

    const getMatches = async () => {
      setAiMatches([]);
      setAiError("");
      setAiLoading(true);

      try {
        // Prepare jobs data as job_descriptions for the AI endpoint
        const jobDescriptions = jobsData.map((job) => {
          return [
            job.title,
            job.description,
            ...(job.requirements || []),
            ...(job.responsibilities || []),
          ]
            .filter(Boolean)
            .join("\n");
        });

        // Send to AI endpoint
        const resp = await fetch(AI_MATCH_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cv_text: cvText,
            job_descriptions: jobDescriptions,
          }),
        });

        if (!resp.ok) {
          throw new Error("Couldn't get recommended jobs from AI");
        }

        const data = await resp.json();
        // data.scores = array of floats matching jobsData
        const scoresArr: number[] = Array.isArray(data.scores)
          ? data.scores
          : [];
        // Merge jobs & ranking, keep the index, and sort descending
        const ranked = jobsData.map((job, idx) => ({
          job,
          score: scoresArr[idx] ?? 0,
          percentage: Number(((scoresArr[idx] ?? 0) * 100).toFixed(2)),
        }));
        ranked.sort((a, b) => b.score - a.score);
        setAiMatches(ranked.slice(0, 6));
      } catch (err: any) {
        setAiMatches([]);
        setAiError(
          err instanceof Error
            ? err.message
            : "Something went wrong, couldn't match jobs."
        );
      } finally {
        setAiLoading(false);
      }
    };

    getMatches();
  }, [cvText, jobsData, cvLoading, jobsLoading]);

  const stats = [
    {
      title: "Jobs Applied",
      value: statsData?.total ?? 0,
      iconBg: "bg-blue-600",
      Icon: HiOutlineDocumentText,
    },
    {
      title: "In Review",
      value: statsData?.reviewing ?? 0,
      iconBg: "bg-amber-500",
      Icon: FiClock,
    },
    {
      title: "Shortlisted",
      value: statsData?.shortlisted ?? 0,
      iconBg: "bg-emerald-500",
      Icon: HiOutlineTrendingUp,
    },
    {
      title: "Accepted",
      value: statsData?.accepted ?? 0,
      iconBg: "bg-green-600",
      Icon: HiOutlineTrendingUp,
    },
    {
      title: "Rejected",
      value: statsData?.rejected ?? 0,
      iconBg: "bg-red-600",
      Icon: HiOutlineDocumentText,
    },
    {
      title: "Pending",
      value: statsData?.pending ?? 0,
      iconBg: "bg-yellow-500",
      Icon: FiClock,
    },
  ];

  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, {user?.name || "Job Seeker"}!
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Find your dream job today
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(({ title, iconBg, Icon, value }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-bgPrimary p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {value}
                    </p>
                    <p className="text-sm text-slate-500">{title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-sm">
            <h2 className="text-md font-medium opacity-95">
              Ready to find your next opportunity?
            </h2>

            <p className="text-md mt-4 opacity-90">
              Browse thousands of job openings from top companies
            </p>

            <Link
              href="/job-seeker/find-jobs"
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Search Jobs <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
     <section className="w-full">
 <div className="mx-auto px-4 py-6">
  {/* Header */}
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-900">
      Recommended Jobs
    </h2>

    <Link
      href="/job-seeker/find-jobs"
      className="text-sm font-semibold text-purple-700 transition hover:text-purple-900 hover:underline"
    >
      View All
    </Link>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Loading / Errors */}
    {cvLoading || jobsLoading || aiLoading ? (
      <div className="col-span-3 rounded-2xl border border-slate-200 bg-white py-10 text-center text-slate-400 shadow-sm">
        Matching to your CV...
      </div>
    ) : cvError ? (
      <div className="col-span-3 rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-red-500">
        {cvError}
      </div>
    ) : aiError ? (
      <div className="col-span-3 rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-red-500">
        {aiError}
      </div>
    ) : aiMatches.length === 0 ? (
      <div className="col-span-3 rounded-2xl border border-slate-200 bg-white py-10 text-center text-slate-500 shadow-sm">
        No recommended jobs yet.
      </div>
    ) : (
      aiMatches.map((item, idx) => (
        <div
          key={item.job._id}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Top badges row */}
          <div className="mb-3 flex items-center justify-between">
            {/* Best Match */}
            {idx === 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                ⭐ Best Match
              </span>
            ) : (
              <div />
            )}

            {/* Match Percentage */}
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {item.percentage}% Match
            </span>
          </div>

          {/* Job Card */}
          <JobCard
            job={{
              id: item.job._id,
              title: item.job.title,
              company:
                item.job.company?.name ?? "Unknown Company",
              location: item.job.location,
              salary:
                item.job.salaryMin &&
                item.job.salaryMax
                  ? `$${item.job.salaryMin.toLocaleString()} - $${item.job.salaryMax.toLocaleString()}`
                  : "Not specified",
              typeTag: item.job.type,
              categoryTag: item.job.category,
              logoUrl: "/images/job-profile.png",
            }}
          />
        </div>
      ))
    )}
  </div>
</div>
</section>
    </Container>
  );
}