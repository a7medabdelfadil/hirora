"use client";

import * as React from "react";
import {
  Mail,
  Phone,
  Download,
  CircleX,
  Clock,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

type Applicant = {
  id: string;
  initials: string;
  name: string;
  appliedFor: string;
  email: string;
  phone: string;
  years: number;
  skills: string[];
  coverLetter: string;
  resumeFileName: string;
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-800">
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <span className="text-gray-500">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

export default function ApplicantDetailsDialog({
  applicant,
  trigger,
  onReject,
  onReviewLater,
  onShortlist,
  onDownloadResume,
}: {
  applicant: Applicant;
  trigger: React.ReactNode;
  onReject?: (id: string) => void;
  onReviewLater?: (id: string) => void;
  onShortlist?: (id: string) => void;
  onDownloadResume?: (id: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-[820px] p-0 overflow-hidden rounded-2xl">
        {/* ✅ Required for accessibility (hidden, doesn't affect UI) */}
        <DialogHeader className="sr-only">
          <DialogTitle>Applicant Details</DialogTitle>
          <DialogDescription>
            Details for {applicant.name} application.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-sm font-semibold text-white">
            {applicant.initials}
          </div>

          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900">
              {applicant.name}
            </div>
            <div className="text-sm text-gray-600">
              Applied for {applicant.appliedFor}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200" />

        {/* Body */}
        <div className="max-h-[70vh] space-y-8 overflow-y-auto p-6">
          {/* Contact */}
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Contact Information
            </div>
            <div className="mt-3 space-y-3">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                text={applicant.email}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                text={applicant.phone}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Experience
            </div>
            <div className="mt-3 text-sm text-gray-700">
              {applicant.years} years of professional experience
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="text-sm font-semibold text-gray-900">Skills</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {applicant.skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Cover Letter
            </div>
            <div className="mt-3 text-sm leading-6 text-gray-700">
              {applicant.coverLetter}
            </div>
          </div>

          {/* Resume */}
          <div>
            <div className="text-sm font-semibold text-gray-900">Resume</div>

            <button
              type="button"
              onClick={() => onDownloadResume?.(applicant.id)}
              className="mt-3 inline-flex w-full items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
            >
              <Download className="h-4 w-4" />
              Download Resume ({applicant.resumeFileName})
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200" />

        {/* Footer buttons */}
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onReject?.(applicant.id)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            <CircleX className="h-5 w-5" />
            Reject
          </button>

          <button
            type="button"
            onClick={() => onReviewLater?.(applicant.id)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-600 font-medium text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <Clock className="h-5 w-5" />
            Review Later
          </button>

          <button
            type="button"
            onClick={() => onShortlist?.(applicant.id)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <CheckCircle2 className="h-5 w-5" />
            Shortlist
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
