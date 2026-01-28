import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AverageTimeDTO } from "../../models/service-status/AverageTimeDTO";
import { IServiceStatusAPI } from "../../api/service-status/IServiceStatusAPI";
import { ServiceStatusAPI } from "../../api/service-status/ServiceStatusAPI";
import { formatDateRS } from "../../helpers/formatDateRS";
import ExportButton from "../analytics/ExportButton";

const serviceStatusApi: IServiceStatusAPI = new ServiceStatusAPI();



export const ResponseTime: React.FC = () => {
    const [data, setData] = useState<AverageTimeDTO[]>([]);
    const [days, setDays] = useState<number>(1);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await serviceStatusApi.getAvgResponseTime(days);
                setData(result);
            } catch (error) {
                console.error("Failed to load response time data", error);
            }
        };

        loadData();

        const intervalId = setInterval(loadData, 60_000);

        return () => clearInterval(intervalId);
    }, [days]);

    return (
        <div className="w-full  ">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Response Time
                </h2>
            </div>

            <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-[250px] md:h-[400px] lg:h-[450px]  styled-scrollbar">
                <div className="flex py-2">
                    <ExportButton label="1 Day" classname="mt-5 ml-4 mr-4" onClick={() => setDays(1)} />
                    <ExportButton label="7 Days" classname="mt-5 ml-4 mr-4" onClick={() => setDays(7)} />
                </div>
                <div className="w-full h-[150px] md:h-[280px] lg:h-[330px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

                            <XAxis dataKey="time" tickFormatter={formatDateRS} stroke="#cbd5f5" />
                            <YAxis stroke="#cbd5f5" tickFormatter={(value) => `${value} ms`} />

                            <Tooltip
                                labelFormatter={(label) =>
                                    new Date(label as string).toLocaleString("sr-RS")}
                                formatter={(value) => {
                                    if (value == null) return ["–", "Response time"];
                                    return [`${value} ms`, "Response time"];
                                }} />

                            <Line type="monotone" dataKey="avgResponseTime" stroke="#6366f1" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};