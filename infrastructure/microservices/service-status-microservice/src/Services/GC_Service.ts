import { Db } from "../Database/DbConnectionPool";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { IGC_Service } from "../Domain/Services/IGC_Service";
import { Measurement_Service } from "./Measurement_Service";

const GC_INTERVAL = 60_000;
const RETENTION_OK = 20_000;
const RETENTION_DOWN =  50_000;


export class GarbageCollector_Service implements IGC_Service {

    private intervalId?: NodeJS.Timeout;

    constructor(
        private readonly measurementService: Measurement_Service
    ) { }


    async start(): Promise<void> {
        this.intervalId = setInterval(() => {
            this.collect().catch(err =>
                console.error("[GarbageCollector]", err)
            );
        }, GC_INTERVAL);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }


    async collect(): Promise<void> {
        const now = Date.now();

        const allMeasurements =
            await this.measurementService.getAllMeasurements();

        let deleted = 0;

        for (const m of allMeasurements) {
            const measurementTime = new Date(m.measurementDate).getTime();
            const age = now - measurementTime;

            if (m.status === EOperationalStatus.Down && age > RETENTION_DOWN) {
                const success =
                    await this.measurementService.deleteMeasurement(
                        m.measurementId
                    );

                if (success) deleted++;
            }

            if (m.status !== EOperationalStatus.Down && age > RETENTION_OK) {
                const success =
                    await this.measurementService.deleteMeasurement(
                        m.measurementId
                    );

                if (success) deleted++;
            }
        }

        if (deleted > 0) {
            console.log(
                `[GarbageCollector] Deleted ${deleted} measurements`
            );
        }
    }
}