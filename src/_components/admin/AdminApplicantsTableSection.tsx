"use client";

import * as React from "react";
import { Mail, Phone } from "lucide-react";

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

import type { AdminApplicationItem } from "~/APIs/features/admin";

interface AdminApplicantsTableSectionProps {
  applications: AdminApplicationItem[];
}

const PAGE_SIZE = 8;

function ExperiencePill({ years }: { years: number }) {
  return (
    <span className="inline-flex rounded-full bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700">
      {years} years
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
      {initials || "NA"}
    </div>
  );
}

export default function AdminApplicantsTableSection({
  applications,
}: AdminApplicantsTableSectionProps) {
  const [page, setPage] = React.useState(1);

  const totalApplications = applications.length;
  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  React.useEffect(() => {
    setPage(1);
  }, [applications]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedApplications = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return applications.slice(startIndex, endIndex);
  }, [applications, page]);

  const startCount = totalApplications === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(page * PAGE_SIZE, totalApplications);

  if (!applications.length) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No applications found.
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
                Applicant
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Contact
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Job Applied
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Company
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Experience
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-700">
                Applied Date
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedApplications.map((application) => (
              <TableRow key={application._id} className="border-gray-200">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={application.applicantDetails?.name ?? ""} />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {application.applicantDetails?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {application._id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="truncate">
                        {application.applicantDetails?.email || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{application.applicantDetails?.phone || "-"}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  <span className="block max-w-[220px] whitespace-normal leading-5">
                    {application.job?.title || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  <span className="block max-w-[180px] whitespace-normal leading-5">
                    {application.company?.name || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <ExperiencePill
                    years={application.applicantDetails?.experience ?? 0}
                  />
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  {new Date(application.appliedDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {startCount}-{endCount} of {totalApplications} applicants
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