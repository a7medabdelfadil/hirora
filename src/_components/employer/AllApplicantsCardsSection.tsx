"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Eye, Download, Briefcase, MapPin } from "lucide-react";
import ApplicantDetailsDialog from "./ApplicantDetailsDialog";
import type {
  EmployerApplicationStatus,
  EmployerAllApplicationsItem,
} from "~/APIs/features/employer";
import { useUpdateEmployerApplicationStatus } from "~/APIs/hooks/useEmployer";

type Status =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "accepted";

interface AllApplicantsCardsSectionProps {
  applications: EmployerAllApplicationsItem[];
}

function statusClasses(status: string) {
  switch (status?.toLowerCase() as Status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "reviewing":
      return "bg-blue-100 text-blue-700";
    case "shortlisted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "accepted":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800">
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

function getInitials(name?: string) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NA"
  );
}

export default function AllApplicantsCardsSection({
  applications,
}: AllApplicantsCardsSectionProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateEmployerApplicationStatus({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["employer-applications"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["employer-job-applications"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["employer-dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["employer-jobs"],
        }),
      ]);
    },
  });

  const handleChangeStatus = (
    applicationId: string,
    status: EmployerApplicationStatus,
  ) => {
    mutate({
      applicationId,
      status,
    });
  };

  const onDownload = (resumeUrl?: string) => {
    if (!resumeUrl) return;
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  if (!applications.length) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No applicants found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {applications.map((application) => {
          const skills =
            application.applicant?.profile?.skills?.length
              ? application.applicant.profile.skills
              : application.applicantDetails?.skills ?? [];

          const visibleSkills = skills.slice(0, 3);
          const extraSkillsCount =
            skills.length > 3 ? skills.length - 3 : undefined;

          const dialogApplicant = {
            id: application._id,
            initials: getInitials(application.applicantDetails?.name),
            name: application.applicantDetails?.name || "-",
            appliedFor: application.job?.title || "Unknown Job",
            email: application.applicantDetails?.email || "-",
            phone: application.applicantDetails?.phone || "-",
            years: application.applicantDetails?.experience ?? 0,
            skills,
            coverLetter: application.applicantDetails?.coverLetter || "",
            resumeFileName: application.applicantDetails?.resume || "",
          };

          return (
            <div
              key={application._id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-sm font-semibold text-white">
                    {getInitials(application.applicantDetails?.name)}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {application.applicantDetails?.name || "-"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.applicantDetails?.experience ?? 0} years
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${statusClasses(
                    application.status,
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  text={application.applicantDetails?.email || "-"}
                />
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  text={application.applicantDetails?.phone || "-"}
                />
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  icon={<Briefcase className="h-4 w-4" />}
                  text={application.job?.title || "-"}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  text={application.job?.location || "-"}
                />
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-sm text-gray-700">Applied for</div>
                <div className="text-sm font-medium text-gray-900">
                  {application.job?.title || "Unknown Job"}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-gray-700">Skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {visibleSkills.length ? (
                    <>
                      {visibleSkills.map((skill) => (
                        <Chip key={skill}>{skill}</Chip>
                      ))}
                      {extraSkillsCount ? <Chip>+{extraSkillsCount}</Chip> : null}
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="my-6 h-px w-full bg-gray-200/70" />

              <div className="flex items-center gap-3">
                <ApplicantDetailsDialog
                  applicant={dialogApplicant}
                  isSubmitting={isPending}
                  onReject={(id) => handleChangeStatus(id, "rejected")}
                  onReviewLater={(id) => handleChangeStatus(id, "reviewing")}
                  onShortlist={(id) => handleChangeStatus(id, "shortlisted")}
                  onDownloadResume={() =>
                    onDownload(application.applicantDetails?.resume)
                  }
                  trigger={
                    <button
                      type="button"
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  }
                />

                <button
                  type="button"
                  onClick={() => onDownload(application.applicantDetails?.resume)}
                  className="inline-flex h-11 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Download"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}