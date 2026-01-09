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

const monthlyData = [
  { month: "Jun", applications: 45 },
  { month: "Jul", applications: 62 },
  { month: "Aug", applications: 78 },
  { month: "Sep", applications: 85 },
  { month: "Oct", applications: 95 },
  { month: "Nov", applications: 115 },
];

const categoryData = [
  { category: "Engineering", count: 36 },
  { category: "Product", count: 15 },
  { category: "Design", count: 12 },
  { category: "Marketing", count: 18 },
  { category: "Finance", count: 10 },
  { category: "Healthcare", count: 8 },
  { category: "Data Science", count: 14 },
];

export default function AdminChartsSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Line chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Monthly Applications Trend
          </h3>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#9CA3AF" }}
                  tickLine={{ stroke: "#9CA3AF" }}
                />
                <YAxis
                  domain={[0, 120]}
                  ticks={[0, 30, 60, 90, 120]}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#9CA3AF" }}
                  tickLine={{ stroke: "#9CA3AF" }}
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Bar chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Jobs by Category</h3>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
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
                  domain={[0, 36]}
                  ticks={[0, 9, 18, 27, 36]}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#9CA3AF" }}
                  tickLine={{ stroke: "#9CA3AF" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    borderColor: "#E5E7EB",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 18 }} />
                <Bar dataKey="count" fill="#3B82F6" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
