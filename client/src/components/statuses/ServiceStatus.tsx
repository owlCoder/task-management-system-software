import React from "react";
import { ServiceStatusRow } from "./ServiceStatusRow";
import { serviceStatusMock } from "../../mocks/ServiceStatusMock";

export const ServiceStatus: React.FC = () => {
    return (
        <div className="w-full ">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Service Status
                </h2>
            </div>

            <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-[200px]  overflow-y-auto md:h-[350px] lg:h-[400px]  styled-scrollbar">
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 items-center gap-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/60 text-sm font-semibold">
                        <span>Service</span>
                        <span>Uptime %</span>
                        <span>Status</span>
                    </div>
                    {serviceStatusMock.map((service) => (
                        <ServiceStatusRow
                            key={service.serviceName}
                            serviceName={service.serviceName}
                            uptimePercent={service.uptimePercent}
                            status={service.status}
                        />
                    ))}
                </div>
            </section>

        </div>
    );
};