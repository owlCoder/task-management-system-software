import React, { useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { AnalyticsTab } from "../enums/AnalyticsTabs";

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

    return (
        <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
            <Sidebar />

            <main className="flex-1 p-6">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Analytics
                    </h1>
                </header>

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
                    {activeTab === "BURNDOWN" && <div>TODO: Burndown analytics</div>}
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
