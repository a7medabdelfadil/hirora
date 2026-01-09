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

type Applicant = {
  id: number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  jobApplied: string;
  company: string;
  experienceYears: number;
  appliedDate: string;
};

const applicants: Applicant[] = [
  {
    id: 1,
    initials: "JD",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    jobApplied: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    experienceYears: 6,
    appliedDate: "11/15/2024",
  },
  {
    id: 2,
    initials: "SJ",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    jobApplied: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    experienceYears: 7,
    appliedDate: "11/14/2024",
  },
  {
    id: 3,
    initials: "MC",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 345-6789",
    jobApplied: "Product Manager",
    company: "TechCorp Solutions",
    experienceYears: 5,
    appliedDate: "11/13/2024",
  },
  {
    id: 4,
    initials: "ED",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    jobApplied: "UX/UI Designer",
    company: "TechCorp Solutions",
    experienceYears: 5,
    appliedDate: "11/12/2024",
  },
  {
    id: 5,
    initials: "DW",
    name: "David Wilson",
    email: "david.w@email.com",
    phone: "(555) 567-8901",
    jobApplied: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    experienceYears: 3,
    appliedDate: "11/11/2024",
  },
  {
    id: 6,
    initials: "LA",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "(555) 678-9012",
    jobApplied: "Financial Analyst",
    company: "FinanceHub Inc",
    experienceYears: 4,
    appliedDate: "11/16/2024",
  },
  {
    id: 7,
    initials: "RB",
    name: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "(555) 789-0123",
    jobApplied: "Data Scientist",
    company: "TechCorp Solutions",
    experienceYears: 4,
    appliedDate: "11/17/2024",
  },
  {
    id: 8,
    initials: "JL",
    name: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    phone: "(555) 890-1234",
    jobApplied: "DevOps Engineer",
    company: "TechCorp Solutions",
    experienceYears: 6,
    appliedDate: "11/10/2024",
  },
];

function ExperiencePill({ years }: { years: number }) {
  return (
    <span className="inline-flex rounded-full bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700">
      {years} years
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export default function AdminApplicantsTableSection() {
  const [page, setPage] = React.useState(1);

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
            {applicants.map((a) => (
              <TableRow key={a.id} className="border-gray-200">
                {/* Applicant */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar initials={a.initials} />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {a.name}
                      </div>
                      <div className="text-xs text-gray-500">ID: {a.id}</div>
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell className="px-6 py-5">
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{a.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{a.phone}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Job Applied */}
                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  <span className="block max-w-[220px] whitespace-normal leading-5">
                    {a.jobApplied}
                  </span>
                </TableCell>

                {/* Company */}
                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  <span className="block max-w-[180px] whitespace-normal leading-5">
                    {a.company}
                  </span>
                </TableCell>

                {/* Experience */}
                <TableCell className="px-6 py-5">
                  <ExperiencePill years={a.experienceYears} />
                </TableCell>

                {/* Applied Date */}
                <TableCell className="px-6 py-5 text-sm text-gray-700">
                  {a.appliedDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {applicants.length} of {applicants.length} applicants
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
