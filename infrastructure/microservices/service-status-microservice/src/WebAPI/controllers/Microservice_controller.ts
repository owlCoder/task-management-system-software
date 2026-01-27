import { Router, Request, Response } from "express";
import { IMicroservice_Service } from "../../Domain/Services/IMicroservice_Service";
import { ILoggerService } from "../../Domain/Services/ILoggerService";
import { ISIEMService } from "../../SIEM/Domen/services/ISIEMService";
import { generateEvent } from "../../SIEM/Domen/Helpers/generate/GenerateEvent";

export class Microservice_controller {
    private readonly router: Router;

    constructor(private readonly microservicetService: IMicroservice_Service, private readonly LoggerService: ILoggerService, private readonly siemService: ISIEMService,) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/microservices", this.getAllMicroservices.bind(this));
        this.router.post("/create", this.createMicroservice.bind(this));
        this.router.delete("/delete/:microserviceID", this.deleteMicroservice.bind(this));
    }



    private async getAllMicroservices(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.microservicetService.getAllMicroservices();

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, "Service returns all microservices",),);

            res.status(200).json(result);
        } catch (err) {
            this.LoggerService.err("MICROSERVICE_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to get all microservices from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async createMicroservice(req: Request, res: Response): Promise<void> {
        try {
            const { microserviceName } = req.body as { microserviceName: string };

            if (!microserviceName || microserviceName.trim() === "") {
                this.LoggerService.warn("MICROSERVICE_CONTROLLER", "microserviceName is missing or empty");

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, "Service error while validating data for creating microservice",),);

                res.status(400).json({ message: "microserviceName is required" });
                return;
            }

            const success = await this.microservicetService.setMicroservice(microserviceName);

            if (success) {
                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 201, "Service creates new microservice",),);

                res.status(201).json({ message: "Microservice created successfully" });
            } else {
                this.LoggerService.warn("MICROSERVICE_CONTROLLER", `Microservice could not be created (maybe duplicate): ${microserviceName}`);

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, "Service error while creating microservice 99% sure its duplicate name",),);

                res.status(400).json({ message: "Microservice could not be created (maybe duplicate)" });
            }

        } catch (err) {
            this.LoggerService.err("MICROSERVICE_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to add microservice to db" +
                ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteMicroservice(req: Request, res: Response): Promise<void> {
        try {
            const microserviceId = Number(req.params.microserviceId);
            if (isNaN(microserviceId) || microserviceId <= 0) {
                this.LoggerService.warn("MICROSERVICE_CONTROLLER", `Invalid microserviceId: ${req.params.microserviceId}`);

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 400, "Service blocked given request with negative microserviceId",),);

                res.status(400).json({ message: "microserviceId must be a positive number" });
                return;
            }

            const success = await this.microservicetService.deleteMicroservice(microserviceId);

            if (success) {

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 200, `$Microservice with id ${microserviceId} deleted successfully`,),);

                res.status(200).json({ success: true });
            } else {
                this.LoggerService.warn("MICROSERVICE_CONTROLLER", `Microservice not found: ${microserviceId}`);

                this.siemService.sendEvent(generateEvent("service-status-microservice", req, 404, "Microservice with given microserviceId not found!",),);

                res.status(404).json({ message: `Microservice with ID ${microserviceId} not found` });
            }

        } catch (err) {
            this.LoggerService.err("MICROSERVICE_CONTROLLER", (err as Error).stack ?? (err as Error).message);

            this.siemService.sendEvent(generateEvent("service-status-microservice", req, 500, "Service error while trying to delete microservice from db" +
            ((err as Error).stack ?? (err as Error).message),),);

            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}