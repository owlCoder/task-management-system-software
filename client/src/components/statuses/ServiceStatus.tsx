import React, { useEffect, useState } from "react";
import { ServiceStatusRow } from "./ServiceStatusRow";
import { IServiceStatusAPI } from "../../api/service-status/IServiceStatusAPI";
import { ServiceStatusAPI } from "../../api/service-status/ServiceStatusAPI";
import { ServiceStatusDTO } from "../../models/service-status/ServiceStatusDTO";

const serviceStatusApi: IServiceStatusAPI = new ServiceStatusAPI();

export const ServiceStatus: React.FC = () => {
    const [services, setServices] = useState<ServiceStatusDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchServiceStatus = async () => {
            try {
                const data = await serviceStatusApi.getServiceStatus();
                setServices(data);
            } catch (err) {
                console.error("Failed to load service status", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceStatus();
    }, []);

    return (
        <div className="w-full">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Service Status
                </h2>
            </div>

            <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-[200px] overflow-y-auto md:h-[350px] lg:h-[400px] styled-scrollbar">
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 items-center gap-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/60 text-sm font-semibold">
                        <span>Service</span>
                        <span>Uptime %</span>
                        <span>Status</span>
                    </div>

                    {loading && (
                        <div className="text-white/50 px-4 py-6">
                            Loading service status...
                        </div>
                    )}

                    {!loading && services.length === 0 && (
                        <div className="text-white/40 px-4 py-6">
                            No service data available
                        </div>
                    )}

                    {!loading &&
                        services.map((service) => (
                            <ServiceStatusRow
                                key={service.microserviceName}
                                serviceName={service.microserviceName}
                                uptimePercent={service.uptime}
                                status={service.status}
                            />
                        ))}
                </div>
            </section>
        </div>
    );
};
