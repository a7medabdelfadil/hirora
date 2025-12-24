import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiDollarSign } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi2";

export type JobRow = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  typeTag: string;
  description: string;
  badges: string[];
  posted: string;
  logoUrl: string;
};

export default function JobRowCard({ job }: { job: JobRow }) {
  return (
    <Link
      href={`/job-seeker/find-jobs/job-detials/${job.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={job.logoUrl}
              alt={`${job.company} logo`}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{job.company}</p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <FiDollarSign className="h-4 w-4 text-slate-400" />
                {job.salary}
              </span>

              <span className="inline-flex items-center gap-2">
                <HiOutlineBriefcase className="h-4 w-4 text-slate-400" />
                {job.category}
              </span>
            </div>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-purple-100 px-4 py-2 text-xs font-medium text-purple-700">
          {job.typeTag}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {job.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="shrink-0 text-right text-xs text-slate-500">
          <div>Posted</div>
          <div className="mt-1">{job.posted}</div>
        </div>
      </div>
    </Link>
  );
}
