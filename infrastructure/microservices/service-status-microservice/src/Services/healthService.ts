import axios from "axios";
import { IHealth_Service } from "../Domain/Services/IHealthService";
import { loadMicroservices } from "../Helpers/loadMicroservices";
import { CreateMeasurementDto } from "../Domain/DTOs/CreateMeasurement_DTO";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { RuntimeMicroservice } from "../Domain/types/RuntimeMicroservices";
import { ILoggerService } from "../Domain/Services/ILoggerService";
import { IMicroservice_Service } from "../Domain/Services/IMicroservice_Service";
import { IMeasurement_Service } from "../Domain/Services/IMeasurement_Service";

const checkInterval = 1_000 * 60 * 5;
const requestTimeout = 1_000;
let running = false;


export class Health_Service implements IHealth_Service {
    private intervalId?: NodeJS.Timeout;
    private microservices: RuntimeMicroservice[] = [];

    constructor(
        private readonly measurementService: IMeasurement_Service,
        private readonly microserviceService: IMicroservice_Service,
        private readonly LoggerService: ILoggerService
    ) { }

    async start(): Promise<void> {

        const envServices = loadMicroservices();

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
            this.LoggerService.warn("HEALTH_SERVICE", `\x1b[33m[HealthService]\x1b[0m Some microservices from .env are missing in DB`);
        }

        this.LoggerService.info("HEALTH_SERVICE", `\x1b[33m[HealthService]\x1b[0m Monitoring ${this.microservices.length} services...`);

        this.intervalId = setInterval(async () => {
            if (running) return;
            running = true;

            try {
                await Promise.all(this.microservices.map(ms => this.ping(ms)));
            } finally {
                running = false;
            }
        }, checkInterval);
    }

    async ping(ms: RuntimeMicroservice): Promise<void> {
        const startTime = Date.now();

        try {
            const response = await axios.get(ms.url, {
                timeout: requestTimeout,
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
            await this.measurementService.setMeasurement(new CreateMeasurementDto(ms.id, status, responseTime));

        } catch {
            const responseTime = Date.now() - startTime;
            await this.measurementService.setMeasurement(new CreateMeasurementDto(ms.id, EOperationalStatus.Down, responseTime));
        }
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.LoggerService.warn("HEALTH_SERVICE", `\x1b[33m[HealthService]\x1b[0m Stopped monitoring`);
        }
    }
}
