import React from "react";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { AnalyticsExportService } from "../../services/analytics/ExportToPDF";
import ExportButton from "./ExportButton";

type SprintOption = {
    sprint_id: number;
    sprint_title?: string;
};

interface BurnupAnalyticsProps {
    project: ProjectDTO;
    data: BurnupDto | null;
    loading?: boolean;
    sprintId: number | null;
    sprints: SprintOption[];
    onSprintChange: (id: number | null) => void;
}

export const BurnupAnalytics: React.FC<BurnupAnalyticsProps> = ({
    project,
    data,
    loading = false,
    sprintId,
    sprints,
    onSprintChange,
}) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Sprint selector */}
            <div className="flex items-center gap-4">
                <span className="text-white/70 font-semibold">Sprint:</span>

                <select
                    value={sprintId ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        onSprintChange(val === "" ? null : Number(val));
                    }}
                    className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-medium-blue)]"
                >
                    <option value="" disabled className="bg-[#020617] text-white">
                        No Selected Sprint...
                    </option>

                    {sprints.map((s) => (
                        <option
                            key={s.sprint_id}
                            value={s.sprint_id}
                            className="bg-[#020617] text-white"
                        >
                            {s.sprint_title ?? `Sprint ${s.sprint_id}`}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div className="text-white/50">Loading burnup...</div>}

            {!loading && sprintId && !data && (
                <div className="text-white/50">No data for selected sprint.</div>
            )}

            {/* Burnup chart */}
            {!loading && data && (
                <div className="w-full h-[390px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data.points}
                            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />

                            <XAxis
                                dataKey="x"
                                stroke="white"
                                label={{
                                    value: "Days",
                                    position: "insideBottom",
                                    offset: -10,
                                    fill: "white",
                                }}
                            />

                            <YAxis
                                stroke="white"
                                label={{
                                    value: "Work Completed",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: "white",
                                }}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #ffffff22",
                                    color: "white",
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="y"
                                stroke="#4ade80"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <ExportButton
                onClick={() => data && AnalyticsExportService.exportBurnup({ project, data, sprintId: sprintId! })}
                label="Export Burnup Analytics for this project"
                classname="ml-6 mr-6"
            />


        </div>
    );
};
