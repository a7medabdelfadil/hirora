"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type StatusRow = {
  name: string;
  value: number;
  color: string;
};

const statuses: StatusRow[] = [
  { name: "Pending", value: 45, color: "#3B82F6" },     // blue
  { name: "Reviewing", value: 38, color: "#10B981" },   // green
  { name: "Shortlisted", value: 22, color: "#F59E0B" }, // orange
  { name: "Accepted", value: 15, color: "#EF4444" },    // red
  { name: "Rejected", value: 18, color: "#8B5CF6" },    // purple
];

const total = statuses.reduce((sum, s) => sum + s.value, 0);
const maxValue = Math.max(...statuses.map((s) => s.value));

function percent(value: number) {
  return Math.round((value / total) * 100);
}

export default function ApplicationStatusSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[550px_1fr]">
        {/* Left: Pie */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Application Status
          </h3>

          <div className="mt-6 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statuses}
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
                  {statuses.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(v: any, n: any) => [`${v} applicants`, n]}
                  contentStyle={{
                    borderRadius: 10,
                    borderColor: "#E5E7EB",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Status Breakdown</h3>

          <div className="mt-6 space-y-5">
            {statuses.map((s) => {
              const pct = (s.value / maxValue) * 100;

              return (
                <div key={s.name} className="w-full">
                  {/* Mobile: stacked | Desktop: 3 columns */}
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_90px_1fr] sm:items-center sm:gap-6">
                    {/* left label */}
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-4 w-4 shrink-0 rounded-md"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="truncate text-sm text-gray-800">{s.name}</span>
                    </div>

                    {/* middle count */}
                    <div className="text-sm leading-5 text-gray-900 sm:text-right">
                      <div className="font-medium">{s.value}</div>
                      <div className="text-gray-500">applicants</div>
                    </div>

                    {/* right bar */}
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
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
