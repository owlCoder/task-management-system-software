import { Router } from "express";
import { IMicroservice_Service } from "../../Domain/Services/IMicroservice_Service";

export class Microservice_controller{
    private readonly router: Router;

    constructor (private readonly measurementService: IMicroservice_Service) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //this.router.post("/projects/:projectId/sprints", this.createSprint.bind(this));
    }

    public getRouter(): Router {
    return this.router;
    }
}