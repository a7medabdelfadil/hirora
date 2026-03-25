"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Briefcase } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

import type { AdminJobItem } from "~/APIs/features/admin";

interface AdminJobsTableSectionProps {
  jobs: AdminJobItem[];
}

const PAGE_SIZE = 8;

function TypePill({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-full bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700">
      {type}
    </span>
  );
}

function ApplicantsPill({ n }: { n: number }) {
  return (
    <span className="inline-flex min-w-[36px] justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700">
      {n}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();

  const cls =
    normalizedStatus === "active"
      ? "bg-green-100 text-green-700"
      : normalizedStatus === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : normalizedStatus === "blocked"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}

export default function AdminJobsTableSection({
  jobs,
}: AdminJobsTableSectionProps) {
  const [page, setPage] = React.useState(1);

  const totalJobs = jobs.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));

  React.useEffect(() => {
    setPage(1);
  }, [jobs]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedJobs = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return jobs.slice(startIndex, endIndex);
  }, [jobs, page]);

  const startCount = totalJobs === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(page * PAGE_SIZE, totalJobs);

  if (!jobs.length) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No jobs found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Job Title
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Company
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Location
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Applicants
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Posted
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow key={job._id} className="border-gray-200">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Briefcase className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.category}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src="/images/job-profile.png"
                        alt={job.company?.name || "Company"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-800">
                      {job.company?.name || "-"}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {job.location}
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <TypePill type={job.type} />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <ApplicantsPill n={job.applicantsCount ?? 0} />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <StatusPill status={job.status} />
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {new Date(job.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {startCount}-{endCount} of {totalJobs} jobs
        </p>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(totalPages, prev + 1));
                }}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}