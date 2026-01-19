import React from "react";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BudgetAnalyticsProps {
  project: ProjectDTO;
  data: BudgetTrackingDto | null;
  loading?: boolean;
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({
  project,
  data,
  loading = false,
}) => {
  if (!data) {
    return loading ? (
      <div className="text-white/50">Loading budget data...</div>
    ) : (
      <div className="text-white/50">No budget data.</div>
    );
  }

  const chartData = [
    { name: "Planned Budget", value: data.allowed_budget, color: "#3b82f6" },
    { name: "Actual Cost", value: data.total_spent, color: "#4ade80" },
    {
      name: "Remaining Budget",
      value: data.remaining_budget,
      color: data.remaining_budget >= 0 ? "#facc15" : "#ef4444",
    },
  ];

  const allValues = chartData.map((d) => d.value);
  const maxValue = Math.max(...allValues) * 1.2;
  const minValue = Math.min(...allValues, 0) * 1.2;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#55555533" />
            <XAxis dataKey="name" stroke="white" tick={{ fill: "white" }} />
            <YAxis
              stroke="white"
              tick={{ fill: "white" }}
              domain={[minValue, maxValue]}
            />
            <Tooltip
              formatter={(value: any) =>
                typeof value === "number" ? `${value.toFixed(2)} ¥` : value
              }
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
