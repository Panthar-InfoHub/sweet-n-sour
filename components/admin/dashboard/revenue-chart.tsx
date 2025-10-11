"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOCK_REVENUE_DATA } from "@/utils/constants";

export function RevenueChart() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={MOCK_REVENUE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4a7c59"
            strokeWidth={2}
            dot={{ fill: "#4a7c59" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
