"use client";

import { Search } from "lucide-react";
import React from "react";
import ApplicantsCardsSection from "~/_components/employer/ApplicantsCardsSection";
import Container from "~/_components/global/Container";
import { useEmployerJobApplications } from "~/APIs/hooks/useEmployer";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";

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

  const filteredApplications = React.useMemo(() => {
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
        status === "all" || application.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, query, status]);

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
        {isLoading ? (
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
        ) : isError ? (
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
        ) : (
          <ApplicantsCardsSection applications={filteredApplications} />
        )}
      </section>
    </Container>
  );
}

export default JobPostingPage;