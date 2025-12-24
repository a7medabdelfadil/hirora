import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiDollarSign } from "react-icons/fi";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  typeTag: string;
  categoryTag: string;
  logoUrl: string;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/job-seeker/find-jobs/job-detials/${job.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={job.logoUrl}
            alt={`${job.company} logo`}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{job.company}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiDollarSign className="h-4 w-4 text-slate-400" />
          <span className="truncate">{job.salary}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          {job.typeTag}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {job.categoryTag}
        </span>
      </div>
    </Link>
  );
}
