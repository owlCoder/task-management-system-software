import { Router, Request, Response } from "express";
import { IMeasurement_Service } from "../../Domain/Services/IMeasurement_Service";
import { CreateMeasurementDto } from "../../Domain/DTOs/CreateMeasurement_DTO";
import { validateMeasurementDto } from "../validators/Measurement_validator";
import { ILoggerService } from "../../Domain/Services/ILoggerService";
import { IMicroservice_Service } from "../../Domain/Services/IMicroservice_Service";
import { time } from "console";


export class Measurement_controller {
    private readonly router: Router;
    private readonly LoggerService: ILoggerService;
    private readonly measurementService: IMeasurement_Service;
    private readonly microserviceService: IMicroservice_Service;

    constructor(private readonly measurementservice: IMeasurement_Service, private readonly loggerService: ILoggerService, private readonly microserviceservice: IMicroservice_Service) {
        this.router = Router();
        this.LoggerService = loggerService;
        this.measurementService = measurementservice;
        this.microserviceService = microserviceservice;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/measurements", this.getAllMeasurements.bind(this));
        this.router.get("/measurement/:microserviceId", this.getMeasurementFromMicroservice.bind(this));
        this.router.get("/Down", this.getAllDownMeasurements.bind(this));
        this.router.get("/ServiceStatus", this.getServiceStatus.bind(this));

        this.router.post("/set", this.setMeasurement.bind(this));
        this.router.delete("/delete/:measurementID", this.deleteMeasurement.bind(this));
    }

    private async getAllMeasurements(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.measurementService.getAllMeasurements();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getMeasurementFromMicroservice(req: Request, res: Response): Promise<void> {

        const microserviceId = Number(req.params.microserviceId);

        try {
            const result = await this.measurementService.getMeasurementsFromMicroservice(microserviceId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getAllDownMeasurements(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.measurementService.getAllDownMeasurements();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getServiceStatus(req: Request, res: Response): Promise<void> {
        try {
            const [latestMeasurements, uptimes] = await Promise.all([
                this.measurementService.getNewMeasurements(),
                this.measurementService.getAverageUptime()
            ]);

            const uptimeMap = new Map<number, number>();
            uptimes.forEach(u => {
                uptimeMap.set(u.microserviceId, u.uptime);
            });

            const result = await Promise.all(
                latestMeasurements.map(async m => {

                    const microservice =
                        await this.microserviceService.getMicroserviceByID(m.microserviceId);

                    return {
                        microserviceName: microservice?.microserviceName ?? "",
                        uptime: uptimeMap.get(m.microserviceId) ?? 0,
                        status: m.status
                    };
                })
            );

            res.status(200).json(result);

        } catch (err) {
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
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Validation failed: ${validationError}`);
                return;
            }

            const success = await this.measurementService.setMeasurement(dto as any);

            if (success) {
                res.status(201).json({ message: "Measurement created successfully" });
            } else {
                res.status(400).json({ message: "Microservice not found" });
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Microservice not found: ${req.body.microserviceId}`);
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteMeasurement(req: Request, res: Response): Promise<void> {
        try {
            const measurementID = Number(req.params.measurementID);

            if (isNaN(measurementID) || measurementID <= 0) {
                res.status(400).json({ message: "measurementID must be a positive number" });
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Invalid measurementID: ${req.params.measurementID}`
                );
                return;
            }

            const success = await this.measurementService.deleteMeasurement(measurementID);

            if (success) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ message: `Measurement with ID ${measurementID} not found` });
                this.LoggerService.warn("MEASUREMENT_CONTROLLER", `Measurement not found: ${measurementID}`);
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}