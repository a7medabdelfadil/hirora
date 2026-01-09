"use client";

import * as React from "react";
import { Mail, Phone, Eye, Download } from "lucide-react";
import ApplicantDetailsDialog from "./ApplicantDetailsDialog";

type Status = "pending" | "reviewing" | "shortlisted" | "rejected";

type Applicant = {
    id: string;
    initials: string;
    name: string;
    years: number;
    status: Status;
    email: string;
    phone: string;
    jobTitle: string;
    skills: string[];
    extraSkillsCount?: number;
};

const applicant = {
    id: "2",
    initials: "SJ",
    name: "Sarah Johnson",
    appliedFor: "Senior Full Stack Developer",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    years: 7,
    skills: ["React", "Node.js", "Python", "Docker"],
    coverLetter: "With over 7 years of experience...",
    resumeFileName: "sarah_johnson_resume.pdf",
};

const applicants: Applicant[] = [
    {
        id: "1",
        initials: "JD",
        name: "John Doe",
        years: 6,
        status: "pending",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        jobTitle: "Senior Full Stack Developer",
        skills: ["React", "Node.js", "TypeScript"],
        extraSkillsCount: 1,
    },
    {
        id: "2",
        initials: "SJ",
        name: "Sarah Johnson",
        years: 7,
        status: "reviewing",
        email: "sarah.j@email.com",
        phone: "(555) 234-5678",
        jobTitle: "Senior Full Stack Developer",
        skills: ["React", "Node.js", "Python"],
        extraSkillsCount: 1,
    },
    {
        id: "3",
        initials: "MC",
        name: "Michael Chen",
        years: 5,
        status: "shortlisted",
        email: "michael.chen@email.com",
        phone: "(555) 345-6789",
        jobTitle: "Product Manager",
        skills: ["Product Strategy", "Agile", "Data Analysis"],
        extraSkillsCount: 1,
    },
    {
        id: "4",
        initials: "JD",
        name: "John Doe",
        years: 6,
        status: "pending",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        jobTitle: "Senior Full Stack Developer",
        skills: ["React", "Node.js", "TypeScript"],
        extraSkillsCount: 1,
    },
    {
        id: "5",
        initials: "SJ",
        name: "Sarah Johnson",
        years: 7,
        status: "reviewing",
        email: "sarah.j@email.com",
        phone: "(555) 234-5678",
        jobTitle: "Senior Full Stack Developer",
        skills: ["React", "Node.js", "Python"],
        extraSkillsCount: 1,
    },
    {
        id: "6",
        initials: "MC",
        name: "Michael Chen",
        years: 5,
        status: "shortlisted",
        email: "michael.chen@email.com",
        phone: "(555) 345-6789",
        jobTitle: "Product Manager",
        skills: ["Product Strategy", "Agile", "Data Analysis"],
        extraSkillsCount: 1,
    },
];

function statusClasses(status: Status) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "reviewing":
            return "bg-blue-100 text-blue-700";
        case "shortlisted":
            return "bg-green-100 text-green-700";
        case "rejected":
            return "bg-red-100 text-red-700";
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

export default function ApplicantsCardsSection() {
    const onView = (id: string) => console.log("view", id);
    const onDownload = (id: string) => console.log("download", id);

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {applicants.map((a) => (
                    <div
                        key={a.id}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        {/* Top */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-sm font-semibold text-white">
                                    {a.initials}
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {a.name}
                                    </div>
                                    <div className="text-sm text-gray-500">{a.years} years</div>
                                </div>
                            </div>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-medium ${statusClasses(
                                    a.status
                                )}`}
                            >
                                {a.status}
                            </span>
                        </div>

                        {/* Contact */}
                        <div className="mt-6 space-y-3">
                            <InfoRow icon={<Mail className="h-4 w-4" />} text={a.email} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} text={a.phone} />
                        </div>

                        {/* Applied for */}
                        <div className="mt-6 space-y-2">
                            <div className="text-sm text-gray-700">Applied for</div>
                            <div className="text-sm font-medium text-gray-900">
                                {a.jobTitle}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-6">
                            <div className="text-sm text-gray-700">Skills</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {a.skills.map((s) => (
                                    <Chip key={s}>{s}</Chip>
                                ))}
                                {a.extraSkillsCount ? (
                                    <Chip>+{a.extraSkillsCount}</Chip>
                                ) : null}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-6 h-px w-full bg-gray-200/70" />

                        {/* Footer buttons */}
                        <div className="flex items-center gap-3">
                            <ApplicantDetailsDialog
                                applicant={applicant}
                                onReject={(id) => console.log("Reject", id)}
                                onReviewLater={(id) => console.log("Review later", id)}
                                onShortlist={(id) => console.log("Shortlist", id)}
                                onDownloadResume={(id) => console.log("Download resume", id)}
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
                                onClick={() => onDownload(a.id)}
                                className="inline-flex h-11 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                aria-label="Download"
                                title="Download"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
