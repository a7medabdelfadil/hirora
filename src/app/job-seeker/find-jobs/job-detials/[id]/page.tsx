'use client';
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiClock, FiDollarSign } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiArrowLeft, HiCheckCircle, HiOutlineBriefcase } from "react-icons/hi2";
import BackButton from "~/_components/global/BackButton";
import Container from "~/_components/global/Container";
import ApplyJobModal from "~/_components/job-seeker/ApplyModal";

export default function JobDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  console.log(id)

  const job = {
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    posted: "10/15/2024",
    logoUrl:
      "/images/job-profile.png",
    description:
      "We are seeking an experienced Full Stack Developer to join our growing team. You will work on cutting-edge projects using modern technologies.",
    responsibilities: [
      "Design and develop scalable web applications",
      "Collaborate with cross-functional teams",
      "Mentor junior developers",
      "Participate in code reviews",
    ],
    requirements: [
      "5+ years of experience in full stack development",
      "Proficiency in React, Node.js, and TypeScript",
      "Experience with AWS or similar cloud platforms",
      "Strong problem-solving skills",
    ],
  };
  const company = {
    name: "TechCorp Solutions",
    industry: "Engineering",
    logoUrl:
      "/images/job-profile.png",
  };

  const overview = [
    { label: "Job Type", value: "Full-time" },
    { label: "Category", value: "Engineering" },
    { label: "Location", value: "San Francisco, CA" },
    { label: "Salary Range", value: "$120,000 - $160,000" },
    { label: "Applicants", value: "45 candidates" },
  ];

  const similarJobs = [
    {
      id: "devops-1",
      title: "DevOps Engineer",
      company: "TechCorp Solutions",
      location: "Remote",
    },
  ];
  return (
    <Container>
      <BackButton />
      <div className="md:flex gap-4">
        <section className="w-full md:w-3/5">
          <div className="mx-auto space-y-4">
            {/* Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-slate-900">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">{job.company}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FiDollarSign className="h-4 w-4 text-slate-400" />
                      {job.salary}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <HiOutlineBriefcase className="h-4 w-4 text-slate-400" />
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-slate-400" />
                      Posted {job.posted}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <ApplyJobModal />

                <button
                  type="button"
                  className="h-11 w-32 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  Save Job
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Job Description
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {job.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Key Responsibilities
              </h2>
              <ul className="mt-4 space-y-3">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <HiCheckCircle className="mt-0.5 h-5 w-5 text-purple-600" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <HiCheckCircle className="mt-0.5 h-5 w-5 text-purple-600" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="w-full md:w-2/5">
          <div className="rounded-2xl mb-4 border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">About Company</h3>

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

            <Link
              href="#"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              View Company Profile
            </Link>
          </div>

          {/* Job Overview */}
          <div className="rounded-2xl mb-4 border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Job Overview</h3>

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

          {/* Similar Jobs */}
          <div className="rounded-2xl mb-4 border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Similar Jobs</h3>

            <div className="mt-4 space-y-3">
              {similarJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/job-seeker/find-jobs/job-detials/${job.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                  <p className="mt-2 text-sm text-slate-600">{job.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>


    </Container>

  );
}
