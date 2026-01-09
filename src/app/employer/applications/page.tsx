"use client";

import { Filter, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import ApplicantsCardsSection from "~/_components/employer/ApplicantsCardsSection";
import Container from "~/_components/global/Container";

function JobPostingPage() {
    const [query, setQuery] = React.useState("");
    const [job, setJob] = React.useState("all");
    const [status, setStatus] = React.useState("all");

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

                        {/* Right controls */}
                        <div className="flex items-center justify-end gap-3">

                            {/* All Jobs */}
                            <select
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="h-11 min-w-[260px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="all">All Jobs</option>
                                <option value="fs">Senior Full Stack Developer</option>
                                <option value="pm">Product Manager</option>
                                <option value="ux">UX/UI Designer</option>
                                <option value="ds">Data Scientist</option>
                            </select>

                            {/* All Status */}
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-11 min-w-[140px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            <section className="mt-4">
                <ApplicantsCardsSection />
            </section>
        </Container>
    );
}

export default JobPostingPage;
