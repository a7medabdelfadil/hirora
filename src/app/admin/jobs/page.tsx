"use client";

import { Search } from "lucide-react";
import React from "react";
import AdminJobsTableSection from "~/_components/admin/AdminJobsTableSection";
import Container from "~/_components/global/Container";
import { useAdminJobs } from "~/APIs/hooks/useAdmin";
import { Skeleton } from "~/components/ui/skeleton";

function JobsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState("all");

  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminJobs();

  const filteredJobs = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        normalizedQuery === "" ||
        job.title?.toLowerCase().includes(normalizedQuery) ||
        job.category?.toLowerCase().includes(normalizedQuery) ||
        job.location?.toLowerCase().includes(normalizedQuery) ||
        job.company?.name?.toLowerCase().includes(normalizedQuery) ||
        job.postedBy?.name?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        status === "all" || job.status?.toLowerCase() === status.toLowerCase();

      const normalizedType = job.type?.toLowerCase();
      const matchesType =
        type === "all" ||
        (type === "full" && normalizedType === "full-time") ||
        (type === "part" && normalizedType === "part-time") ||
        (type === "contract" && normalizedType === "contract") ||
        (type === "intern" && normalizedType === "internship");

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jobs, query, status, type]);

  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Manage all job postings across the platform
        </p>

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-11 min-w-[130px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Types</option>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Internship</option>
              </select>
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
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[40px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[55px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[55px]" />
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
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[180px]" />
                              <Skeleton className="h-3 w-[90px]" />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[120px]" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-8 w-[90px] rounded-full" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-8 w-[44px] rounded-full" />
                        </td>

                        <td className="px-6 py-5">
                          <Skeleton className="h-8 w-[80px] rounded-full" />
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
              <Skeleton className="h-4 w-[160px]" />

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
              Failed to load jobs.
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
          <AdminJobsTableSection jobs={filteredJobs} />
        )}
      </section>
    </Container>
  );
}

export default JobsPage;