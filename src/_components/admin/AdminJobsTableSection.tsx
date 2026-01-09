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

type Job = {
    id: number;
    title: string;
    category: string;
    companyName: string;
    companyLogo: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract";
    applicants: number;
    status: "active" | "inactive";
    posted: string;
};

const jobs: Job[] = [
    {
        id: 1,
        title: "Senior Full Stack Developer",
        category: "Engineering",
        companyName: "TechCorp Solutions",
        companyLogo:
            "/images/job-profile.png",

        location: "San Francisco, CA",
        type: "Full-time",
        applicants: 45,
        status: "active",
        posted: "10/15/2024",
    },
    {
        id: 2,
        title: "Product Manager",
        category: "Product",
        companyName: "TechCorp Solutions",
        companyLogo:
            "/images/job-profile.png",
        location: "San Francisco, CA",
        type: "Full-time",
        applicants: 32,
        status: "active",
        posted: "10/20/2024",
    },
    {
        id: 3,
        title: "Financial Analyst",
        category: "Finance",
        companyName: "FinanceHub Inc",
        companyLogo:
            "/images/job-profile.png",
        location: "New York, NY",
        type: "Full-time",
        applicants: 28,
        status: "active",
        posted: "10/25/2024",
    },
    {
        id: 4,
        title: "UX/UI Designer",
        category: "Design",
        companyName: "TechCorp Solutions",
        companyLogo:
            "/images/job-profile.png",
        location: "Remote",
        type: "Full-time",
        applicants: 52,
        status: "active",
        posted: "11/1/2024",
    },
    {
        id: 5,
        title: "Registered Nurse",
        category: "Healthcare",
        companyName: "HealthCare Plus",
        companyLogo:
            "/images/job-profile.png",
        location: "Boston, MA",
        type: "Full-time",
        applicants: 38,
        status: "active",
        posted: "11/5/2024",
    },
    {
        id: 6,
        title: "Marketing Coordinator",
        category: "Marketing",
        companyName: "EduLearn Academy",
        companyLogo:
            "/images/job-profile.png",
        location: "Austin, TX",
        type: "Full-time",
        applicants: 41,
        status: "active",
        posted: "11/8/2024",
    },
    {
        id: 7,
        title: "Data Scientist",
        category: "Data Science",
        companyName: "TechCorp Solutions",
        companyLogo:
            "/images/job-profile.png",
        location: "San Francisco, CA",
        type: "Full-time",
        applicants: 35,
        status: "active",
        posted: "11/10/2024",
    },
    {
        id: 8,
        title: "DevOps Engineer",
        category: "Engineering",
        companyName: "TechCorp Solutions",
        companyLogo:
            "/images/job-profile.png",
        location: "Remote",
        type: "Full-time",
        applicants: 29,
        status: "active",
        posted: "11/12/2024",
    },
];

function TypePill({ type }: { type: Job["type"] }) {
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

function StatusPill({ status }: { status: Job["status"] }) {
    const cls =
        status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700";
    return (
        <span className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ${cls}`}>
            {status}
        </span>
    );
}

export default function AdminJobsTableSection() {
    const [page, setPage] = React.useState(1);

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
                        {jobs.map((j) => (
                            <TableRow key={j.id} className="border-gray-200">
                                {/* Job Title */}
                                <TableCell className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                            <Briefcase className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-gray-900">
                                                {j.title}
                                            </div>
                                            <div className="text-xs text-gray-500">{j.category}</div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Company */}
                                <TableCell className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gray-100">
                                            <Image
                                                src={j.companyLogo}
                                                alt={j.companyName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-800">{j.companyName}</div>
                                    </div>
                                </TableCell>

                                {/* Location */}
                                <TableCell className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-800">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        {j.location}
                                    </div>
                                </TableCell>

                                {/* Type */}
                                <TableCell className="px-6 py-5">
                                    <TypePill type={j.type} />
                                </TableCell>

                                {/* Applicants */}
                                <TableCell className="px-6 py-5">
                                    <ApplicantsPill n={j.applicants} />
                                </TableCell>

                                {/* Status */}
                                <TableCell className="px-6 py-5">
                                    <StatusPill status={j.status} />
                                </TableCell>

                                {/* Posted */}
                                <TableCell className="px-6 py-5 text-sm text-gray-800">
                                    {j.posted}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                    Showing {jobs.length} of {jobs.length} jobs
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
