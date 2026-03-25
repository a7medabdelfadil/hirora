"use client";

import * as React from "react";
import { toast } from "react-toastify";
import { useApplyToJob } from "~/APIs/hooks/useJobSeeker";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";

type ApplyJobModalProps = {
  jobId: string;
  jobTitle: string;
  companyName: string;
};

export default function ApplyJobModal({
  jobId,
  jobTitle,
  companyName,
}: ApplyJobModalProps) {
  const [open, setOpen] = React.useState(false);

  const [phone, setPhone] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [resume, setResume] = React.useState("");
  const [coverLetter, setCoverLetter] = React.useState("");

  const { mutate, isPending } = useApplyToJob({
    onSuccess: (data) => {
      toast.success(data?.message || "Application submitted successfully.");

      setOpen(false);
      setPhone("");
      setExperience("");
      setResume("");
      setCoverLetter("");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit application.";

      toast.error(errorMessage);
      console.error("Apply failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      jobId,
      payload: {
        phone,
        experience: Number(experience),
        coverLetter,
        resume,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="h-11 flex-1 rounded-xl bg-[#9810FA] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          Apply Now
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0">
        <div className="px-6 pt-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Apply for {jobTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {companyName}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-4 border-t border-slate-200" />

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="5"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Resume URL <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="url"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="https://example.com/resume.pdf"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Cover Letter
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:gap-4 sm:space-x-0">
            <DialogClose asChild>
              <button
                type="button"
                disabled={isPending}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-48"
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-[#9810FA] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-64"
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}