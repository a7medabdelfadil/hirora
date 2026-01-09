"use client";

import { Filter, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import CreateJobDialog from "~/_components/employer/CreateJobDialog";
import JobCardsSection from "~/_components/employer/JobCardsSection";
import Container from "~/_components/global/Container";

function JobPostingPage() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");

    return (
        <Container>
            <section className="w-full">
                <p className="mb-4 text-md text-gray-600">
                    Create and manage your job postings
                </p>

                <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Left: Search */}
                        <div className="relative w-full md:max-w-[760px]">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search your jobs..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Right: Filter + Select + Button */}
                        <div className="flex items-center justify-end gap-3">
                            {/* small filter icon button */}
                            <button
                                type="button"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                aria-label="Filters"
                                title="Filters"
                            >
                                <Filter className="h-5 w-5" />
                            </button>

                            {/* Status dropdown */}
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-11 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="all">All Status</option>
                                    <option value="open">Open</option>
                                    <option value="paused">Paused</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Create button */}

                            <CreateJobDialog
                                onSubmit={(values) => {
                                    console.log(values);
                                    // call API 
                                }}
                                trigger={
                                    <button
                                        type="button"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Create New Job
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full mt-4">
                <JobCardsSection />
            </section>
        </Container>
    );
}

export default JobPostingPage;
