import { Db } from "../Database/DbConnectionPool";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { IGC_Service } from "../Domain/Services/IGCService";
import { ILoggerService } from "../Domain/Services/ILoggerService";
import { Measurement_Service } from "./measurementService";

const gcIinterval = 60_000 * 60;
const retenationOk = 60_000 * 60 * 24 * 14;
const retenationDown = 60_000 * 60 * 24 * 28;


export class GarbageCollector_Service implements IGC_Service {
    private intervalId?: NodeJS.Timeout;

    constructor(
        private readonly measurementService: Measurement_Service,
        private readonly LoggerService: ILoggerService
    ) { }

    async start(): Promise<void> {
        this.intervalId = setInterval(() => {
            this.collect().catch(err =>
                this.LoggerService.warn("GC_SERVICE", (err as Error).stack ?? (err as Error).message));
        }, gcIinterval);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    async collect(): Promise<void> {
        const deletedDown = await this.measurementService.deleteOldMeasurements(EOperationalStatus.Down, retenationDown);

        const deletedOk = await this.measurementService.deleteOldNonDownMeasurements(retenationOk);

        const totalDeleted = deletedDown + deletedOk;

        if (totalDeleted > 0) {
            this.LoggerService.info("GC_SERVICE", `GC Deleted ${totalDeleted} measurements`)
        }
    }
}