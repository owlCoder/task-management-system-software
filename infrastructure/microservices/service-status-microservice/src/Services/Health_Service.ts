import axios from "axios";
import { IHealth_Service } from "../Domain/Services/IHealth_Service";
import { loadMicroservicesFromEnv } from "../Helpers/loadMicroservicesFromEnv";
import { CreateMeasurementDto } from "../Domain/DTOs/CreateMeasurement_DTO";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { Measurement_Service } from "./Measurement_Service";
import { Microservice_Service } from "./Microservice_Service";

const CHECK_INTERVAL = Number(process.env.CHECK_INTERVAL) || 15_000;
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 5_000;

type RuntimeMicroservice = {
    id: number;
    name: string;
    url: string;
};

export class Health_Service implements IHealth_Service {
    private intervalId?: NodeJS.Timeout;
    private microservices: RuntimeMicroservice[] = [];

    constructor(
        private readonly measurementService: Measurement_Service,
        private readonly microserviceService: Microservice_Service
    ) { }

    async start(): Promise<void> {


        const envServices = loadMicroservicesFromEnv();

        const dbServices = await this.microserviceService.getAllMicroservices();

        const dbMap = new Map<string, number>(
            dbServices.map(ms => [
                ms.microserviceName,
                ms.microserviceId
            ])
        );

        this.microservices = envServices
            .filter(es => dbMap.has(es.name))
            .map(es => ({
                name: es.name,
                url: es.url,
                id: dbMap.get(es.name)!
            }));

        if (this.microservices.length !== envServices.length) {
            console.warn(
                "\x1b[33m[HealthService]\x1b[0m Some microservices from .env are missing in DB"
            );
        }

        console.log(
            `\x1b[33m[HealthService]\x1b[0m Monitoring ${this.microservices.length} services...`
        );

        this.intervalId = setInterval(async () => {
            await Promise.all(
                this.microservices.map(ms => this.ping(ms))
            );
        }, CHECK_INTERVAL);
    }

    async ping(ms: RuntimeMicroservice): Promise<void> {
        const startTime = Date.now();

        try {
            const response = await axios.get(ms.url, {
                timeout: REQUEST_TIMEOUT,
                validateStatus: () => true
            });

            const responseTime = Date.now() - startTime;
            let status: EOperationalStatus;

            if (response.status >= 500) {
                status = EOperationalStatus.Partial_Outage;
            } else if (responseTime < 120) {
                status = EOperationalStatus.Operational;
            } else {
                status = EOperationalStatus.Partial_Outage;
            }
            await this.measurementService.setMeasurement(
                new CreateMeasurementDto(ms.id, status, responseTime)
            );

        } catch {
            const responseTime = Date.now() - startTime;

            await this.measurementService.setMeasurement(
                new CreateMeasurementDto(ms.id, EOperationalStatus.Down, responseTime)
            );
        }
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log(
                `\x1b[33m[HealthService]\x1b[0m Stopped monitoring`
            );
        }
    }
}
