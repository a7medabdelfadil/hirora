"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { role: "Senior Full Stack De...", applicants: 45 },
  { role: "Product Manager", applicants: 32 },
  { role: "UX/UI Designer", applicants: 52 },
  { role: "Data Scientist", applicants: 35 },
  { role: "Devops Engineer", applicants: 29 },
];

function WrappedTick(props: any) {
  const { x, y, payload } = props;
  const value: string = payload?.value ?? "";

  const words = value.replace("...", "").split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={10}
        textAnchor="middle"
        fill="#6B7280"
        fontSize={11}
      >
        <tspan x="0" dy="0">
          {line1}
        </tspan>
        {line2 ? (
          <tspan x="0" dy="14">
            {line2}
          </tspan>
        ) : null}
      </text>
    </g>
  );
}

export default function JobPerformanceChart() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">Job Performance</h3>
      </div>

      <div className="mt-6 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 28 }}
            barCategoryGap={18}
          >
            <CartesianGrid strokeDasharray="3 3" vertical />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />

            <XAxis
              dataKey="role"
              interval={0}
              height={34}
              tickMargin={8}
              tick={<WrappedTick />}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(16,185,129,0.08)" }}
              contentStyle={{
                borderRadius: 10,
                borderColor: "#E5E7EB",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#111827" }}
            />

            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingBottom: 8 }}
            />

            <Bar dataKey="applicants" fill="#10B981" maxBarSize={70} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
