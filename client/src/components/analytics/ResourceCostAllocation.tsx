import React from "react";
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
import { AnalyticsExportService } from "../../services/analytics/ExportToPDF";
import ExportButton from "./ExportButton";

interface ResourceCostAllocationProps {
  project: ProjectDTO;
  data: ResourceCostAllocationDto | null;
  loading?: boolean;
  usernamesById?: Record<number, string>;
}

const formatMoney = (n: number) => `${n.toFixed(2)} ¥`;

export const ResourceCostAllocation: React.FC<ResourceCostAllocationProps> = ({
  project,
  data,
  loading = false,
  usernamesById = {},
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

  // Resolve labels from project members (best effort)
  // const userLabelMap = useMemo(() => {
  //   const m = new Map<number, string>();
  //   const anyProject = project as any;

  //   const members = anyProject?.project_users || anyProject?.members || anyProject?.users;
  //   if (Array.isArray(members)) {
  //     for (const u of members) {
  //       const id = Number(u.user_id ?? u.id);
  //       if (!Number.isFinite(id)) continue;

  //       const label =
  //         u.username ||
  //         u.user_name ||
  //         u.name ||
  //         u.full_name ||
  //         u.email ||
  //         null;

  //       if (label) m.set(id, String(label));
  //     }
  //   }
  //   return m;
  // }, [project]);

  const chartData = resources
    .map((r: any) => {
      const userId = Number(r.user_id);
      const cost = Number(r.total_cost ?? 0);
      const percent = total > 0 ? (cost / total) * 100 : 0;

      const label = (usernamesById && usernamesById[userId]) ? usernamesById[userId] : `User ${userId}`;
      return { userId, name: label, cost, percent };
    })
    .sort((a: any, b: any) => b.cost - a.cost);

  return (
    <div className="flex flex-col gap-4">
      {/* Keep everything inside the existing "glass" card */}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Resource cost allocation</h3>
        <div className="text-white/70 text-sm">
          Total: <span className="text-white font-semibold">{formatMoney(total)}</span>
        </div>
      </div>

      {/* Chart: fixed height so it never pushes outside */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 16, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#55555533" />
            <XAxis type="number" stroke="white" tick={{ fill: "white" }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="white"
              tick={{ fill: "white" }}
              width={140}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(231, 233, 241, 0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "rgba(0, 0, 0, 0.85)" }}
              formatter={(value: any, name: any, props: any) => {
                // value is "cost"
                return [formatMoney(Number(value)), "Cost"];
              }}
            />
            <Bar dataKey="cost" radius={[12, 12, 12, 12]}>
              {chartData.map((entry: any) => (
                <Cell
                  key={entry.userId}
                  // uniform look (no top3 highlighting)
                  fill={"rgba(96, 165, 250, 0.6)"} // blue-400 @ 60%
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* List: scroll INSIDE card */}
      <div className="mt-3 max-h-[150px] overflow-auto pr-1">
        <div className="space-y-2">
          {chartData.map((x: any) => (
            <div
              key={x.userId}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(96, 165, 250, 0.6)" }}
                />
                {/* prevent overflow of long names */}
                <span className="text-white/90 font-medium truncate">
                  {x.name}
                </span>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-white font-semibold">{formatMoney(x.cost)}</div>
                <div className="text-white/50 text-sm">{x.percent.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {data && (
        <ExportButton
          onClick={() => AnalyticsExportService.exportResources({ project, data, usernamesById  })}
          label="Export Resource Cost Allocation for this project"
          classname="ml-4 mr-4"
        />
      )}
    </div>
  );
};
