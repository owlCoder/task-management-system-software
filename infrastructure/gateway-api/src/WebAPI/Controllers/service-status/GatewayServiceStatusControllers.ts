import { Router, Request, Response } from "express";
import { IGatewayServiceStatusService } from "../../../Domain/services/service-status/IGatewayServiceStatusService";
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { handleResponse } from "../../Utils/Http/ResponseHandler";


export class GatewayServiceStatusController {
    private readonly router: Router;
    private readonly gatewayServiceStatusService: IGatewayServiceStatusService;

    constructor(private readonly gatewayServiceStatusservice: IGatewayServiceStatusService) {
        this.router = Router();
        this.gatewayServiceStatusService = gatewayServiceStatusservice;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const serviceStatusAccess = [authenticate];

        this.router.get('/measurement/measurements', ...serviceStatusAccess, this.getAllMeasurements.bind(this));

        this.router.get('/measurement/Down', ...serviceStatusAccess, this.getAllDownMeasurements.bind(this));

        this.router.get('/measurement/ServiceStatus', ...serviceStatusAccess, this.getServiceStatus.bind(this));


    }

    private async getAllMeasurements(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllMeasurements();
        handleResponse(res, result);
    }

    private async getAllDownMeasurements(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllDownMeasurements();
        handleResponse(res, result);
    }

    private async getServiceStatus(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getServiceStauts();
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}
