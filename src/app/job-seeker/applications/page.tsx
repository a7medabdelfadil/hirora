"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineXCircle,
} from "react-icons/hi";
import { FiClock, FiSearch, FiDollarSign } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Container from "~/_components/global/Container";
import { Skeleton } from "~/components/ui/skeleton";
import { useJobseekerApplications } from "~/APIs/hooks/useJobSeeker";

function formatSalary(min?: number, max?: number) {
  if (typeof min !== "number" && typeof max !== "number") {
    return "Salary not specified";
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (typeof min === "number" && typeof max === "number") {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  if (typeof min === "number") {
    return `From ${formatNumber(min)}`;
  }

  return `Up to ${formatNumber(max!)}`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US");
}

function getStatusClasses(status?: string) {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "reviewing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "shortlisted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "accepted":
      return "bg-green-50 text-green-700 border-green-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function ApplicationsPageSkeleton() {
  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          <Skeleton className="mb-6 h-6 w-72" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-2 h-4 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10 w-full">
        <div className="mx-auto px-4 py-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Skeleton className="h-11 flex-1 rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl md:w-44" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-5 w-52" />
                    <Skeleton className="mt-2 h-4 w-36" />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                    </div>
                  </div>

                  <div className="lg:w-40">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="mt-3 h-4 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}

export default function Applications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const { data, isLoading, error } = useJobseekerApplications();

  const stats = data?.stats;
  const applications = data?.applications ?? [];

  const cards = [
    {
      label: "Total Applied",
      value: stats?.total ?? 0,
      iconBg: "bg-blue-600",
      Icon: HiOutlineDocumentText,
    },
    {
      label: "In Review",
      value: stats?.reviewing ?? 0,
      iconBg: "bg-amber-500",
      Icon: FiClock,
    },
    {
      label: "Shortlisted",
      value: stats?.shortlisted ?? 0,
      iconBg: "bg-emerald-500",
      Icon: HiOutlineCheckCircle,
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      iconBg: "bg-red-500",
      Icon: HiOutlineXCircle,
    },
  ];

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.job?.title?.toLowerCase().includes(normalizedSearch) ||
        application.company?.name?.toLowerCase().includes(normalizedSearch) ||
        application.status?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All Status" ||
        application.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  if (isLoading) {
    return <ApplicationsPageSkeleton />;
  }

  if (error) {
    return (
      <Container>
        <section className="w-full">
          <div className="mx-auto px-4 py-6">
            <p className="mb-6 text-xl text-slate-700">
              Track and manage your job applications
            </p>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
              Failed to load applications.
            </div>
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          <p className="mb-6 text-xl text-slate-700">
            Track and manage your job applications
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ label, value, iconBg, Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
                  >
                    <span className="text-base font-semibold text-white">
                      {value}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {label}
                    </p>
                  </div>

                  <div className="ml-auto hidden text-slate-300 sm:block">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10 w-full">
        <div className="mx-auto px-4 py-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="Search applications..."
                />
              </div>

              <HiOutlineFilter className="hidden h-5 w-5 text-[#99A1AF] max-md:hidden" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 md:w-44"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Reviewing</option>
                <option>Shortlisted</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <HiOutlineTrendingUp className="h-7 w-7 text-slate-500" />
              </div>

              <h3 className="mt-5 text-md font-semibold text-slate-900">
                No applications yet
              </h3>

              <p className="mt-2 text-md text-slate-500">
                Start applying to jobs to track your applications here
              </p>

              <Link
                href="/job-seeker/find-jobs"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#9810FA] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                Browse Jobs
              </Link>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FiSearch className="h-6 w-6 text-slate-500" />
              </div>

              <h3 className="mt-5 text-md font-semibold text-slate-900">
                No matching applications
              </h3>

              <p className="mt-2 text-md text-slate-500">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {application.job?.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {application.company?.name}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <HiOutlineBriefcase className="h-4 w-4 text-slate-400" />
                          {application.job?.type || "N/A"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                          {application.job?.location || "N/A"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <FiDollarSign className="h-4 w-4 text-slate-400" />
                          {formatSalary(
                            application.job?.salaryMin,
                            application.job?.salaryMax,
                          )}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <FiClock className="h-4 w-4 text-slate-400" />
                          Applied {formatDate(application.appliedDate)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Applicant Name</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {application.applicantDetails?.name || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Contact</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {application.applicantDetails?.email || "N/A"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {application.applicantDetails?.phone || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Experience</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {application.applicantDetails?.experience ?? 0} years
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Resume</p>
                          <a
                            href={application.applicantDetails?.resume || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex text-sm font-medium text-purple-600 hover:text-purple-700"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>

                      {application.applicantDetails?.coverLetter ? (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs text-slate-500">Cover Letter</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {application.applicantDetails.coverLetter}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}