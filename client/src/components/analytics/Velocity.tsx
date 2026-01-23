import React from "react";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import CountUp from "../countUp/CoutUp";
import { AnalyticsExportService } from "../../services/analytics/ExportToPDF";

interface VelocityAnalyticsProps {
    project: ProjectDTO;
    value: number | null;
    loading?: boolean;
}

export const VelocityAnalytics: React.FC<VelocityAnalyticsProps> = ({
    project,
    value,
    loading = false,
}) => {
    const isLoading = loading || value === null;

    return (
        <section className="flex flex-col items-center justify-center gap-4 p-6 ">
            <h2 className="text-2xl md:text-3xl text-white/80 font-semibold text-center">
                Team Velocity
            </h2>

            {isLoading ? (
                <p className="text-white/50">Loading velocity...</p>
            ) : (
                <span className="text-6xl md:text-7xl font-bold text-white">
                    <CountUp
                        from={0}
                        to={value ?? 0}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                    />
                    h
                </span>
            )}



            <p className="text-white/60 text-center">
                Average team hours spent per sprint across completed sprints.
            </p>

            {!isLoading && (
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                    onClick={() => AnalyticsExportService.exportVelocity({ project, value: value! })}
                >
                    Export to PDF
                </button>
            )}
        </section>
    );
};