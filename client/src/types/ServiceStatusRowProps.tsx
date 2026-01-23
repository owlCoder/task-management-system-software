import { EOperationalStatus } from "../enums/EOperatinalStatus";


export type ServiceStatusRowProps = {
    serviceName: string;
    uptimePercent: number;
    status: EOperationalStatus;
};