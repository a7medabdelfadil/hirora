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
  const [coverLetter, setCoverLetter] = React.useState("");

  const [cv, setCv] = React.useState<File | null>(null);

  const [cvError, setCvError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [experienceError, setExperienceError] =
    React.useState("");

  const validatePhone = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Phone number is required";
    }

    // أرقام فقط مع + اختياري
    const regex = /^\+?[0-9]{10,15}$/;

    if (!regex.test(trimmedValue)) {
      return "Please enter a valid phone number";
    }

    return "";
  };

  const validateExperience = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Experience is required";
    }

    // numbers only
    if (!/^\d+$/.test(trimmedValue)) {
      return "Please enter numbers only";
    }

    const years = Number(trimmedValue);

    if (years < 0) {
      return "Experience cannot be negative";
    }

    if (years > 60) {
      return "Experience value is too large";
    }

    return "";
  };

  const { mutate, isPending } = useApplyToJob({
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "Application submitted successfully.",
      );

      setOpen(false);

      setPhone("");
      setExperience("");
      setCoverLetter("");

      setCv(null);

      setCvError("");
      setPhoneError("");
      setExperienceError("");
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

  const handleCvChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setCv(null);

      setCvError("CV (PDF) is required.");

      return;
    }

    if (file.type !== "application/pdf") {
      setCv(null);

      setCvError("Only PDF files are allowed.");

      return;
    }

    // max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      setCv(null);

      setCvError(
        "PDF size must be less than 5MB.",
      );

      return;
    }

    setCv(file);

    setCvError("");
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const phoneValidation = validatePhone(phone);

    const experienceValidation =
      validateExperience(experience);

    if (phoneValidation || experienceValidation) {
      setPhoneError(phoneValidation);

      setExperienceError(experienceValidation);

      return;
    }

    if (!cv) {
      setCvError("CV (PDF) is required.");

      return;
    }

    mutate({
      jobId,

      payload: {
        phone,
        experience: Number(experience),
        coverLetter,
        cv,
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

        <form
          onSubmit={handleSubmit}
          className="px-6 pb-6 pt-5"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);

                  setPhoneError(
                    validatePhone(e.target.value),
                  );
                }}
                placeholder="01012345678"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                  phoneError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                }`}
              />

              {phoneError && (
                <p className="mt-1 text-xs text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Years of Experience{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                required
                type="text"
                min="0"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);

                  setExperienceError(
                    validateExperience(
                      e.target.value,
                    ),
                  );
                }}
                placeholder="5"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                  experienceError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                }`}
              />

              {experienceError && (
                <p className="mt-1 text-xs text-red-500">
                  {experienceError}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Upload CV (PDF){" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                accept="application/pdf"
                required
                onChange={handleCvChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />

              {cvError && (
                <p className="mt-1 text-xs text-red-500">
                  {cvError}
                </p>
              )}

              {cv && (
                <p className="mt-1 text-xs text-slate-500">
                  Selected file: {cv.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                Cover Letter
              </label>

              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
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
              disabled={
                isPending ||
                !!phoneError ||
                !!experienceError ||
                !!cvError ||
                !phone.trim() ||
                !experience.trim() ||
                !cv
              }
              className="h-11 w-full rounded-xl bg-[#9810FA] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-64"
            >
              {isPending
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}