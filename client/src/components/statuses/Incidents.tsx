import React, { useEffect, useState } from "react";
import { IServiceStatusAPI } from "../../api/service-status/IServiceStatusAPI";
import { ServiceStatusAPI } from "../../api/service-status/ServiceStatusAPI";

const serviceStatusApi: IServiceStatusAPI = new ServiceStatusAPI();

export const Incidents: React.FC = () => {

    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchIncidents = async () => {
        try {
            const data = await serviceStatusApi.getAllDownMeasurements();
            setIncidents(data);
        } catch (err) {
            console.error("Failed to fetch incidents", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();

        const interval = setInterval(fetchIncidents, 30_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
                Incidents
            </h2>

            <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-[200px] md:h-[350px] lg:h-[400px] styled-scrollbar overflow-y-auto">

                {loading ? (<div className="text-white/60 text-sm">
                        Loading incidents... </div>
                ) : incidents.length === 0 ? (
                    <div className="text-green-400 text-sm">
                        No active incidents!!!!
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-white">
                        <thead className="bg-black/30 ">
                            <tr>
                                <th className="py-2 px-3">Microservice</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident, idx) => (
                                <tr
                                    key={idx}
                                    className="border-t border-white/10 hover:bg-white/5 transition"
                                >
                                    <td className="py-2 px-3 font-medium">
                                        {incident.microserviceName}
                                    </td>

                                    <td className="py-2 px-3 text-red-400 font-semibold">
                                        {incident.status}
                                    </td>

                                    <td className="py-2 px-3 text-white/70">
                                        {new Date(incident.measurementDate).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};