import { Router, Request, Response } from "express";
import { IMicroservice_Service } from "../../Domain/Services/IMicroservice_Service";

export class Microservice_controller {
    private readonly router: Router;

    constructor(private readonly microservicetService: IMicroservice_Service) {
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
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async createMicroservice(req: Request, res: Response): Promise<void> {
        try {
            const { microserviceName } = req.body as { microserviceName: string };

            if (!microserviceName || microserviceName.trim() === "") {
                res.status(400).json({ message: "microserviceName is required" });
                return;
            }

            const success = await this.microservicetService.setMicroservice(microserviceName);

            if (success) {
                res.status(201).json({ message: "Microservice created successfully" });
            } else {
                res.status(400).json({ message: "Microservice could not be created (maybe duplicate)" });
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteMicroservice(req: Request, res: Response): Promise<void> {
        try {
            const microserviceId = Number(req.params.microserviceId);

            if (isNaN(microserviceId) || microserviceId <= 0) {
                res.status(400).json({ message: "microserviceId must be a positive number" });
                return;
            }

            const success = await this.microservicetService.deleteMicroservice(microserviceId);

            if (success) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ message: `Microservice with ID ${microserviceId} not found` });
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}