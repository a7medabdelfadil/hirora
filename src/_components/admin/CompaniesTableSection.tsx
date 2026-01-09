"use client";

import * as React from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

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

type CompanyStatus = "active" | "inactive";

type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  jobsPosted: number;
  status: CompanyStatus;
  logoUrl: string;
};

const companies: Company[] = [
  {
    id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    location: "San Francisco, CA",
    size: "500-1000",
    jobsPosted: 12,
    status: "active",
    logoUrl:
      "/images/job-profile.png",
  },
  {
    id: 2,
    name: "FinanceHub Inc",
    industry: "Finance",
    location: "New York, NY",
    size: "200-500",
    jobsPosted: 8,
    status: "active",
    logoUrl:
      "/images/job-profile.png",
  },
  {
    id: 3,
    name: "HealthCare Plus",
    industry: "Healthcare",
    location: "Boston, MA",
    size: "1000+",
    jobsPosted: 15,
    status: "active",
    logoUrl:
      "/images/job-profile.png",
  },
  {
    id: 4,
    name: "EduLearn Academy",
    industry: "Education",
    location: "Austin, TX",
    size: "100-200",
    jobsPosted: 5,
    status: "active",
    logoUrl:
      "/images/job-profile.png",
  },
  {
    id: 5,
    name: "RetailWorld",
    industry: "Retail",
    location: "Chicago, IL",
    size: "50-100",
    jobsPosted: 3,
    status: "inactive",
    logoUrl:
      "/images/job-profile.png",
  },
];

function StatusPill({ status }: { status: CompanyStatus }) {
  const cls =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}

function JobsBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex min-w-[40px] justify-center rounded-full bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700">
      {n}
    </span>
  );
}

export default function CompaniesTableSection() {
  // dummy pagination state
  const [page, setPage] = React.useState(1);

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Company
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Industry
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Location
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Size
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Jobs Posted
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {companies.map((c) => (
              <TableRow key={c.id} className="border-gray-200">
                {/* Company */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={c.logoUrl}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {c.name}
                      </div>
                      <div className="text-sm text-gray-500">ID: {c.id}</div>
                    </div>
                  </div>
                </TableCell>

                {/* Industry */}
                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {c.industry}
                </TableCell>

                {/* Location */}
                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {c.location}
                </TableCell>

                {/* Size */}
                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {c.size}
                </TableCell>

                {/* Jobs Posted */}
                <TableCell className="px-6 py-5">
                  <JobsBadge n={c.jobsPosted} />
                </TableCell>

                {/* Status */}
                <TableCell className="px-6 py-5">
                  <StatusPill status={c.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="View"
                      title="View"
                      onClick={() => console.log("view", c.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Edit"
                      title="Edit"
                      onClick={() => console.log("edit", c.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700"
                      aria-label="Delete"
                      title="Delete"
                      onClick={() => console.log("delete", c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {companies.length} of {companies.length} companies
        </p>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={page === 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={page === 2}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(2);
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(2, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
