"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";

type CreateJobValues = {
  title: string;
  type: string;
  location: string;
  salaryRange: string;
  description: string;
  requirements: string;
};

export default function CreateJobDialog({
  trigger,
  onSubmit,
}: {
  trigger: React.ReactNode;
  onSubmit?: (values: CreateJobValues) => void;
}) {
  const [values, setValues] = React.useState<CreateJobValues>({
    title: "",
    type: "Full-time",
    location: "",
    salaryRange: "",
    description: "",
    requirements: "",
  });

  function update<K extends keyof CreateJobValues>(
    key: K,
    val: CreateJobValues[K]
  ) {
    setValues((p) => ({ ...p, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-[760px] p-0 overflow-hidden rounded-2xl">
        {/* ✅ Required for Radix a11y (hidden) */}
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Job Posting</DialogTitle>
          <DialogDescription>Fill details and publish a new job.</DialogDescription>
        </DialogHeader>

        {/* Header visible */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Job Posting
          </h2>
        </div>

        <div className="h-px w-full bg-gray-200" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Job Title</label>
            <input
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Job Type + Location */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Job Type</label>
              <select
                value={values.type}
                onChange={(e) => update("type", e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Location</label>
              <input
                value={values.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Remote"
                className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Salary Range</label>
            <input
              value={values.salaryRange}
              onChange={(e) => update("salaryRange", e.target.value)}
              placeholder="e.g. $100,000 - $150,000"
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Job description..."
              className="min-h-[140px] w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Requirements</label>
            <textarea
              value={values.requirements}
              onChange={(e) => update("requirements", e.target.value)}
              placeholder="Requirements (one per line)..."
              className="min-h-[120px] w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Footer داخل الفورم عشان submit يشتغل طبيعي */}
          <div className="pt-2">
            <div className="h-px w-full bg-gray-200" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DialogClose asChild>
                <button
                  type="button"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  Cancel
                </button>
              </DialogClose>

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              >
                Publish Job
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
