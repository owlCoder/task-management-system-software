import { OperationalStatus } from "../../enums/service-status/OperationalStatus";

export interface MeasurementDTO {
	measurementId: number;
	microserviceId: number;
	status: OperationalStatus;
	responseTime: number;
	measurementDate: string;
}