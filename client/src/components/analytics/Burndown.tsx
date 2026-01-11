import React, { useEffect, useState } from "react";
import { AnalyticsAPI } from "../../api/analytics/AnalyticsAPI";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { ProjectDTO } from "../../models/project/ProjectDTO";
// ⬇⬇⬇ dodaj import
import { getMockBurndownBySprint } from "../../mocks/BurndownMock";
import { TaskProgress } from "./TaskProgress";

const USE_MOCK = true;

interface BurndownAnalyticsProps {
    project: ProjectDTO;
    token: string;
}

export const BurndownAnalytics: React.FC<BurndownAnalyticsProps> = ({
    project,
    token,
}) => {
    const analyticsAPI = new AnalyticsAPI(
        import.meta.env.VITE_GATEWAY_URL,
        token
    );

    const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
    const [data, setData] = useState<BurndownDto | null>(null);
    const [loading, setLoading] = useState(false);

    /* 1️⃣ Kada se promeni projekat → reset + default sprint */
    useEffect(() => {
        if (project.sprint_count! > 0) {
            setSelectedSprintId(null); // default: Sprint 1
            setData(null);
        }
    }, [project]);

    // deo za pristupanje bazi preko API
    // useEffect(() => {
    //     if (!selectedSprintId) return;

    //     const loadBurndown = async () => {
    //         setLoading(true);
    //         try {
    //             const result = await analyticsAPI.getBurndownAnalytics(
    //                 String(selectedSprintId)
    //             );
    //             setData(result);
    //         } catch (err) {
    //             console.error("Failed to load burndown analytics", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadBurndown();
    // }, [selectedSprintId]);

    useEffect(() => {
        if (!selectedSprintId) return;

        setLoading(true);
        try {
            const data = getMockBurndownBySprint(selectedSprintId);
            setData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedSprintId]);


    return (
        <div className="flex flex-col gap-6">
            {/* SPRINT SELECTOR */}
            <div className="flex items-center gap-4">
                <span className="text-white/70 font-semibold">Sprint:</span>

                <select
                    value={selectedSprintId ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedSprintId(val === "" ? null : Number(val));
                    }}
                    className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-medium-blue)]">
                    {/* Default placeholder */}
                    <option value="" disabled>
                        No Selected Sprint...
                    </option>

                    {/* Sprint options */}
                    {Array.from({ length: project.sprint_count! }, (_, i) => {
                        const sprintNumber = i + 1;
                        return (
                            <option key={sprintNumber} value={sprintNumber} className="bg-[#020617]">
                                Sprint {sprintNumber}
                            </option>
                        );
                    })}
                </select>
            </div>


            {/* BURNDOWN DATA */}
            {loading && <div className="text-white/50">Loading burndown...</div>}

            {!loading && data && (
                <div className="flex-1 overflow-y-auto max-h-[450px] flex flex-col gap-4">
                    {data.tasks.map((task) => (
                        <TaskProgress
                            key={task.task_id}
                            task_id={task.task_id}
                            ideal={task.ideal_progress}
                            real={task.real_progress}
                        />
                    ))}
                </div>

            )}
        </div>
    );
};
