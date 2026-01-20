import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { AnalyticsTab } from "../enums/AnalyticsTabs";
import { ProjectDTO } from "../models/project/ProjectDTO";
import { projectAPI } from "../api/project/ProjectAPI";

import { BurndownAnalytics } from "../components/analytics/Burndown";
import { VelocityAnalytics } from "../components/analytics/Velocity";
import { BurnupAnalytics } from "../components/analytics/Burnup";
import { BudgetAnalytics } from "../components/analytics/BudgetTracking";

import { AnalyticsAPI } from "../api/analytics/AnalyticsAPI";
import { BurndownDto } from "../models/analytics/BurndownDto";
import { BurnupDto } from "../models/analytics/BurnupDto";
import { BudgetTrackingDto } from "../models/analytics/BudgetTrackingDto";
import { ProfitMarginAnalytics } from "../components/analytics/ProfitMargin";
import { ProfitMarginDto } from "../models/analytics/ProfitMarginDto";
import { ResourceCostAllocation } from "../components/analytics/ResourceCostAllocation";
import { ResourceCostAllocationDto } from "../models/analytics/ResourceCostAllocationDto";



type SprintOption = { sprint_id: number; sprint_title?: string };

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

    const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);

    const [burndown, setBurndown] = useState<BurndownDto | null>(null);
    const [burnup, setBurnup] = useState<BurnupDto | null>(null);
    const [velocity, setVelocity] = useState<number | null>(null);
    const [budget, setBudget] = useState<BudgetTrackingDto | null>(null);
    const [profitMargin, setProfitMargin] = useState<ProfitMarginDto | null>(null);
    const [resourceCost, setResourceCost] = useState<ResourceCostAllocationDto | null>(null);

    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);

    // Instantiate API once (AuthAPI style)
    const analyticsAPI = useMemo(() => new AnalyticsAPI(), []);

    // Token from storage (adjust key if different)
    const token = useMemo(() => localStorage.getItem("authToken") ?? "", []);

    // Sprint list derived from selectedProject
    const sprints: SprintOption[] = useMemo(() => {
        if (!selectedProject) return [];

        const anyProject = selectedProject as any;

        // prefer real sprint list if exists
        if (Array.isArray(anyProject.sprints) && anyProject.sprints.length > 0) {
            return anyProject.sprints.map((s: any) => ({
                sprint_id: Number(s.sprint_id),
                sprint_title: s.sprint_title ?? s.sprint_name ?? undefined,
            }));
        }

        // fallback: sprint_count => NOT ideal, but avoids empty UI
        const count = Number(anyProject.sprint_count ?? 0);
        if (!Number.isFinite(count) || count <= 0) return [];

        return Array.from({ length: count }, (_, i) => ({
            sprint_id: i + 1,
            sprint_title: `Sprint ${i + 1}`,
        }));
    }, [selectedProject]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoadingProjects(true);

                const ids = [1, 2];
                const loadedProjects: ProjectDTO[] = [];

                for (const id of ids) {
                    const project = await projectAPI.getProjectById(id);
                    if (project) loadedProjects.push(project);
                }

                setProjects(loadedProjects);

                if (loadedProjects.length > 0) {
                    const first = loadedProjects[0];
                    setSelectedProjectId(String(first.project_id));
                    setSelectedProject(first);
                }
            } catch (e) {
                console.error("Failed to load projects", e);
            } finally {
                setLoadingProjects(false);
            }
        };

        loadProjects();
    }, []);

    // Auto-select first sprint when project changes
    useEffect(() => {
        if (!selectedProject) return;

        if (sprints.length > 0) setSelectedSprintId(sprints[0].sprint_id);
        else setSelectedSprintId(null);

        // reset analytics data
        setBurndown(null);
        setBurnup(null);
        setVelocity(null);
        setBudget(null);
        setAnalyticsError(null);
        setProfitMargin(null);
        setResourceCost(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProjectId]);

    // Load analytics when tab/id changes
    useEffect(() => {
        const projectId = selectedProject?.project_id;
        if (!projectId) return;

        const needsSprint = activeTab === "BURNDOWN" || activeTab === "BURNUP";
        if (needsSprint && !selectedSprintId) return;

        // if no token, backend will 401 — show friendly message
        if (!token) {
            setAnalyticsError("Missing auth token. Please login again.");
            return;
        }

        const load = async () => {
            try {
                setLoadingAnalytics(true);
                setAnalyticsError(null);

                if (activeTab === "BURNDOWN") {
                    const data = await analyticsAPI.getBurndownAnalytics(selectedSprintId!, token);
                    setBurndown(data);
                } else if (activeTab === "BURNUP") {
                    const data = await analyticsAPI.getBurnupAnalytics(selectedSprintId!, token);
                    setBurnup(data);
                } else if (activeTab === "VELOCITY") {
                    const v = await analyticsAPI.getVelocityTracking(projectId, token);
                    setVelocity(v);
                } else if (activeTab === "BUDGET") {
                    const b = await analyticsAPI.getBudgetTracking(projectId, token);
                    setBudget(b);
                } else if (activeTab === "PROFIT") {
                    const pm = await analyticsAPI.getProfitMargin(projectId, token);
                    setProfitMargin(pm);
                } else if (activeTab === "RESOURCES") {
                    const rc = await analyticsAPI.getResourceCostAllocation(projectId, token);
                    setResourceCost(rc);
                }

            } catch (err: any) {
                console.error("Failed to load analytics", err);

                // axios error format
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Failed to load analytics data";

                setAnalyticsError(msg);
            } finally {
                setLoadingAnalytics(false);
            }
        };

        load();
    }, [activeTab, selectedProject?.project_id, selectedSprintId, token, analyticsAPI]);

    return (
        <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
            <Sidebar />

            <main className="flex-1 p-6">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Analytics</h1>
                </header>

                {/* PROJECT SELECTOR */}
                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 items-center justify-center">
                        <span className="text-white/70 font-semibold">Selected project:</span>

                        {loadingProjects ? (
                            <div className="text-white/40">Loading projects...</div>
                        ) : (
                            <select
                                value={selectedProjectId ?? ""}
                                onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const id = e.target.value;
                                    setSelectedProjectId(id);

                                    const project = await projectAPI.getProjectById(Number(id));
                                    setSelectedProject(project);
                                }}
                                className="w-full sm:w-[320px] bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-medium-blue)] transition-all"
                            >
                                {projects.map((project) => (
                                    <option
                                        key={project.project_id}
                                        value={project.project_id}
                                        className="bg-[#020617] text-white"
                                    >
                                        {project.project_name}
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
                  ${active
                                        ? "bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white shadow-lg scale-[1.03]"
                                        : "bg-white/5 text-white/60 hover:text-white hover:-translate-y-1"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </section>

                {/* CONTENT CARD */}
                <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 min-h-[200px] max-h-[575px]">
                    {analyticsError && <div className="text-red-400 mb-4">{analyticsError}</div>}

                    {activeTab === "BURNDOWN" && (
                        <div>
                            {selectedProjectId ? (
                                <BurndownAnalytics
                                    project={selectedProject!}
                                    data={burndown}
                                    loading={loadingAnalytics}
                                    sprintId={selectedSprintId}
                                    sprints={sprints}
                                    onSprintChange={(id) => {
                                        setSelectedSprintId(id);
                                        setBurndown(null);
                                    }}
                                />
                            ) : (
                                "Select project..."
                            )}
                        </div>
                    )}

                    {activeTab === "BURNUP" && (
                        <div>
                            {selectedProjectId ? (
                                <BurnupAnalytics
                                    project={selectedProject!}
                                    data={burnup}
                                    loading={loadingAnalytics}
                                    sprintId={selectedSprintId}
                                    sprints={sprints}
                                    onSprintChange={(id) => {
                                        setSelectedSprintId(id);
                                        setBurnup(null);
                                    }}
                                />
                            ) : (
                                "Select project..."
                            )}
                        </div>
                    )}

                    {activeTab === "VELOCITY" && (
                        <div>
                            {selectedProjectId ? (
                                <VelocityAnalytics
                                    project={selectedProject!}
                                    value={velocity}
                                    loading={loadingAnalytics}
                                />
                            ) : (
                                "Select project..."
                            )}
                        </div>
                    )}

                    {activeTab === "BUDGET" && (
                        <div>
                            {selectedProjectId ? (
                                <BudgetAnalytics project={selectedProject!} data={budget} loading={loadingAnalytics} />
                            ) : (
                                "Select project..."
                            )}
                        </div>
                    )}

                    {activeTab === "PROFIT" && (
                        <div>
                            {selectedProjectId ? (
                            <ProfitMarginAnalytics
                                project={selectedProject!}
                                data={profitMargin}
                                loading={loadingAnalytics}
                            />
                            ) : (
                            "Select project..."
                            )}
                        </div>
                    )}

                    {activeTab === "RESOURCES" && (
                        <div>
                            {selectedProjectId ? (
                            <ResourceCostAllocation
                                project={selectedProject!}
                                data={resourceCost}
                                loading={loadingAnalytics}
                            />
                            ) : (
                            "Select project..."
                            )}
                        </div>
                    )}

                </section>
            </main>
        </div>
    );
};

export default AnalyticsPage;