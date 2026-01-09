"use client";

import * as React from "react";
import {
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Eye,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  status: "active" | "paused" | "closed";
  type: "Full-time" | "Part-time" | "Contract";
  location: string;
  salary: string;
  applicants: number;
  description: string;
  posted: string;
};

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    status: "active",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    applicants: 45,
    description:
      "We are seeking an experienced Full Stack Developer to join our growing team. You will work on cutting-edge projects using modern technologies.",
    posted: "10/15/2024",
  },
  {
    id: "2",
    title: "Product Manager",
    status: "active",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$130,000 - $170,000",
    applicants: 32,
    description:
      "Join our product team to drive the vision and execution of our flagship products.",
    posted: "10/20/2024",
  },
  {
    id: "3",
    title: "UX/UI Designer",
    status: "active",
    type: "Full-time",
    location: "Remote",
    salary: "$100,000 - $140,000",
    applicants: 52,
    description:
      "Create beautiful and intuitive user experiences for our products.",
    posted: "11/1/2024",
  },
  {
    id: "4",
    title: "Data Scientist",
    status: "active",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$140,000 - $180,000",
    applicants: 35,
    description:
      "Join our data science team to build ML models and drive insights.",
    posted: "11/10/2024",
  },
];

function StatusPill({ status }: { status: Job["status"] }) {
  const cls =
    status === "active"
      ? "bg-green-100 text-green-700"
      : status === "paused"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}

function TypePill({ type }: { type: Job["type"] }) {
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

export default function JobCardsSection() {
  const onEdit = (id: string) => console.log("edit", id);
  const onDelete = (id: string) => console.log("delete", id);
  const onView = (id: string) => console.log("view", id);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {/* Top row: title + actions */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-gray-900">
                {job.title}
              </h3>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(job.id)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(job.id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusPill status={job.status} />
              <TypePill type={job.type} />
            </div>

            {/* Info */}
            <div className="mt-5 space-y-3">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                text={job.location}
              />
              <InfoRow
                icon={<DollarSign className="h-4 w-4" />}
                text={job.salary}
              />
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                text={`${job.applicants} Applicants`}
              />
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-6 text-gray-600">
              {job.description}
            </p>

            {/* Divider */}
            <div className="mt-6 h-px w-full bg-gray-100" />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Posted {job.posted}
              </span>

              <button
                type="button"
                onClick={() => onView(job.id)}
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
