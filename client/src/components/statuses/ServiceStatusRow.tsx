import React from "react";
import { EOperationalStatus } from "../../enums/EOperatinalStatus"
import { ServiceStatusRowProps } from "../../types/ServiceStatusRowProps";





const statusStyles: Record<EOperationalStatus, string> = {
    Operational: "bg-green-500/20 text-green-400 border-green-500/30",
    "PartialOutage": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Down: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const ServiceStatusRow: React.FC<ServiceStatusRowProps> = ({
    serviceName,
    uptimePercent,
    status,
}) => {
    return (
        <div className="grid grid-cols-3 items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">

            <span className="text-white font-medium">
                {serviceName}
            </span>

            <span className="text-white/80 font-semibold">
                {uptimePercent.toFixed(2)}%
            </span>


            <span
                className={`w-fit px-3 py-1 text-sm font-semibold rounded-full border ${statusStyles[status]}`}>
                {status}
            </span>
        </div>
    );
};