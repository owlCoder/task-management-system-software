import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";

interface ResourceCostAllocationProps {
  project: ProjectDTO;
  data: ResourceCostAllocationDto | null;
  loading?: boolean;
}

const formatMoney = (n: number) => `${n.toFixed(2)} ¥`;

export const ResourceCostAllocation: React.FC<ResourceCostAllocationProps> = ({
  project,
  data,
  loading = false,
}) => {
  if (!data) {
    return loading ? (
      <div className="text-white/50">Loading resource cost allocation...</div>
    ) : (
      <div className="text-white/50">No resource allocation data.</div>
    );
  }

  const resources = Array.isArray((data as any).resources) ? (data as any).resources : [];

  const total = resources.reduce((sum: number, r: any) => sum + Number(r.total_cost ?? 0), 0);

  // Optional: try to resolve user labels from selected project (if available)
  // This is defensive because we don't know your exact ProjectDTO structure.
  const userLabelMap = useMemo(() => {
    const m = new Map<number, string>();
    const anyProject = project as any;

    // If project contains members somewhere (example: project_users)
    const members = anyProject?.project_users || anyProject?.members || anyProject?.users;
    if (Array.isArray(members)) {
      for (const u of members) {
        const id = Number(u.user_id ?? u.id);
        if (!Number.isFinite(id)) continue;
        const label =
          u.username ||
          u.user_name ||
          u.name ||
          u.email ||
          `User #${id}`;
        m.set(id, String(label));
      }
    }
    return m;
  }, [project]);

  const chartData = resources
    .map((r: any) => {
      const userId = Number(r.user_id);
      const cost = Number(r.total_cost ?? 0);
      const label = userLabelMap.get(userId) ?? `User #${userId}`;
      const percent = total > 0 ? (cost / total) * 100 : 0;

      return {
        userId,
        name: label,
        cost,
        percent,
      };
    })
    .sort((a: any, b: any) => b.cost - a.cost);

  const top3Ids = new Set(chartData.slice(0, 3).map((x: any) => x.userId));

  return (
    <div className="flex flex-col gap-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">Contributors</p>
          <p className="text-xl font-semibold text-white">{chartData.length}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">Total allocated cost</p>
          <p className="text-xl font-semibold text-white">{formatMoney(total)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-white/60">Highest cost</p>
          <p className="text-xl font-semibold text-white">
            {chartData.length ? formatMoney(chartData[0].cost) : formatMoney(0)}
          </p>
          <p className="text-sm text-white/50 mt-1">
            {chartData.length ? chartData[0].name : "—"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3">Resource cost allocation</h3>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#55555533" />
              <XAxis
                type="number"
                stroke="white"
                tick={{ fill: "white" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="white"
                tick={{ fill: "white" }}
                width={140}
              />
              <Tooltip
                formatter={(value: any, name: any, props: any) => {
                  if (name === "cost") return formatMoney(Number(value));
                  return value;
                }}
                labelFormatter={(label: any) => String(label)}
              />
              <Bar dataKey="cost" radius={[12, 12, 12, 12]}>
                {chartData.map((entry: any) => (
                  <Cell
                    key={entry.userId}
                    fill={
                        top3Ids.has(entry.userId)
                        ? "rgba(96, 165, 250, 0.6)"   // #60A5FA @ 60%
                        : "rgba(255,255,255,0.25)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2 max-h-[160px] overflow-auto pr-1">
          {chartData.map((x: any, idx: number) => (
            <div
              key={x.userId}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: top3Ids.has(x.userId) ? "#60A5FA" : "rgba(255,255,255,0.25)" }}
                />
                <span className="text-white/90 font-medium">{x.name}</span>
                {idx < 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/70">
                    Top {idx + 1}
                  </span>
                )}
              </div>

              <div className="text-right">
                <div className="text-white font-semibold">{formatMoney(x.cost)}</div>
                <div className="text-white/50 text-sm">{x.percent.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
