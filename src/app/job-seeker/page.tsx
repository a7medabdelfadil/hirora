"use client";

import Link from "next/link";
import React from "react";
import { FiClock } from "react-icons/fi";
import { HiOutlineTrendingUp } from "react-icons/hi";
import {
  HiArrowRight,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import Container from "~/_components/global/Container";
import JobCard, { type Job } from "~/_components/job-seeker/JobCard";

function JobSeekerPage() {
  const stats = [
    {
      title: "Jobs Applied",
      iconBg: "bg-blue-600",
      Icon: HiOutlineDocumentText,
    },
    { title: "In Review", iconBg: "bg-amber-500", Icon: FiClock },
    {
      title: "Shortlisted",
      iconBg: "bg-emerald-500",
      Icon: HiOutlineTrendingUp,
    },
    { title: "Active Jobs", iconBg: "bg-purple-600", Icon: HiOutlineBriefcase },
  ];
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$120,000 - $160,000",
      typeTag: "Full-time",
      categoryTag: "Engineering",
      logoUrl:
        "/images/job-profile.png",
    },
    {
      id: "2",
      title: "Product Manager",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$130,000 - $170,000",
      typeTag: "Full-time",
      categoryTag: "Product",
     logoUrl:
        "/images/job-profile.png",
    },
    {
      id: "3",
      title: "Financial Analyst",
      company: "FinanceHub Inc",
      location: "New York, NY",
      salary: "$90,000 - $120,000",
      typeTag: "Full-time",
      categoryTag: "Finance",
      logoUrl:
        "/images/job-profile.png",
    },
    {
      id: "4",
      title: "UX/UI Designer",
      company: "TechCorp Solutions",
      location: "Remote",
      salary: "$100,000 - $140,000",
      typeTag: "Full-time",
      categoryTag: "Design",
      logoUrl:
        "/images/job-profile.png",
    },
    {
      id: "5",
      title: "Registered Nurse",
      company: "HealthCare Plus",
      location: "Boston, MA",
      salary: "$75,000 - $95,000",
      typeTag: "Full-time",
      categoryTag: "Healthcare",
      logoUrl:
        "/images/job-profile.png",
    },
    {
      id: "6",
      title: "Marketing Coordinator",
      company: "EduLearn Academy",
      location: "Austin, TX",
      salary: "$55,000 - $70,000",
      typeTag: "Full-time",
      categoryTag: "Marketing",
      logoUrl:
        "/images/job-profile.png",
    },
  ];

  return (
    <Container>
      <section className="w-full">
        <div className="mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, John Doe!
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Find your dream job today
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ title, iconBg, Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-bgPrimary p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <p className="truncate text-sm font-medium text-slate-700">
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-sm">
            <h2 className="text-md font-medium opacity-95">
              Ready to find your next opportunity?
            </h2>

            <p className="text-md mt-4 opacity-90">
              Browse thousands of job openings from top companies
            </p>

            <Link
              href="/job-seeker/find-jobs"
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Search Jobs <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full">
      <div className="mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Recommended Jobs
          </h2>

          <Link
            href="/job-seeker/find-jobs"
            className="text-sm font-medium text-purple-700 hover:text-purple-800 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
    </Container>
  );
}

export default JobSeekerPage;
