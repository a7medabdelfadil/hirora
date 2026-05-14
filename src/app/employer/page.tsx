/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { Briefcase, Clock3, Plus, TrendingUp, Users } from "lucide-react";
import React, { useEffect } from "react";
import JobPerformanceChart from "~/_components/employer/JobPerformanceChart";
import RecentApplicantsTable from "~/_components/employer/RecentApplicantsTable";
import Container from "~/_components/global/Container";
import {
  useCreateEmployerJob,
  useEmployerDashboard,
} from "~/APIs/hooks/useEmployer";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "~/_components/global/Spinner";

type JobFormData = {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  category: string;
  type: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
};

const emptyFormData: JobFormData = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  category: "",
  type: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
};

function EmployerPage() {
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const [formData, setFormData] =
    React.useState<JobFormData>(emptyFormData);

  const [salaryMinError, setSalaryMinError] = React.useState("");
  const [salaryMaxError, setSalaryMaxError] = React.useState("");

  const validateSalary = (
    value: string,
    field: "min" | "max",
    minSalary?: string,
  ) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return `Salary ${field} is required`;
    }

    // numbers only
    if (!/^\d+$/.test(trimmedValue)) {
      return "Please enter numbers only";
    }

    const salary = Number(trimmedValue);

    // minimum salary
    if (salary < 1000) {
      return "Salary must be at least 1000";
    }

    // very large salary
    if (salary > 10000000) {
      return "Salary value is too large";
    }

    // salary max > salary min
    if (
      field === "max" &&
      minSalary &&
      Number(minSalary) >= salary
    ) {
      return "Salary max must be greater than salary min";
    }

    return "";
  };

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployerDashboard();

  const { mutate: createEmployerJob, isPending: isCreatingJob } =
    useCreateEmployerJob({
      onSuccess: async () => {
        toast.success("Job created successfully ✅");

        setOpenCreateDialog(false);
        setFormData(emptyFormData);

        setSalaryMinError("");
        setSalaryMaxError("");

        await refetch();
      },

      onError: (err: any) => {
        toast.error(err?.message || "Failed to create job ❌");
      },
    });

  const pendingReviewsCount = React.useMemo(() => {
    return (
      dashboard?.recentApplications?.filter(
        (application) =>
          application.status?.toLowerCase() === "pending",
      ).length ?? 0
    );
  }, [dashboard]);

  const shortlistedCount = React.useMemo(() => {
    return (
      dashboard?.recentApplications?.filter(
        (application) =>
          application.status?.toLowerCase() === "shortlisted",
      ).length ?? 0
    );
  }, [dashboard]);

  const stats = [
    {
      label: "Active Jobs",
      value: dashboard?.activeJobs ?? 0,
      icon: <Briefcase className="h-5 w-5 text-white" />,
      iconBg: "bg-[#2B7FFF]",
      valueColor: "text-green-500",
    },
    {
      label: "Total Applicants",
      value: dashboard?.totalApplicants ?? 0,
      icon: <Users className="h-5 w-5 text-white" />,
      iconBg: "bg-[#00C950]",
      valueColor: "text-green-500",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsCount,
      icon: <Clock3 className="h-5 w-5 text-white" />,
      iconBg: "bg-[#F0B100]",
      valueColor: "text-yellow-500",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      iconBg: "bg-[#AD46FF]",
      valueColor: "text-purple-500",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "salaryMin") {
      setSalaryMinError(validateSalary(value, "min"));
    }

    if (name === "salaryMax") {
      setSalaryMaxError(
        validateSalary(value, "max", formData.salaryMin),
      );
    }
  };

  const parseListInput = (value: string) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleCreateJob = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const salaryMinValidation = validateSalary(
      formData.salaryMin,
      "min",
    );

    const salaryMaxValidation = validateSalary(
      formData.salaryMax,
      "max",
      formData.salaryMin,
    );

    if (salaryMinValidation || salaryMaxValidation) {
      setSalaryMinError(salaryMinValidation);
      setSalaryMaxError(salaryMaxValidation);

      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.type.trim() ||
      !formData.location.trim() ||
      !formData.salaryMin.trim() ||
      !formData.salaryMax.trim()
    ) {
      return;
    }

    createEmployerJob({
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: parseListInput(formData.requirements),
      responsibilities: parseListInput(
        formData.responsibilities,
      ),
      category: formData.category.trim(),
      type: formData.type.trim(),
      location: formData.location.trim(),
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    });
  };

  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      (!dashboard?.company?.name || isError)
    ) {
      router.replace("/employer/no-company");
    }
  }, [isLoading, isError, dashboard, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (isLoading || isError || !dashboard?.company?.name) {
    return null;
  }

  type ActionItem = {
    label: string;
    variant: "primary" | "outline";
    onClick: () => void;
  };

  const actions: ActionItem[] = [
    {
      label: "Post New Job",
      variant: "primary",
      onClick: () => setOpenCreateDialog(true),
    },
    {
      label: "View All Jobs",
      variant: "outline",
      onClick: () => router.push("/employer/jobs"),
    },
    {
      label: "Review Applicants",
      variant: "outline",
      onClick: () => router.push("/employer/applications"),
    },
  ];

  return (
    <Container>
      <section className="w-full">
        <div className="mb-4">
          <h2 className="text-md text-gray-700">
            Welcome back,{" "}
            <span className="font-semibold">
              {dashboard?.company?.name || "Employer"}
            </span>
          </h2>

          <p className="text-sm text-gray-500">
            {dashboard?.company?.industry || "Recruiter"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`absolute right-5 top-5 text-sm font-bold md:text-md ${s.valueColor}`}
              >
                +{s.value}
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                {s.icon}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 flex items-stretch gap-4 max-md:flex-col">
        <div className="h-full flex-1">
          <JobPerformanceChart
            data={dashboard?.jobPerformance ?? []}
          />
        </div>

        <div className="h-full w-full md:max-w-[300px]">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:max-w-[300px]">
            <h3 className="text-sm font-medium text-gray-800">
              Quick Actions
            </h3>

            <div className="mt-6 space-y-5">
              {actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className={
                    a.variant === "primary"
                      ? "w-full rounded-xl bg-blue-600 px-4 py-4 text-base font-medium text-white shadow-sm transition hover:bg-blue-700 "
                      : "w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base font-medium text-gray-800 transition hover:bg-gray-50"
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 bg-gray-50">
        <div className="mx-auto">
          <RecentApplicantsTable
            applications={
              dashboard?.recentApplications ?? []
            }
          />
        </div>
      </section>

      <Dialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>

            <DialogDescription>
              Fill in the job details to publish a new opening.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateJob}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Job Title
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter job description"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Engineering"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">
                    Full-time
                  </option>
                  <option value="Part-time">
                    Part-time
                  </option>
                  <option value="Contract">
                    Contract
                  </option>
                  <option value="Internship">
                    Internship
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salary Min
                </label>

                <input
                  name="salaryMin"
                  type="text"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  placeholder="120000"
                  className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                    salaryMinError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                  }`}
                />

                {salaryMinError && (
                  <p className="mt-1 text-sm text-red-500">
                    {salaryMinError}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salary Max
                </label>

                <input
                  name="salaryMax"
                  type="text"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  placeholder="160000"
                  className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                    salaryMaxError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                  }`}
                />

                {salaryMaxError && (
                  <p className="mt-1 text-sm text-red-500">
                    {salaryMaxError}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Requirements
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder={`One requirement per line
5+ years of experience
React, Node.js, TypeScript`}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Responsibilities
                </label>

                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  placeholder={`One responsibility per line
Build scalable apps
Collaborate with the team`}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpenCreateDialog(false);

                  setFormData(emptyFormData);

                  setSalaryMinError("");
                  setSalaryMaxError("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isCreatingJob ||
                  !!salaryMinError ||
                  !!salaryMaxError ||
                  !formData.title.trim() ||
                  !formData.description.trim() ||
                  !formData.category.trim() ||
                  !formData.type.trim() ||
                  !formData.location.trim() ||
                  !formData.salaryMin.trim() ||
                  !formData.salaryMax.trim()
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingJob
                  ? "Creating..."
                  : "Create Job"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default EmployerPage;
