"use client";

import { Briefcase, Clock3, TrendingUp, Users } from "lucide-react";
import React from "react";
import JobPerformanceChart from "~/_components/employer/JobPerformanceChart";
import RecentApplicantsTable from "~/_components/employer/RecentApplicantsTable";
import Container from "~/_components/global/Container";
import { Text } from "~/_components/global/Text";

function EmployerPage() {

  type Stat = {
    label: string;
    value: string;
    icon: React.ReactNode;
    iconBg: string;
    valueColor: string;
  };

  const stats: Stat[] = [
    {
      label: "Active Jobs",
      value: "+2",
      icon: <Briefcase className="h-5 w-5 text-white" />,
      iconBg: "bg-[#2B7FFF]",
      valueColor: "text-green-500",
    },
    {
      label: "Total Applicants",
      value: "+12",
      icon: <Users className="h-5 w-5 text-white" />,
      iconBg: "bg-[#00C950]",
      valueColor: "text-green-500",
    },
    {
      label: "Pending Reviews",
      value: "+5",
      icon: <Clock3 className="h-5 w-5 text-white" />,
      iconBg: "bg-[#F0B100]",
      valueColor: "text-green-500",
    },
    {
      label: "Shortlisted",
      value: "+3",
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      iconBg: "bg-[#AD46FF]",
      valueColor: "text-green-500",
    },
  ];

  type Action = {
    label: string;
    variant: "primary" | "outline";
    onClick?: () => void;
  };

  const actions: Action[] = [
    { label: "Post New Job", variant: "primary" },
    { label: "View All Jobs", variant: "outline" },
    { label: "Review Applicants", variant: "outline" },
    { label: "Analytics Report", variant: "outline" },
  ];

  return (
    <Container>
      <section className="w-full">
        <div className="mb-4">
          <h2 className="text-md text-gray-700">
            Welcome back, <span className="font-semibold">TechCorp</span>
          </h2>
          <p className="text-sm text-gray-500">Recruiter</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              {/* value top-right */}
              <div className={`absolute right-5 top-5 text-sm md:text-md font-bold ${s.valueColor}`}>
                {s.value}
              </div>

              {/* icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                {s.icon}
              </div>

              {/* label */}
              <div className="mt-4 text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 flex max-md:flex-col gap-4 items-stretch">
        <div className="flex-1 h-full">
          <JobPerformanceChart />
        </div>
        <div className="w-full md:max-w-[300px] h-full">
          <div className="w-full md:max-w-[300px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-800">Quick Actions</h3>

            <div className="mt-5 space-y-3">
              {actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className={
                    a.variant === "primary"
                      ? "w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      : "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 mt-4">
        <div className="mx-auto">
          <RecentApplicantsTable />
        </div>
      </section>
    </Container>
  );
}

export default EmployerPage;
