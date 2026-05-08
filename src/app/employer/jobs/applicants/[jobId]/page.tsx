"use client";

import { Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ApplicantsCardsSection from "~/_components/employer/ApplicantsCardsSection";
import Container from "~/_components/global/Container";
import { useEmployerJobApplications, useEmployerJobs } from "~/APIs/hooks/useEmployer";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";

const BASE_URL = "https://hire-hub-backend-24125c11c709.herokuapp.com";
const AI_RANK_CVS_ENDPOINT = "https://jobai.sell-io.app/rank-cvs";

function JobPostingPage() {
  const params = useParams();

  const jobId = React.useMemo(() => {
    const value = params?.jobId;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0] ?? "";
    return "";
  }, [params]);

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployerJobApplications(jobId);

  // Get all jobs (for fetching job details)
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
  } = useEmployerJobs();

  // Now extract the matching job data
  const jobData = React.useMemo(
    () => jobs.find((job) => job._id === jobId),
    [jobs, jobId]
  );

  // --- Ranking logic state ---
  const [rankedApplications, setRankedApplications] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // فلترة التطبيقات بناء على البحث/الفلاتر (تبقى كما هي)
  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const applicantName = application.applicantDetails.name.toLowerCase();
      const applicantEmail = application.applicantDetails.email.toLowerCase();
      const applicantPhone = application.applicantDetails.phone.toLowerCase();
      const accountName = application.applicant.name.toLowerCase();
      const accountEmail = application.applicant.email.toLowerCase();

      const matchesSearch =
        normalizedQuery === "" ||
        applicantName.includes(normalizedQuery) ||
        applicantEmail.includes(normalizedQuery) ||
        applicantPhone.includes(normalizedQuery) ||
        accountName.includes(normalizedQuery) ||
        accountEmail.includes(normalizedQuery);

      const matchesStatus =
        status === "all" ||
        application.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, query, status]);

  // سيستم استخراج النصوص من PDF (لو باقي)
  const extractTextFromPdf = async (file: File): Promise<string> => {
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
        fullText += `\n${pageText}`;
      }
      return fullText.trim();
    } catch {
      return "";
    }
  };

  // إجراء التصنيف وإعطاء score لكل متقدم
  useEffect(() => {
    // الشروط: لازم بيانات الوظيفة والتطبيقات يكونوا اتحملوا، وكذلك مفيش loading/errors
    if (
      !jobId ||
      isLoading ||
      isLoadingJobs ||
      isError ||
      isErrorJobs ||
      !jobData ||
      applications.length === 0
    ) {
      setRankedApplications([]);
      setAiLoading(false);
      setAiError("");
      return;
    }

    const rankApplicants = async () => {
      setAiError("");
      setAiLoading(true);
      setRankedApplications([]);
      try {
        // تجهيز وصف الوظيفة
        const jobDescription = [
          jobData.title ?? "",
          jobData.description ?? "",
          ...(jobData.requirements ?? []),
          ...(jobData.responsibilities ?? []),
        ]
          .filter(Boolean)
          .join("\n");

        // استخراج النصوص من الـ CVs (PDF to text)
        const cvList: string[] = [];
        for (const app of applications) {
          const resumePath = app.applicantDetails?.resume;
          let text = "";
          if (resumePath && typeof resumePath === "string" && resumePath.endsWith(".pdf")) {
            try {
              const url = resumePath.startsWith("/")
                ? `${BASE_URL}${resumePath}`
                : resumePath;
              const resp = await fetch(url);
              if (!resp.ok) throw new Error();
              const blob = await resp.blob();
              const file = new File(
                [blob],
                resumePath.split("/").pop() || "CV.pdf",
                { type: "application/pdf" }
              );
              text = await extractTextFromPdf(file);
            } catch {
              text = ""; // Fallback
            }
          }
          cvList.push(text);
        }

        if (cvList.length === 0 || cvList.every((txt) => !txt.trim()))
          throw new Error("Could not extract text from any applicant CV.");

        // Send to AI endpoint
        const resp = await fetch(AI_RANK_CVS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_description: jobDescription,
            cv_list: cvList,
          }),
        });
        if (!resp.ok) throw new Error("AI ranking failed.");
        const data = await resp.json();
        const scoresArr: number[] = Array.isArray(data.scores)
          ? data.scores
          : [];
        // دمج النتائج مع التطبيق الأصلي
        const ranked = applications.map((app, idx) => ({
          ...app,
          ai_score: scoresArr[idx] ?? 0,
          ai_percentage: Number(((scoresArr[idx] ?? 0) * 100).toFixed(2)),
        }));
        // ترتيبهم تنازلياً حسب السكور
        ranked.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
        setRankedApplications(ranked);
      } catch (e: any) {
        setAiError(e.message || "Error ranking CVs.");
      } finally {
        setAiLoading(false);
      }
    };

    rankApplicants();
    // eslint-disable-next-line
  }, [jobId, jobData, applications, isLoading, isLoadingJobs, isError, isErrorJobs]);

  // المتغير الذي سنمرره ليعرض الترتيب الصحيح:
  const appsToDisplay = rankedApplications.length ? rankedApplications : filteredApplications;

  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Review and process job applications
        </p>

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search applicants..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:min-w-[140px] md:w-auto"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 mb-10">
        {isLoading || isLoadingJobs || aiLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[140px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-[90px] rounded-full" />
                </div>
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-4 w-[70px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
                <div className="mt-6">
                  <Skeleton className="h-4 w-[50px]" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Skeleton className="h-9 w-[80px] rounded-md" />
                    <Skeleton className="h-9 w-[80px] rounded-md" />
                    <Skeleton className="h-9 w-[80px] rounded-md" />
                  </div>
                </div>
                <div className="my-6 h-px w-full bg-gray-200/70" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 flex-1 rounded-xl" />
                  <Skeleton className="h-11 w-12 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : isError || isErrorJobs ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-red-700">
              Failed to load applications.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : aiError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm text-center text-red-700">
            {aiError}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
  {appsToDisplay.map((application, idx) => (
    <div
      key={application._id}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Top Row */}
      <div className="mb-4 flex items-center justify-between">
        {/* Best Match */}
        {idx === 0 &&
        typeof application.ai_percentage === "number" ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            ⭐ Best Match
          </span>
        ) : (
          <div />
        )}

        {/* Match Percentage */}
        {typeof application.ai_percentage === "number" && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {application.ai_percentage}% Match
          </span>
        )}
      </div>

      {/* Applicant Card */}
      <ApplicantsCardsSection applications={[application]} />
    </div>
  ))}

  {/* Empty State */}
  {appsToDisplay.length === 0 && (
    <div className="col-span-3 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
      No applicants found.
    </div>
  )}
</div>
        )}
      </section>
    </Container>
  );
}

export default JobPostingPage;