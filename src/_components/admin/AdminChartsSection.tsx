"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Skeleton } from "~/components/ui/skeleton";

type MonthlyApplicationsItem = {
  _id: number;
  count: number;
};

type JobsByCategoryItem = {
  _id: string;
  count: number;
};

type AdminChartsSectionProps = {
  monthlyApplications: MonthlyApplicationsItem[];
  jobsByCategory: JobsByCategoryItem[];
  isLoading?: boolean;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlyData(monthlyApplications: MonthlyApplicationsItem[]) {
  const monthMap = new Map<number, number>();

  monthlyApplications.forEach((item) => {
    monthMap.set(item._id, item.count);
  });

  return Array.from({ length: 12 }, (_, index) => ({
    month: monthNames[index],
    applications: monthMap.get(index + 1) ?? 0,
  }));
}

function buildCategoryData(jobsByCategory: JobsByCategoryItem[]) {
  return jobsByCategory.map((item) => ({
    category: item._id,
    count: item.count,
  }));
}

export default function AdminChartsSection({
  monthlyApplications,
  jobsByCategory,
  isLoading = false,
}: AdminChartsSectionProps) {
  const monthlyData = React.useMemo(
    () => buildMonthlyData(monthlyApplications),
    [monthlyApplications],
  );

  const categoryData = React.useMemo(
    () => buildCategoryData(jobsByCategory),
    [jobsByCategory],
  );

  const monthlyMax = Math.max(...monthlyData.map((item) => item.applications), 0);
  const categoryMax = Math.max(...categoryData.map((item) => item.count), 0);

  const monthlyYAxisMax = Math.max(5, Math.ceil(monthlyMax / 5) * 5);
  const categoryYAxisMax = Math.max(5, Math.ceil(categoryMax / 5) * 5);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Monthly Applications Trend
          </h3>

          <div className="mt-4 h-72 w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#9CA3AF" }}
                    tickLine={{ stroke: "#9CA3AF" }}
                  />
                  <YAxis
                    domain={[0, monthlyYAxisMax]}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#9CA3AF" }}
                    tickLine={{ stroke: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "#E5E7EB",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 18 }} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Jobs by Category</h3>

          <div className="mt-4 h-72 w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#9CA3AF" }}
                    tickLine={{ stroke: "#9CA3AF" }}
                  />
                  <YAxis
                    domain={[0, categoryYAxisMax]}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#9CA3AF" }}
                    tickLine={{ stroke: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "#E5E7EB",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 18 }} />
                  <Bar dataKey="count" fill="#3B82F6" maxBarSize={50} name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}