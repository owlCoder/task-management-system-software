import React, { useEffect, useState } from "react";
import { getMockVelocityForProject } from "../../mocks/VelocityMock";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import CountUp from "../countUp/CoutUp";

interface VelocityAnalyticsProps {
    project: ProjectDTO;
}

export const VelocityAnalytics: React.FC<VelocityAnalyticsProps> = ({ project }) => {
    const [velocity, setVelocity] = useState<number | null>(null);

    useEffect(() => {
        if (!project) return;

        // simulacija API call sa delay-om
        setVelocity(null); // reset pre učitavanja
        const timeout = setTimeout(() => {
            const vel = getMockVelocityForProject(Number(project.id));
            setVelocity(vel);
        }, 500);

        return () => clearTimeout(timeout);
    }, [project]);

    return (
        <section className="flex flex-col items-center justify-center gap-4 p-6 ">
            <h2 className="text-2xl md:text-3xl text-white/80 font-semibold text-center">
                Team Velocity
            </h2>

            {velocity === null ? (
                <p className="text-white/50">Loading velocity...</p>
            ) : (
                <span className="text-6xl md:text-7xl font-bold text-white">
                    <CountUp
                        from={0}
                        to={velocity}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                    />h
                </span>
            )}

            <p className="text-white/60 text-center">
                Average team hours spent per sprint across completed sprints.
            </p>
        </section>
    );
};
