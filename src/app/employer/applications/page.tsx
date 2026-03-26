"use client";

import { Search } from "lucide-react";
import React from "react";
import AllApplicantsCardsSection from "~/_components/employer/AllApplicantsCardsSection";
import ApplicantsCardsSection from "~/_components/employer/ApplicantsCardsSection";
import Container from "~/_components/global/Container";
import { useEmployerApplications } from "~/APIs/hooks/useEmployer";
import { Skeleton } from "~/components/ui/skeleton";

function JobPostingPage() {
    const [query, setQuery] = React.useState("");
    const [job, setJob] = React.useState("all");
    const [status, setStatus] = React.useState("all");

    const {
        data: applications = [],
        isLoading,
        isError,
    } = useEmployerApplications();

    const filteredApplications = React.useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return applications.filter((app) => {
            const matchesSearch =
                normalizedQuery === "" ||
                app.applicantDetails?.name?.toLowerCase().includes(normalizedQuery) ||
                app.applicantDetails?.email?.toLowerCase().includes(normalizedQuery);

            const matchesStatus =
                status === "all" ||
                app.status?.toLowerCase() === status.toLowerCase();

            const matchesJob =
                job === "all" || app.job?._id === job;

            return matchesSearch && matchesStatus && matchesJob;
        });
    }, [applications, query, status, job]);

    return (
        <Container>
            <section className="w-full">
                <p className="mb-4 text-md text-gray-600">
                    Review and process job applications
                </p>

                <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
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
                            {/* Jobs */}
                            <select
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 md:min-w-[260px]"
                            >
                                <option value="all">All Jobs</option>

                                {/* dynamic jobs */}
                                {[...new Map(applications.map(a => [a.job._id, a.job])).values()]
                                    .map((jobItem) => (
                                        <option key={jobItem._id} value={jobItem._id}>
                                            {jobItem.title}
                                        </option>
                                    ))}
                            </select>

                            {/* Status */}
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 md:min-w-[140px]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
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
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[120px]" />
                                            <Skeleton className="h-4 w-[80px]" />
                                        </div>
                                    </div>

                                    <Skeleton className="h-6 w-[80px] rounded-full" />
                                </div>

                                {/* Info */}
                                <div className="mt-6 space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[80%]" />
                                </div>

                                {/* Job info */}
                                <div className="mt-6 space-y-3">
                                    <Skeleton className="h-4 w-[70%]" />
                                    <Skeleton className="h-4 w-[60%]" />
                                </div>

                                {/* Skills */}
                                <div className="mt-6 space-y-2">
                                    <Skeleton className="h-4 w-[80px]" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-[60px] rounded-md" />
                                        <Skeleton className="h-8 w-[60px] rounded-md" />
                                        <Skeleton className="h-8 w-[60px] rounded-md" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="my-6 h-px w-full bg-gray-200/70" />

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-11 flex-1 rounded-xl" />
                                    <Skeleton className="h-11 w-12 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center text-sm text-red-500">
                        Failed to load applications
                    </div>
                ) : (
                    <AllApplicantsCardsSection applications={filteredApplications} />
                )}
            </section>
        </Container>
    );
}

export default JobPostingPage;