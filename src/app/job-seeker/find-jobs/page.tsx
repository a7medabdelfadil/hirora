'use client';

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Container from "~/_components/global/Container";
import JobRowCard, { type JobRow } from "~/_components/job-seeker/JobRowCard";
import JobsPagination from "~/_components/job-seeker/JobsPagination";

export default function FindJobjs() {
  const allJobs: JobRow[] = [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$120,000 - $160,000",
      category: "Engineering",
      typeTag: "Full-time",
      description:
        "We are seeking an experienced Full Stack Developer to join our growing team. You will work on cutting-edge projects using modern technologies.",
      badges: ["5+ years of", "Proficiency in React,", "Experience with AWS"],
      posted: "10/15/2024",
      logoUrl: "/images/job-profile.png",
    },
    {
      id: "2",
      title: "Product Manager",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$130,000 - $170,000",
      category: "Product",
      typeTag: "Full-time",
      description:
        "Join our product team to drive the vision and execution of our flagship products.",
      badges: ["3+ years of", "Strong analytical and", "Experience with Agile"],
      posted: "10/20/2024",
      logoUrl: "/images/job-profile.png",
    },
    {
      id: "3",
      title: "Financial Analyst",
      company: "FinanceHub Inc",
      location: "New York, NY",
      salary: "$90,000 - $120,000",
      category: "Finance",
      typeTag: "Full-time",
      description:
        "Seeking a detail-oriented Financial Analyst to support our investment team.",
      badges: ["Bachelor's degree in", "2+ years of", "Advanced Excel skills"],
      posted: "10/25/2024",
      logoUrl: "/images/job-profile.png",
    },
    {
      id: "4",
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$120,000 - $160,000",
      category: "Engineering",
      typeTag: "Full-time",
      description:
        "We are seeking an experienced Full Stack Developer to join our growing team. You will work on cutting-edge projects using modern technologies.",
      badges: ["5+ years of", "Proficiency in React,", "Experience with AWS"],
      posted: "10/15/2024",
      logoUrl: "/images/job-profile.png",
    },
    {
      id: "5",
      title: "Financial Analyst",
      company: "FinanceHub Inc",
      location: "New York, NY",
      salary: "$90,000 - $120,000",
      category: "Finance",
      typeTag: "Full-time",
      description:
        "Seeking a detail-oriented Financial Analyst to support our investment team.",
      badges: ["Bachelor's degree in", "2+ years of", "Advanced Excel skills"],
      posted: "10/25/2024",
      logoUrl: "/images/job-profile.png",
    },
    {
      id: "6",
      title: "Product Manager",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$130,000 - $170,000",
      category: "Product",
      typeTag: "Full-time",
      description:
        "Join our product team to drive the vision and execution of our flagship products.",
      badges: ["3+ years of", "Strong analytical and", "Experience with Agile"],
      posted: "10/20/2024",
      logoUrl: "/images/job-profile.png",
    },
  ];

  const [showFilters, setShowFilters] = useState(false);

  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(allJobs.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageJobs = allJobs.slice(start, start + PAGE_SIZE);


  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          <p className="mb-6 text-xl text-slate-700">
            Discover your next career opportunity
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Top row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="Job title, keywords, or company"
                />
              </div>

              {/* Location input */}
              <div className="relative flex-1">
                <HiOutlineLocationMarker className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="Location"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  <HiAdjustmentsHorizontal className="h-5 w-5" />
                  Filters
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#9810FA] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-slate-200" />

            {/* Collapsible filters */}
            <div
              className={[
                "grid transition-all duration-200 ease-out",
                showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <div className="pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Job Type */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Job Type
                      </label>
                      <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Category
                      </label>
                      <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                        <option>All Categories</option>
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Design</option>
                        <option>Marketing</option>
                        <option>Finance</option>
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Experience Level
                      </label>
                      <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                        <option>All Levels</option>
                        <option>Entry</option>
                        <option>Mid</option>
                        <option>Senior</option>
                        <option>Lead</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end collapsible */}
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="mx-auto px-4 pb-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Showing {Math.min(start + pageJobs.length, allJobs.length)} of {allJobs.length} jobs
            </p>


            <select
              className="h-9 w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              defaultValue="salary_low_high"
            >
              <option value="most_recent">Most Recent</option>
              <option value="most_relevant">Most Relevant</option>
              <option value="salary_high_low">Salary: High to Low</option>
              <option value="salary_low_high">Salary: Low to High</option>
            </select>
          </div>

          <div className="space-y-4">
            {pageJobs.map((job) => (
              <JobRowCard key={job.id} job={job} />
            ))}
          </div>

          <div className="mt-6">
            <JobsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </section>
    </Container>

  );
}
