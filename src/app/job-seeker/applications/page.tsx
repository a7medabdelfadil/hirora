import { HiOutlineDocumentText, HiOutlineFilter, HiOutlineTrendingUp } from "react-icons/hi";
import { FiClock, FiSearch } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { HiOutlineXCircle } from "react-icons/hi";
import Container from "~/_components/global/Container";
import Link from "next/link";

export default function Applications() {
    const cards = [
        {
            label: "Total Applied",
            value: 0,
            iconBg: "bg-blue-600",
            Icon: HiOutlineDocumentText,
        },
        {
            label: "In Review",
            value: 0,
            iconBg: "bg-amber-500",
            Icon: FiClock,
        },
        {
            label: "Shortlisted",
            value: 0,
            iconBg: "bg-emerald-500",
            Icon: HiOutlineCheckCircle,
        },
        {
            label: "Rejected",
            value: 0,
            iconBg: "bg-red-500",
            Icon: HiOutlineXCircle,
        },
    ];

    return (
        <Container>
            <section className="w-full">
                <div className="mx-auto px-4 py-6">
                    <p className="mb-6 text-xl text-slate-700">
                        Track and manage your job applications
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map(({ label, value, iconBg, Icon }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
                                    >
                                        <span className="text-base font-semibold text-white">
                                            {value}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-700">
                                            {label}
                                        </p>
                                    </div>

                                    {/* Optional icon on right (if you want it like the style) */}
                                    <div className="ml-auto hidden sm:block text-slate-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="w-full">
                <div className="mx-auto px-4 py-6">
                    {/* Top search/filter bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Search applications..."
                                />
                            </div>

                            {/* Status select */}
                            <HiOutlineFilter className="h-5 w-5 text-[#99A1AF] max-md:hidden" />
                            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 md:w-44">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Reviewing</option>
                                <option>Shortlisted</option>
                                <option>Accepted</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Empty state card */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            <HiOutlineTrendingUp className="h-7 w-7 text-slate-500" />
                        </div>

                        <h3 className="mt-5 text-md font-semibold text-slate-900">
                            No applications yet
                        </h3>

                        <p className="mt-2 text-md text-slate-500">
                            Start applying to jobs to track your applications here
                        </p>

                        <Link
                            href="/job-seeker/find-jobs"
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#9810FA] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>
        </Container>

    );
}
