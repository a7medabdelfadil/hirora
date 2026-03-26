"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Skeleton } from "~/components/ui/skeleton";

type StatusBreakdownItem = {
  _id: string;
  count: number;
};

type StatusRow = {
  name: string;
  value: number;
  color: string;
};

type ApplicationStatusSectionProps = {
  statusBreakdown: StatusBreakdownItem[];
  isLoading?: boolean;
};

const statusColors: Record<string, string> = {
  pending: "#3B82F6",
  reviewing: "#10B981",
  shortlisted: "#F59E0B",
  accepted: "#EF4444",
  rejected: "#8B5CF6",
};

function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function ApplicationStatusSection({
  statusBreakdown,
  isLoading = false,
}: ApplicationStatusSectionProps) {
  type StatusRow = {
    name: string;
    value: number;
    color: string;
  };

  const order = ["pending", "reviewing", "shortlisted", "accepted", "rejected"] as const;

  type StatusKey = (typeof order)[number];

  const statusColors: Record<StatusKey, string> = {
    pending: "#3B82F6",
    reviewing: "#10B981",
    shortlisted: "#F59E0B",
    accepted: "#EF4444",
    rejected: "#8B5CF6",
  };

  const statuses: StatusRow[] = React.useMemo(() => {
    return order.map((status) => {
      const found = statusBreakdown.find((item) => item._id === status);

      return {
        name: formatStatusLabel(status),
        value: found?.count ?? 0,
        color: statusColors[status],
      };
    });
  }, [statusBreakdown]);

  const total = statuses.reduce((sum, s) => sum + s.value, 0);
  const maxValue = Math.max(...statuses.map((s) => s.value), 0);

  function percent(value: number) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[550px_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Application Status
          </h3>

          <div className="mt-6 h-[320px] w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : total === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                No application status data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statuses.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="55%"
                    outerRadius={110}
                    innerRadius={0}
                    paddingAngle={0}
                    stroke="#FFFFFF"
                    strokeWidth={1}
                    labelLine={false}
                    label={({ name, value }) => `${name} ${percent(value)}%`}
                  >
                    {statuses
                      .filter((item) => item.value > 0)
                      .map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                  </Pie>

                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    formatter={(value, name) => [`${value ?? 0} applicants`, name]}
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "#E5E7EB",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Status Breakdown</h3>

          <div className="mt-6 space-y-5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="w-full">
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_90px_1fr] sm:items-center sm:gap-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="sm:text-right">
                      <Skeleton className="ml-auto h-4 w-14" />
                      <Skeleton className="ml-auto mt-2 h-4 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              statuses.map((s) => {
                const pct = maxValue > 0 ? (s.value / maxValue) * 100 : 0;

                return (
                  <div key={s.name} className="w-full">
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_90px_1fr] sm:items-center sm:gap-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-4 w-4 shrink-0 rounded-md"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="truncate text-sm text-gray-800">
                          {s.name}
                        </span>
                      </div>

                      <div className="text-sm leading-5 text-gray-900 sm:text-right">
                        <div className="font-medium">{s.value}</div>
                        <div className="text-gray-500">applicants</div>
                      </div>

                      <div className="w-full">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: s.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}