"use client";

import { Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import JobCardsSection from "~/_components/employer/JobCardsSection";
import Container from "~/_components/global/Container";
import type { EmployerJobItem } from "~/APIs/features/employer";
import {
  useCreateEmployerJob,
  useDeleteEmployerJob,
  useEmployerJobs,
  useUpdateEmployerJob,
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

function JobPostingPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<EmployerJobItem | null>(null);
  const [formData, setFormData] = useState<JobFormData>(emptyFormData);
  const [editStatus, setEditStatus] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<EmployerJobItem | null>(null);

  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployerJobs();

  const { mutate: createEmployerJob, isPending: isCreatingJob } =
    useCreateEmployerJob({
      onSuccess: async () => {
        handleCloseDialog();
        await refetch();
      },
    });

  const { mutate: updateEmployerJob, isPending: isUpdatingJob } =
    useUpdateEmployerJob({
      onSuccess: async () => {
        handleCloseDialog();
        await refetch();
      },
    });

  const { mutate: deleteEmployerJob, isPending: isDeletingJob } =
    useDeleteEmployerJob({
      onSuccess: async () => {
        handleCloseDeleteDialog();
        await refetch();
      },
    });

  const isSubmitting = isCreatingJob || isUpdatingJob;

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        normalizedQuery === "" ||
        job.title?.toLowerCase().includes(normalizedQuery) ||
        job.category?.toLowerCase().includes(normalizedQuery) ||
        job.location?.toLowerCase().includes(normalizedQuery) ||
        job.description?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        status === "all" || job.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [jobs, query, status]);

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
  };

  const parseListInput = (value: string) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const openCreateDialog = () => {
    setSelectedJob(null);
    setFormData(emptyFormData);
    setEditStatus("");
    setOpenJobDialog(true);
  };

  const openEditDialog = (job: EmployerJobItem) => {
    setSelectedJob(job);
    setFormData({
      title: job.title ?? "",
      description: job.description ?? "",
      requirements: (job.requirements ?? []).join("\n"),
      responsibilities: (job.responsibilities ?? []).join("\n"),
      category: job.category ?? "",
      type: job.type ?? "",
      location: job.location ?? "",
      salaryMin: String(job.salaryMin ?? ""),
      salaryMax: String(job.salaryMax ?? ""),
    });
    setEditStatus(job.status ?? "");
    setOpenJobDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenJobDialog(false);
    setSelectedJob(null);
    setFormData(emptyFormData);
    setEditStatus("");
  };

  const openDeleteConfirmDialog = (job: EmployerJobItem) => {
    setJobToDelete(job);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setJobToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!jobToDelete?._id) return;

    deleteEmployerJob({ jobId: jobToDelete._id });
  };

  const handleSubmitJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: parseListInput(formData.requirements),
      responsibilities: parseListInput(formData.responsibilities),
      category: formData.category.trim(),
      type: formData.type.trim(),
      location: formData.location.trim(),
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    };

    if (selectedJob) {
      updateEmployerJob({
        jobId: selectedJob._id,
        ...payload,
        status: editStatus.trim(),
      });
      return;
    }

    createEmployerJob(payload);
  };

  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Create and manage your job postings
        </p>

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-[760px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your jobs..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                type="button"
                onClick={openCreateDialog}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              >
                <Plus className="h-5 w-5" />
                Create New Job
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 mt-4 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-5 w-[220px]" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-4 rounded-sm" />
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <Skeleton className="h-8 w-[90px] rounded-full" />
                  <Skeleton className="h-8 w-[90px] rounded-full" />
                </div>

                <div className="mt-5 space-y-3">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>

                <div className="mt-5 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[92%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>

                <div className="mt-6 h-px w-full bg-gray-100" />

                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[90px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-red-700">
              Failed to load jobs.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <JobCardsSection
            jobs={filteredJobs}
            onEdit={openEditDialog}
            onDelete={openDeleteConfirmDialog}
            isDeleting={isDeletingJob}
          />
        )}
      </section>

      <Dialog open={openJobDialog} onOpenChange={setOpenJobDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {selectedJob ? "Update Job" : "Create New Job"}
            </DialogTitle>
            <DialogDescription>
              {selectedJob
                ? "Update the job details."
                : "Fill in the job details to publish a new opening."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitJob} className="space-y-4">
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
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {selectedJob ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              ) : null}

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
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  placeholder="120000"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salary Max
                </label>
                <input
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  placeholder="160000"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Write each requirement on a new line"
                  rows={2}
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
                  placeholder="Write each responsibility on a new line"
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.description.trim() ||
                  !formData.category.trim() ||
                  !formData.type.trim() ||
                  !formData.location.trim() ||
                  !formData.salaryMin.trim() ||
                  !formData.salaryMax.trim() ||
                  (!!selectedJob && !editStatus.trim())
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? selectedJob
                    ? "Updating..."
                    : "Creating..."
                  : selectedJob
                    ? "Update Job"
                    : "Create Job"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);
          if (!open) {
            setJobToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {jobToDelete?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              type="button"
              onClick={handleCloseDeleteDialog}
              disabled={isDeletingJob}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeletingJob}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingJob ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default JobPostingPage;