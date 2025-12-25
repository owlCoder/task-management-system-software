import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { AnalyticsTab } from "../enums/AnalyticsTabs";
import { ProjectDTO } from "../models/project/ProjectDTO";
import { projectAPI } from "../api/project/ProjectAPI";
import { BurndownAnalytics } from "../components/analytics/Burndown";

const TABS: { id: AnalyticsTab; label: string }[] = [
    { id: "BURNDOWN", label: "Burndown" },
    { id: "BURNUP", label: "Burnup" },
    { id: "VELOCITY", label: "Velocity" },
    { id: "BUDGET", label: "Budget" },
    { id: "PROFIT", label: "Profit Margin" },
    { id: "RESOURCES", label: "Resources" },
];

export const AnalyticsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("BURNDOWN");
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(null);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectAPI.getAllProjects();
                setProjects(data);
                if (data.length > 0) {
                    setSelectedProjectId(data[0].id); // default prvi projekat
                    setSelectedProject(data[0]);
                }
            } catch (err) {
                console.error("Failed to load projects", err);
            } finally {
                setLoadingProjects(false);
            }
        };

        loadProjects();
    }, []);



    return (
        <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
            <Sidebar />

            <main className="flex-1 p-6">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Analytics
                    </h1>
                </header>

                {/* PROJECT SELECTOR */}
                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 items-center justify-center">
                        <span className="text-white/70 font-semibold">
                            Selected project:
                        </span>

                        {loadingProjects ? (
                            <div className="text-white/40">Loading projects...</div>
                        ) : (
                            <select
                                value={selectedProjectId ?? ""}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value)
                                    setSelectedProject(projects.find(p => p.id === selectedProjectId)!)
                                }}
                                className="w-full sm:w-[320px] bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-medium-blue)] transition-all">
                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                        className="bg-[#020617] text-white"
                                    >
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </section>

                {/* TAB CARDS */}
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {TABS.map((tab) => {
                        const active = tab.id === activeTab;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-2xl p-4 text-center font-semibold transition-all duration-300 border border-white/10 backdrop-blur-xl
                                    ${active ? "bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white shadow-lg scale-[1.03]" : "bg-white/5 text-white/60 hover:text-white hover:-translate-y-1"}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </section>

                {/* CONTENT CARD */}
                <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 min-h-[500px]">
                    {activeTab === "BURNDOWN" &&
                        <div>
                            {selectedProjectId ?
                                <BurndownAnalytics project={selectedProject!} token={""} /> : "Select project..."}
                        </div>}
                    {activeTab === "BURNUP" && <div>TODO: Burnup analytics</div>}
                    {activeTab === "VELOCITY" && <div>TODO: Velocity tracking</div>}
                    {activeTab === "BUDGET" && <div>TODO: Budget analytics</div>}
                    {activeTab === "PROFIT" && <div>TODO: Profit margin analytics</div>}
                    {activeTab === "RESOURCES" && <div>TODO: Resource cost analytics</div>}
                </section>
            </main>
        </div>
    );
};

export default AnalyticsPage;
