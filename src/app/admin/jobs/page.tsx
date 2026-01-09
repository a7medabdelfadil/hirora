"use client";

import { Search } from "lucide-react";
import React from "react";
import AdminJobsTableSection from "~/_components/admin/AdminJobsTableSection";
import Container from "~/_components/global/Container";

function JobsPage() {
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [type, setType] = React.useState("all");

    return (
        <Container>
            <section className="w-full">
                <p className="mb-4 text-md text-gray-600">
                    Manage all job postings across the platform
                </p>

                <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
                        <div className="relative w-full md:flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search jobs..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center justify-end gap-3">

                            {/* All Status */}
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-11 min-w-[130px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="paused">Paused</option>
                                <option value="closed">Closed</option>
                            </select>

                            {/* All Types */}
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
                <AdminJobsTableSection />
            </section>
        </Container>
    );
}

export default JobsPage;
