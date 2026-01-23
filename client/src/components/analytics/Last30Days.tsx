import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { TimeSeriesPointDto } from "../../models/analytics/TimeSeriesPointDto";
import { formatDateRS } from "../../helpers/formatDateRS";

interface Props {
    projects: TimeSeriesPointDto[] | null;
    workers: TimeSeriesPointDto[] | null;
    loading: boolean;
}

export const Last30DaysAnalytics: React.FC<Props> = ({
    projects,
    workers,
    loading,
}) => {
    if (loading) {
        return <div className="text-white/60">Loading last 30 days analytics...</div>;
    }

    if (!projects || !workers) {
        return <div className="text-white/40">No data available.</div>;
    }

    return (<div className="grid">
        <span className="text-center items-center text-lg text-white/50 italic mt-2 mb-5">statistics of <strong>all</strong> projects and workers in the previous 30 days</span>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            {/* PROJECTS */}

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">
                    Projects started (last 30 days)
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projects}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" tickFormatter={formatDateRS} />
                        <YAxis stroke="rgba(255,255,255,0.6)" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* WORKERS */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">
                    Workers added (last 30 days)
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={workers}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" tickFormatter={formatDateRS} />
                        <YAxis stroke="rgba(255,255,255,0.6)" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
    );
};
