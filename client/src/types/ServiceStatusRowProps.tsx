import { ServiceOperationalStatus } from "./ServiceOperationalStatus";

export type ServiceStatusRowProps = {
    serviceName: string;
    uptimePercent: number;
    status: ServiceOperationalStatus;
};