"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import {   Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, } from "~/components/ui/dialog";

export default function ApplyJobModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger = Apply button */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="h-11 flex-1 rounded-xl bg-[#9810FA] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          Apply Now
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0">
        {/* Header */}
        <div className="px-6 pt-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Apply for Senior Full Stack Developer
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              TechCorp Solutions
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-4 border-t border-slate-200" />

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: submit logic
            setOpen(false);
          }}
          className="px-6 pb-6 pt-5"
        >
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="John Doe"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="(555) 123-4567"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="5 years"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Resume <span className="text-red-500">*</span>
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-6 text-center transition hover:bg-slate-100">
                <input
                  required
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Upload className="h-5 w-5 text-slate-600" />
                </div>

                <p className="text-sm font-medium text-slate-700">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </label>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Cover Letter
              </label>
              <textarea
                rows={4}
                placeholder="Tell us why you're a great fit for this role..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:gap-4 sm:space-x-0">
            <DialogClose asChild>
              <button
                type="button"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100 sm:w-48"
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#9810FA] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200 sm:w-64"
            >
              Submit Application
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
