"use client";

import * as React from "react";
import { Pencil, Trash2, MapPin, DollarSign, Users, Eye } from "lucide-react";
import type { EmployerJobItem } from "~/APIs/features/employer";
import Link from "next/link";

interface JobCardsSectionProps {
  jobs: EmployerJobItem[];
  onEdit?: (job: EmployerJobItem) => void;
  onDelete?: (job: EmployerJobItem) => void;
  isDeleting?: boolean;
}

function StatusPill({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();

  const cls =
    normalizedStatus === "active"
      ? "bg-green-100 text-green-700"
      : normalizedStatus === "paused"
        ? "bg-yellow-100 text-yellow-700"
        : normalizedStatus === "closed"
          ? "bg-gray-100 text-gray-700"
          : normalizedStatus === "inactive"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}

function TypePill({ type }: { type: string }) {
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
      {type}
    </span>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span className="text-gray-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function formatSalary(min?: number, max?: number) {
  if (min == null && max == null) return "-";

  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (min != null && max != null) return `${format(min)} - ${format(max)}`;
  if (min != null) return format(min);
  return format(max!);
}

export default function JobCardsSection({
  jobs,
  onEdit,
  onDelete,
  isDeleting = false,
}: JobCardsSectionProps) {
  if (!jobs.length) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No jobs found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-gray-900">
                {job.title}
              </h3>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit?.(job)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(job)}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusPill status={job.status} />
              <TypePill type={job.type} />
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                text={job.location || "-"}
              />
              <InfoRow
                icon={<DollarSign className="h-4 w-4" />}
                text={formatSalary(job.salaryMin, job.salaryMax)}
              />
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                text={`${job.applicantsCount ?? 0} Applicants`}
              />
            </div>

            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              {job.description}
            </p>

            <div className="mt-6 h-px w-full bg-gray-100" />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <Link
                href={`/employer/jobs/applicants/${job._id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <Eye className="h-4 w-4" />
                View Top Applicants
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}