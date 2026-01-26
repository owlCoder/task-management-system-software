import { EOperationalStatus } from "../../enums/EOperatinalStatus";

export const ServiceStatusRow = ({
    serviceName,
    uptimePercent,
    status
}: any) => {

    const statusColor =
        status === EOperationalStatus.Operational
            ? "text-green-400"
            : status === EOperationalStatus.Partial_Outage
            ? "text-yellow-400"
            : "text-red-400";

    return (
        <div
            className="
                grid grid-cols-3
                items-center gap-4 px-4 py-2
                rounded-xl bg-white/5 border border-white/10
                text-xs sm:text-sm text-white
                hover:bg-white/10 transition
            "
        >
            <span
                className="truncate"
                title={serviceName}
            >
                {serviceName}
            </span>

            <span className="text-center">
                {Number(uptimePercent).toFixed(2)}%
            </span>

            <span className={`text-center font-semibold ${statusColor}`}>
                {status}
            </span>
        </div>
    );
};