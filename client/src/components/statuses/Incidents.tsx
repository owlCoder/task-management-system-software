import React from "react";

export const Incidents: React.FC = () => {
    return (
        <div className="w-full x">
            <div>
            <h2 className="text-2xl font-bold text-white">
                Incidents
            </h2>
            </div>
            <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-[200px] md:h-[350px] lg:h-[400px]  styled-scrollbar">
                <div className="flex flex-col gap-3">
                    <div className="text-white/20 text-center py-10">
                        Background
                    </div>
                </div>
            </section>
        </div>
    );
};