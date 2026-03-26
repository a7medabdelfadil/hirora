"use client";

import { Activity, Briefcase, Building2, Users } from "lucide-react";
import React from "react";
import AdminChartsSection from "~/_components/admin/AdminChartsSection";
import ApplicationStatusSection from "~/_components/admin/ApplicationStatusSection";
import Container from "~/_components/global/Container";
import { useAdminDashboard } from "~/APIs/hooks/useAdmin";
import { Skeleton } from "~/components/ui/skeleton";

function AdminPage() {
  type Stat = {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconWrap: string;
  };

  const { data, isLoading, isError } = useAdminDashboard();

  const stats: Stat[] = [
    {
      label: "Total Companies",
      value: data?.companiesCount ?? 0,
      icon: <Building2 className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#2B7FFF]",
    },
    {
      label: "Active Jobs",
      value: data?.activeJobsCount ?? 0,
      icon: <Briefcase className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#00C950]",
    },
    {
      label: "Total Job Seekers",
      value: data?.jobseekersCount ?? 0,
      icon: <Users className="h-5 w-5 text-white" />,
      iconWrap: "bg-[#AD46FF]",
    },
    {
      label: "Total Applicants",
      value: data?.applicationsCount ?? 0,
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

        {isError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load dashboard data.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconWrap}`}
              >
                {s.icon}
              </div>

              <div className="mt-6 text-sm text-gray-700">{s.label}</div>

              <div className="mt-2 text-3xl font-semibold text-gray-900">
                {isLoading ? (
                  <Skeleton className="h-9 w-20 rounded-md" />
                ) : (
                  s.value
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <AdminChartsSection
          monthlyApplications={data?.monthlyApplications ?? []}
          jobsByCategory={data?.jobsByCategory ?? []}
          isLoading={isLoading}
        />
      </section>

      <section className="mb-10 mt-4">
        <ApplicationStatusSection
          statusBreakdown={data?.statusBreakdown ?? []}
          isLoading={isLoading}
        />
      </section>
    </Container>
  );
}

export default AdminPage;