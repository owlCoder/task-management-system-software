import { Router, Request, Response } from "express";
import { IMeasurement_Service } from "../../Domain/Services/IMeasurement_Service";
import { CreateMeasurementDto } from "../../Domain/DTOs/CreateMeasurement_DTO";
import { validateMeasurementDto } from "../validators/Measurement_validator";


export class Measurement_controller {
    private readonly router: Router;

    constructor(private readonly measurementService: IMeasurement_Service) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/measurements", this.getAllMeasurements.bind(this));
        this.router.get("/measurement/:microserviceId", this.getMeasurementFromMicroservice.bind(this));
        this.router.get("/measurement/Down", this.getAllDownMeasurements.bind(this));

        this.router.patch("/measurement/set", this.setMeasurement.bind(this));
        this.router.delete("/measurement/delete", this.deleteMeasurement.bind(this));
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

        const { microservice_id } = req.body as { microservice_id: number };

        try {
            const result = await this.measurementService.getMeasurementsFromMicroservice(microservice_id);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getAllDownMeasurements(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.measurementService.getAllDownMeasurements;
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
                return;
            }

            const success = await this.measurementService.setMeasurement(dto as any);

            if (success) {
                res.status(201).json({ message: "Measurement created successfully" });
            } else {
                res.status(400).json({ message: "Microservice not found" });
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
                return;
            }

            const success = await this.measurementService.deleteMeasurement(measurementID);

            if (success) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ message: `Measurement with ID ${measurementID} not found` });
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}