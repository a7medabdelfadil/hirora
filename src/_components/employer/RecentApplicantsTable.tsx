"use client";

import * as React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import type { EmployerDashboardRecentApplicationItem } from "~/APIs/features/employer";

type Status = "pending" | "reviewing" | "shortlisted" | "rejected" | "accepted";

interface RecentApplicantsTableProps {
  applications: EmployerDashboardRecentApplicationItem[];
}

function statusPill(status: string) {
  switch (status?.toLowerCase() as Status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "reviewing":
      return "bg-blue-100 text-blue-700";
    case "shortlisted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "accepted":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NA"
  );
}

export default function RecentApplicantsTable({
  applications,
}: RecentApplicantsTableProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Recent Applicants
        </h3>
        <Link
          href="/employer/applications"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {!applications.length ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
          No recent applicants found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                  Applicant
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                  Job
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                  Experience
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                  Applied
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id} className="border-gray-100">
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                        {getInitials(application.applicantDetails?.name ?? "")}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {application.applicantDetails?.name || "-"}
                        </div>
                        <div className="truncate text-sm text-gray-500">
                          {application.applicantDetails?.email || "-"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-sm text-gray-700">
                    {application.job?.title || "-"}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      {application.applicantDetails?.experience ?? 0} years
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-sm text-gray-700">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusPill(
                        application.status,
                      )}`}
                    >
                      {application.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}