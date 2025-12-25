import React, { useEffect, useState } from "react";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getMockBurnupBySprint } from "../../mocks/BurnupMock";

//DA BI RADILO POTREBNO JE INSTALIRATI npm install recharts

interface BurnupAnalyticsProps {
    project: ProjectDTO;
}

export const BurnupAnalytics: React.FC<BurnupAnalyticsProps> = ({ project }) => {
    const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
    const [data, setData] = useState<BurnupDto | null>(null);

    // default kada se promeni projekat
    useEffect(() => {
        setSelectedSprintId(null);
        setData(null);
    }, [project]);

    // load mock data kada se izabere sprint
    useEffect(() => {
        if (!selectedSprintId) return;
        const mockData = getMockBurnupBySprint(selectedSprintId);
        setData(mockData);
    }, [selectedSprintId]);

    return (
        <div className="flex flex-col gap-4">
            {/* Sprint selector */}
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
                    {Array.from({ length: project.numberOfSprints! }, (_, i) => {
                        const sprintNumber = i + 1;
                        return (
                            <option
                                key={sprintNumber}
                                value={sprintNumber}
                                className="text-black" // kao Burndown
                            >
                                Sprint {sprintNumber}
                            </option>
                        );
                    })}
                </select>
            </div>


            {/* Burnup chart */}
            {data && (
                <div className="w-full h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.points} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#55555533" />
                            <XAxis
                                dataKey="x"
                                ticks={data.points
                                    .filter((_, i) => i % Math.ceil(data.points.length / 10) === 0)
                                    .map((p) => p.x)} // uzimamo samo 10 tickova ravnomerno raspoređenih
                                label={{ value: "Days", position: "insideBottom", offset: -10, fill: "white" }}
                                stroke="white"
                            />
                            <YAxis
                                label={{ value: "Work Completed", angle: -90, position: "insideLeft", fill: "white" }}
                                stroke="white"
                            />
                            <Tooltip />
                            <Line type="monotone" dataKey="y" stroke="#4ade80" strokeWidth={3} dot />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
