'use client';

import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Container from "~/_components/global/Container";
import JobRowCard, { type JobRow } from "~/_components/job-seeker/JobRowCard";
import JobsPagination from "~/_components/job-seeker/JobsPagination";
import { JobseekerJobItem } from "~/APIs/features/jobSeeker";
import { useJobseekerJobs } from "~/APIs/hooks/useJobSeeker";
import { Skeleton } from "~/components/ui/skeleton";

function formatSalary(min?: number, max?: number) {
  if (typeof min !== "number" && typeof max !== "number") return "Salary not specified";

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (typeof min === "number" && typeof max === "number") {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  if (typeof min === "number") return `From ${formatNumber(min)}`;
  return `Up to ${formatNumber(max!)}`;
}

function formatPostedDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US");
}

function mapJobToRow(job: JobseekerJobItem): JobRow {
  return {
    id: job._id,
    title: job.title,
    company: job.company?.name ?? "Unknown Company",
    location: job.location,
    salary: formatSalary(job.salaryMin, job.salaryMax),
    category: job.category,
    typeTag: job.type,
    description: job.description,
    badges: (job.requirements ?? []).slice(0, 3),
    posted: formatPostedDate(job.createdAt),
    logoUrl: "/images/job-profile.png",
  };
}

export default function FindJobjs() {
  const { data, isLoading, error } = useJobseekerJobs();

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [jobType, setJobType] = useState("All Types");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("salary_low_high");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 3;

  const jobs = useMemo(() => {
    return (data ?? []).map(mapJobToRow);
  }, [data]);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        (data ?? [])
          .map((job) => job.category)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    return values;
  }, [data]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedLocation = locationText.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((job) => {
        return (
          job.title.toLowerCase().includes(normalizedSearch) ||
          job.company.toLowerCase().includes(normalizedSearch) ||
          job.description.toLowerCase().includes(normalizedSearch) ||
          job.badges.some((badge) => badge.toLowerCase().includes(normalizedSearch))
        );
      });
    }

    if (normalizedLocation) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(normalizedLocation),
      );
    }

    if (jobType !== "All Types") {
      result = result.filter((job) => job.typeTag === jobType);
    }

    if (category !== "All Categories") {
      result = result.filter((job) => job.category === category);
    }

    result.sort((a, b) => {
      if (sortBy === "most_recent") {
        const aDate = new Date(
          (data ?? []).find((item) => item._id === a.id)?.createdAt ?? "",
        ).getTime();
        const bDate = new Date(
          (data ?? []).find((item) => item._id === b.id)?.createdAt ?? "",
        ).getTime();

        return bDate - aDate;
      }

      if (sortBy === "salary_high_low") {
        const aMax = (data ?? []).find((item) => item._id === a.id)?.salaryMax ?? 0;
        const bMax = (data ?? []).find((item) => item._id === b.id)?.salaryMax ?? 0;

        return bMax - aMax;
      }

      if (sortBy === "salary_low_high") {
        const aMin = (data ?? []).find((item) => item._id === a.id)?.salaryMin ?? 0;
        const bMin = (data ?? []).find((item) => item._id === b.id)?.salaryMin ?? 0;

        return aMin - bMin;
      }

      return 0;
    });

    return result;
  }, [jobs, data, searchText, locationText, jobType, category, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [searchText, locationText, jobType, category, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageJobs = filteredJobs.slice(start, start + PAGE_SIZE);

  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          <p className="mb-6 text-xl text-slate-700">
            Discover your next career opportunity
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="Job title, keywords, or company"
                />
              </div>

              <div className="relative flex-1">
                <HiOutlineLocationMarker className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="Location"
                />
              </div>

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

            <div className="mt-4 border-t border-slate-200" />

            <div
              className={[
                "grid transition-all duration-200 ease-out",
                showFilters
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <div className="pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Job Type
                      </label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      >
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      >
                        <option>All Categories</option>
                        {categories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 w-full">
        <div className="mx-auto px-4 pb-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <p className="text-sm text-slate-500">
                {`Showing ${Math.min(start + pageJobs.length, filteredJobs.length)} of ${filteredJobs.length} jobs`}
              </p>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            >
              <option value="most_recent">Most Recent</option>
              <option value="most_relevant">Most Relevant</option>
              <option value="salary_high_low">Salary: High to Low</option>
              <option value="salary_low_high">Salary: Low to High</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <JobRowCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
              Failed to load jobs.
            </div>
          ) : pageJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              No jobs found.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {pageJobs.map((job) => (
                  <JobRowCard key={job.id} job={job} />
                ))}
              </div>

              <div className="mt-6">
                <JobsPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </Container>
  );
}

function JobRowCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 gap-4">
          <Skeleton className="h-14 w-14 rounded-xl" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5" />

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        </div>

        <div className="space-y-3 md:w-48">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}