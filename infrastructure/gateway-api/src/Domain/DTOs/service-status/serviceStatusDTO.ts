import { OperationalStatus } from "../../enums/service-status/OperationalStatus";

export interface ServiceStatusDTO {
	microserviceName: string;
	uptime: number;
	status: OperationalStatus;
}