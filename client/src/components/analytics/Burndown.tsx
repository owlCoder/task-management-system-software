import React from "react";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { TaskProgress } from "./TaskProgress";
import { AnalyticsExportService } from "../../services/analytics/ExportToPDF";
import ExportButton from "./ExportButton";

type SprintOption = {
    sprint_id: number;
    sprint_title?: string;
};

interface BurndownAnalyticsProps {
    project: ProjectDTO;
    data: BurndownDto | null;
    loading?: boolean;

    // Sprint selector kontrolisan spolja (AnalyticsPage)
    sprintId: number | null;
    sprints: SprintOption[];
    onSprintChange: (id: number | null) => void;
}

export const BurndownAnalytics: React.FC<BurndownAnalyticsProps> = ({
    project,
    data,
    loading = false,
    sprintId,
    sprints,
    onSprintChange,
}) => {
    return (
        <div className="flex flex-col gap-6">
            {/* SPRINT SELECTOR */}
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
                    {/* Default placeholder */}
                    <option value="" disabled className="bg-[#020617] text-white">
                        No Selected Sprint...
                    </option>

                    {/* Sprint options */}
                    {sprints.map((s) => (
                        <option
                            key={s.sprint_id}
                            value={s.sprint_id}
                            className="bg-[#020617] text-white"
                        >
                            {s.sprint_title ? s.sprint_title : `Sprint ${s.sprint_id}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* BURNDOWN DATA */}
            {loading && <div className="text-white/50">Loading burndown...</div>}

            {!loading && sprintId && !data && (
                <div className="text-white/50">No data for selected sprint.</div>
            )}
            <div className="flex flex-col">

                {!loading && data && (
                    <div className="flex-1 overflow-y-auto styled-scrollbar max-h-[370px] flex flex-col gap-4">
                        {data.tasks.map((task) => (
                            <TaskProgress
                                key={task.task_id}
                                task_id={task.task_id}
                                task_name={task.task_name}
                                ideal={task.ideal_progress}
                                real={task.real_progress}
                            />
                        ))}
                    </div>
                )}

                <ExportButton onClick={() => data && AnalyticsExportService.exportBurndown({ project, data, sprintId: sprintId!, sprintName: sprints.find(s => s.sprint_id === sprintId)?.sprint_title })} label="Export Burndown Analytics for this project" classname="mt-7 ml-4 mr-4" />
            </div>
        </div>
    );
};