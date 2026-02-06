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
import { AnalyticsExportService } from "../../services/analytics/ExportToPDF";
import ExportButton from "./ExportButton";

const formatMoney = (n: number) => `${n.toFixed(2)} ¥`;

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
    { name: "Planned Budget", value: data.allowed_budget, color: "rgba(96, 165, 250, 0.6)" }, // #60A5FA
    { name: "Actual Cost", value: data.total_spent, color: "rgba(74, 222, 128, 0.6)" },    // #4ADE80
    {
      name: "Remaining Budget",
      value: data.remaining_budget,
      color:
        data.remaining_budget >= 0
          ? "rgba(250, 204, 21, 0.6)"   // #FACC15
          : "rgba(248, 113, 113, 0.6)", // #F87171
    },
  ];


  const allValues = chartData.map((d) => d.value);
  const maxValue = Math.max(...allValues) * 1.2;
  const minValue = Math.min(...allValues, 0) * 1.2;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-[430px]">
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
              cursor={{ fill: "rgba(255,255,255,0.07)" }}
              contentStyle={{
                background: "rgba(231, 233, 241, 0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "rgba(0, 0, 0, 0.85)" }}
              formatter={(value: any) => {
                return [formatMoney(Number(value)), "Cost"];
              }}
            />
            <Bar dataKey="value" activeBar={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data && (
        <ExportButton
          onClick={() => AnalyticsExportService.exportBudget({ project, data })}
          label="Export Budget Tracking for this project"
          classname="ml-6 mr-6"
        />
      )}

    </div>
  );
};
