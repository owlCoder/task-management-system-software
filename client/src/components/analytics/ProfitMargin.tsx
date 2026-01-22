import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";

interface ProfitMarginAnalyticsProps {
  project: ProjectDTO;
  data: ProfitMarginDto | null;
  loading?: boolean;
}

const formatMoney = (n: number) => `${n.toFixed(2)} ¥`;

export const ProfitMarginAnalytics: React.FC<ProfitMarginAnalyticsProps> = ({
  project,
  data,
  loading = false,
}) => {
  if (!data) {
    return loading ? (
      <div className="text-white/50">Loading profit margin...</div>
    ) : (
      <div className="text-white/50">No profit margin data.</div>
    );
  }

  const allowed = Number(data.allowed_budget ?? 0);
  const cost = Number(data.total_cost ?? 0);
  const profit = Number(data.profit ?? 0);
  const margin = Number(data.profit_margin_percentage ?? 0);

  // Donut wants non-negative slice values.
  // We visualize: Used (capped at allowed) and Remaining (>=0).
  // If cost exceeds allowed, "Remaining" is 0 and we show an "Over budget" badge.
  const used = Math.min(cost, Math.max(allowed, 0));
  const remaining = Math.max(allowed - used, 0);

  const overBudget = allowed > 0 && cost > allowed;

  const donutData =
    allowed > 0
      ? [
          { name: "Used", value: used },
          { name: "Remaining", value: remaining },
        ]
      : [
          // If allowed is 0, just show cost as a single slice to avoid weird chart.
          { name: "Cost", value: Math.max(cost, 0) || 1 },
        ];

  const COLORS =
    allowed > 0
      ? [
          "rgba(96, 165, 250, 0.6)",  // #60A5FA
          "rgba(250, 204, 21, 0.6)",  // #FACC15
        ]
      : ["rgba(248, 113, 113, 0.6)"]; // #F87171


  const marginColor =
    profit >= 0
      ? "rgba(74, 222, 128)"   // #4ADE80
      : "rgba(248, 113, 113, 0.6)"; // #F87171


  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">Allowed budget</p>
          <p className="text-xl font-semibold text-white">{formatMoney(allowed)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">Total cost</p>
          <p className="text-xl font-semibold text-white">{formatMoney(cost)}</p>
          {overBudget && (
            <p className="text-sm mt-1" style={{ color: "#F87171" }}>
              Over budget
            </p>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">{profit >= 0 ? "Profit" : "Loss"}</p>
          <p className="text-xl font-semibold" style={{ color: marginColor }}>
            {formatMoney(profit)}
          </p>
          <p className="text-sm mt-1 text-white/60">
            Margin:{" "}
            <span style={{ color: marginColor, fontWeight: 600 }}>
              {margin.toFixed(2)}%
            </span>
          </p>
        </div>
      </div>

      {/* Donut */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Profit margin tracking</h3>
          <span
            className="text-sm px-3 py-1 rounded-full border border-white/10"
            style={{
              color: marginColor,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {margin.toFixed(2)}%
          </span>
        </div>

        <div className="w-full h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "rgba(231, 233, 241, 0.92)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                }}
                labelStyle={{ color: "rgba(0, 0, 0, 0.85)" }}
                formatter={(value: any, name: any) => {
                  // name dolazi iz donutData.name
                  const label =
                    name === "Remaining"
                      ? "Remaining"
                      : "Spent";

                  return [formatMoney(Number(value)), label];
                }}
              />
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={allowed > 0 ? 3 : 0}
              >
                {donutData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx] ?? "#60A5FA"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-white/60 text-sm">Profit margin</p>
            <p className="text-3xl font-semibold" style={{ color: marginColor }}>
              {margin.toFixed(2)}%
            </p>
            {allowed > 0 && (
              <p className="text-white/50 text-sm mt-1">
                Used {((used / allowed) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
