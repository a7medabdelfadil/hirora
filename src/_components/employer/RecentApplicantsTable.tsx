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

type Status = "pending" | "reviewing" | "shortlisted" | "rejected";

type ApplicantRow = {
    initials: string;
    name: string;
    email: string;
    job: string;
    experienceYears: number;
    applied: string;
    status: Status;
};

const rows: ApplicantRow[] = [
    {
        initials: "JD",
        name: "John Doe",
        email: "john.doe@email.com",
        job: "Senior Full Stack Developer",
        experienceYears: 6,
        applied: "11/15/2024",
        status: "pending",
    },
    {
        initials: "SJ",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        job: "Senior Full Stack Developer",
        experienceYears: 7,
        applied: "11/14/2024",
        status: "reviewing",
    },
    {
        initials: "MC",
        name: "Michael Chen",
        email: "michael.chen@email.com",
        job: "Product Manager",
        experienceYears: 5,
        applied: "11/13/2024",
        status: "shortlisted",
    },
    {
        initials: "ED",
        name: "Emily Davis",
        email: "emily.davis@email.com",
        job: "UX/UI Designer",
        experienceYears: 5,
        applied: "11/12/2024",
        status: "shortlisted",
    },
    {
        initials: "DW",
        name: "David Wilson",
        email: "david.w@email.com",
        job: "Senior Full Stack Developer",
        experienceYears: 3,
        applied: "11/11/2024",
        status: "rejected",
    },
];

function statusPill(status: Status) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "reviewing":
            return "bg-blue-100 text-blue-700";
        case "shortlisted":
            return "bg-green-100 text-green-700";
        case "rejected":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function RecentApplicantsTable() {
    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recent Applicants</h3>
                <Link
                    href="/employer/applications"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    View All
                </Link>
            </div>

            {/* Table */}
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
                            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.email} className="border-gray-100">
                                {/* Applicant */}
                                <TableCell className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                                            {r.initials}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-gray-900">
                                                {r.name}
                                            </div>
                                            <div className="truncate text-sm text-gray-500">
                                                {r.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Job */}
                                <TableCell className="px-6 py-5 text-sm text-gray-700">
                                    {r.job}
                                </TableCell>

                                {/* Experience */}
                                <TableCell className="px-6 py-5">
                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                                        {r.experienceYears} years
                                    </span>
                                </TableCell>

                                {/* Applied */}
                                <TableCell className="px-6 py-5 text-sm text-gray-700">
                                    {r.applied}
                                </TableCell>

                                {/* Status */}
                                <TableCell className="px-6 py-5">
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusPill(
                                            r.status
                                        )}`}
                                    >
                                        {r.status}
                                    </span>
                                </TableCell>

                                {/* Action */}
                                <TableCell className="px-6 py-5">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
