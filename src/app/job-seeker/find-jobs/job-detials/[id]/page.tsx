'use client';

import Image from "next/image";
import { useParams } from "next/navigation";
import { FiClock, FiDollarSign } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiCheckCircle, HiOutlineBriefcase } from "react-icons/hi2";
import BackButton from "~/_components/global/BackButton";
import Container from "~/_components/global/Container";
import ApplyJobModal from "~/_components/job-seeker/ApplyModal";
import { useJobseekerJobDetails } from "~/APIs/hooks/useJobSeeker";
import { Skeleton } from "~/components/ui/skeleton";

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

function formatPostedDate(dateString?: string) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US");
}

function JobDetailsSkeleton() {
  return (
    <Container>
      <BackButton />

      <div className="gap-4 md:flex">
        <section className="mb-4 w-full md:w-3/5">
          <div className="mx-auto space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="mt-2 h-4 w-36" />

                  <div className="mt-3 flex flex-wrap gap-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-5 w-32" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-5 w-40" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-5 w-28" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 w-full md:w-2/5">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-28" />

            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />

              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-32" />
              </div>

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-4 w-20" />
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-28" />

            <div className="mt-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: job, isLoading, error } = useJobseekerJobDetails(id);

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container>
        <BackButton />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          Failed to load job details.
        </div>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <BackButton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Job not found.
        </div>
      </Container>
    );
  }

  const company = {
    name: job.company?.name ?? "Unknown Company",
    industry: job.company?.industry ?? "Not specified",
    location: job.company?.location ?? "Not specified",
    size: job.company?.size ?? "Not specified",
    logoUrl: "/images/job-profile.png",
  };

  const overview = [
    { label: "Job Type", value: job.type || "Not specified" },
    { label: "Category", value: job.category || "Not specified" },
    { label: "Location", value: job.location || "Not specified" },
    {
      label: "Salary Range",
      value: formatSalary(job.salaryMin, job.salaryMax),
    },
    {
      label: "Applicants",
      value: `${job.applicantsCount ?? 0} candidates`,
    },
  ];

  return (
    <Container>
      <BackButton />

      <div className="gap-4 md:flex">
        <section className="mb-4 w-full md:w-3/5">
          <div className="mx-auto space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/images/job-profile.png"
                    alt={`${company.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-slate-900">
                    {job.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">{company.name}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                      {job.location}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <FiDollarSign className="h-4 w-4 text-slate-400" />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <HiOutlineBriefcase className="h-4 w-4 text-slate-400" />
                      {job.type}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-slate-400" />
                      Posted {formatPostedDate(job.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <ApplyJobModal
                  jobId={job._id}
                  jobTitle={job.title}
                  companyName={company.name}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Job Description
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {job.description || "No description available."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Key Responsibilities
              </h2>

              <ul className="mt-4 space-y-3">
                {(job.responsibilities ?? []).length > 0 ? (
                  job.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <HiCheckCircle className="mt-0.5 h-5 w-5 text-purple-600" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500">
                    No responsibilities available.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Requirements
              </h2>

              <ul className="mt-4 space-y-3">
                {(job.requirements ?? []).length > 0 ? (
                  job.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <HiCheckCircle className="mt-0.5 h-5 w-5 text-purple-600" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500">
                    No requirements available.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 w-full md:w-2/5">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              About Company
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {company.name}
                </p>
                <p className="text-sm text-slate-500">{company.industry}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {company.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Company Size</p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {company.size}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Job Overview
            </h3>

            <div className="mt-4 space-y-4">
              {overview.map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}