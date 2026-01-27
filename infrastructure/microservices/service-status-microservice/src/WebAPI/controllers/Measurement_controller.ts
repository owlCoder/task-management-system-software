import { Router, Request, Response } from "express";
import { IMeasurement_Service } from "../../Domain/Services/IMeasurement_Service";
import { CreateMeasurementDto } from "../../Domain/DTOs/CreateMeasurement_DTO";
import { validateMeasurementDto } from "../validators/Measurement_validator";
import { ILoggerService } from "../../Domain/Services/ILoggerService";
import { IMicroservice_Service } from "../../Domain/Services/IMicroservice_Service";
import { EOperationalStatus } from "../../Domain/enums/EOperationalStatus";
import { ServiceStatusTransportDto } from "../../Domain/DTOs/ServiceStatusTransport_DTO";
import { ISIEMService } from "../../SIEM/Domen/services/ISIEMService";
import { generateEvent } from "../../SIEM/Domen/Helpers/generate/GenerateEvent";


export class Measurement_controller {
    private readonly router: Router;

    constructor(private readonly measurementService: IMeasurement_Service, private readonly LoggerService: ILoggerService, private readonly microserviceService: IMicroservice_Service, private readonly siemService: ISIEMService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/measurements", this.getAllMeasurements.bind(this));
        this.router.get("/down", this.getAllDownMeasurements.bind(this));
        this.router.get("/service-status", this.getServiceStatus.bind(this));
        this.router.get("/average-response-time/:days", this.getAvgResponseTime.bind(this))
        this.router.get("/measurement/:microserviceId", this.getMeasurementsFromMicroservice.bind(this));

        this.router.post("/set", this.setMeasurement.bind(this));
        this.router.delete("/delete/:measurementID", this.deleteMeasurement.bind(this));
    }

    private async getAvgResponseTime(req: Request, res: Response): Promise<void> {
        const days = Number(req.params.days);

        if (isNaN(days) || days <= 0) {
            res.status(400).json({ message: "days must be a positive number" });

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, `Service blocked request with negative number of days`,),);
            
            this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Invalid number of days received: ${req.params.microserviceId}`);
            return;
        }

        try {
            const result = await this.measurementService.getAverageResponseTime(days);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Service sent avg response time",),);

            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get average response time" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }


    private async getAllMeasurements(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.measurementService.getAllMeasurements();
            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Service sent all measurements!",),);

            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get all measurements from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getMeasurementsFromMicroservice(req: Request, res: Response): Promise<void> {

        const microserviceId = Number(req.params.microserviceId);
        if (!Number.isInteger(microserviceId) || microserviceId <= 0) {

            this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Invalid microserviceId received: ${req.params.microserviceId}`);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, `Invalid microserviceId received: ${req.params.microserviceId}`,),);

            res.status(400).json({ message: "Invalid microserviceId. It must be a positive number." });
            return;
        }

        try {
            const result = await this.measurementService.getMeasurementsFromMicroservice(microserviceId);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, `Service sent measurements from specific microservice ${microserviceId}`,),);
            
            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get single measurement from specific microservice from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getAllDownMeasurements(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.measurementService.getAllDownMeasurements();

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Service sent all down measurements!",),);

            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get all down measurements from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getServiceStatus(req: Request, res: Response): Promise<void> {
        try {
            const [microservices, uptimes, statuses] = await Promise.all([
                this.microserviceService.getAllMicroservices(),
                this.measurementService.getAverageUptime(),
                this.measurementService.getLatestStatuses()
            ]);

            const uptimeById = new Map<number, number>(
                uptimes.map(u => [u.microserviceId, u.uptime])
            );

            const statusById = new Map<number, EOperationalStatus>(
                statuses.map(s => [s.microserviceId, s.status])
            );

            const result: ServiceStatusTransportDto[] = microservices.map(ms => ({
                microserviceName: ms.microserviceName,
                uptime: uptimeById.get(ms.microserviceId) ?? 0,
                status: statusById.get(ms.microserviceId) ?? EOperationalStatus.Down
            }));

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Service sent service statuses of all measurements!",),);

            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get serice status" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }



    private async setMeasurement(req: Request, res: Response): Promise<void> {
        try {
            const dto = new CreateMeasurementDto(
                req.body.microserviceId,
                req.body.status,
                req.body.responseTime
            );

            const validationError = validateMeasurementDto(dto);
            if (validationError) {
                res.status(400).json({ message: validationError });

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, `Service blocked given request with negative microserviceId`,),);
                
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Validation failed: ${validationError}`);
                return;
            }

            const success = await this.measurementService.setMeasurement(dto as any);

            if (success) {
                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Changes on measurement set successfully!",),);

                res.status(201).json({ message: "Measurement created successfully" });
            } else {
                res.status(404).json({ message: "Microservice not found" });

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 404, `Reqested microservice not found!`,),);

                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Microservice not found: ${req.body.microserviceId}`);
            }

        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to set measurement" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteMeasurement(req: Request, res: Response): Promise<void> {
        try {
            const measurementID = Number(req.params.measurementID);

            if (isNaN(measurementID) || measurementID <= 0) {
                res.status(400).json({ message: "measurementID must be a positive number" });

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, `Service blocked given request with negative microserviceId`,),);
                
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Invalid measurementID: ${req.params.measurementID}`);
                return;
            }

            const success = await this.measurementService.deleteMeasurement(measurementID);

            if (success) {
                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Measurement deleted successfully!",),);

                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ message: `Measurement with ID ${measurementID} not found` });

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 404, `Measurement with ID ${measurementID} not found`,),);

                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Measurement not found: ${measurementID}`);
            }

        } catch (err) {
            this.LoggerService.err("MEASUREMENT_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to delete measurement from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}