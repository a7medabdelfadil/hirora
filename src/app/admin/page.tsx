"use client";

import { Activity, Briefcase, Building2, Users } from "lucide-react";
import React from "react";
import AdminChartsSection from "~/_components/admin/AdminChartsSection";
import ApplicationStatusSection from "~/_components/admin/ApplicationStatusSection";
import Container from "~/_components/global/Container";
import { Text } from "~/_components/global/Text";

function AdminPage() {
  type Stat = {
    label: string;
    change: string;
    icon: React.ReactNode;
    iconWrap: string;
  };

  const stats: Stat[] = [
    {
      label: "Total Companies",
      change: "+12%",
      icon: <Building2 className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#2B7FFF]",
    },
    {
      label: "Active Jobs",
      change: "+8%",
      icon: <Briefcase className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#00C950]",
    },
    {
      label: "Total Applicants",
      change: "+23%",
      icon: <Users className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#AD46FF]",
    },
    {
      label: "Total Jobs",
      change: "+5%",
      icon: <Activity className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#FF6900]",
    },
  ];
  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Overview of your job portal system
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* % top-right */}
              <div className="absolute right-6 top-6 inline-flex items-center gap-2 text-md font-medium text-green-600">
                {/* small trending icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-green-600"
                >
                  <path
                    d="M3 17l6-6 4 4 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 8h6v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {s.change}
              </div>

              {/* icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconWrap}`}
              >
                {s.icon}
              </div>

              {/* label */}
              <div className="mt-6 text-sm text-gray-700">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-4">
         <AdminChartsSection />
      </section>
      <section className="mt-4 mb-10">
          <ApplicationStatusSection />
      </section>
    </Container>
  );
}

export default AdminPage;
