"use client";

import { Download, Search } from "lucide-react";
import React from "react";
import AdminApplicantsTableSection from "~/_components/admin/AdminApplicantsTableSection";
import Container from "~/_components/global/Container";
import { useAdminApplications } from "~/APIs/hooks/useAdmin";
import { Skeleton } from "~/components/ui/skeleton";

function ApplicationsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminApplications();

  const filteredApplications = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        normalizedQuery === "" ||
        application.applicantDetails?.name
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        application.applicantDetails?.email
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        application.applicantDetails?.phone
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        application.job?.title?.toLowerCase().includes(normalizedQuery) ||
        application.company?.name?.toLowerCase().includes(normalizedQuery) ||
        application.applicant?.name?.toLowerCase().includes(normalizedQuery) ||
        application.applicant?.email?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        status === "all" ||
        application.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, query, status]);

  const handleExport = () => {
  if (!filteredApplications.length) return;

  const rows = filteredApplications.map((application) => ({
    applicant_name: application.applicantDetails?.name ?? "",
    applicant_email: application.applicantDetails?.email ?? "",
    applicant_phone: application.applicantDetails?.phone ?? "",
    job_title: application.job?.title ?? "",
    company_name: application.company?.name ?? "",
    experience_years: application.applicantDetails?.experience ?? 0,
    status: application.status ?? "",
    applied_date: application.appliedDate ?? "",
    resume: application.applicantDetails?.resume ?? "",
    cover_letter: application.applicantDetails?.coverLetter ?? "",
  }));

  const firstRow = rows[0];
  if (!firstRow) return;

  const headers = Object.keys(firstRow) as Array<keyof typeof firstRow>;

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header] ?? "");
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "admin-applications.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Manage all job applications across the platform
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

            <div className="flex items-center justify-end gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 min-w-[130px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>

              </select>

              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                onClick={handleExport}
                disabled={!filteredApplications.length}
              >
                <Download className="h-5 w-5" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 mb-10">
        {isLoading ? (
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-white">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[80px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[80px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[80px]" />
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-3 w-[100px]" />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[170px]" />
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[180px]" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[120px]" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-8 w-[90px] rounded-full" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[90px]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-4 w-[190px]" />

              <div className="flex items-center gap-2 self-end">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
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
          <AdminApplicantsTableSection applications={filteredApplications} />
        )}
      </section>
    </Container>
  );
}

export default ApplicationsPage;