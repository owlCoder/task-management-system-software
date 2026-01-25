// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayServiceStatusService } from "../../../Domain/services/service-status/IGatewayServiceStatusService";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";

// Utils
import { handleResponse } from "../../Utils/Http/ResponseHandler";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

export class GatewayServiceStatusController {
    private readonly router: Router;

    constructor(private readonly gatewayServiceStatusService: IGatewayServiceStatusService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/measurements', authenticate, this.getAllMeasurements.bind(this));
        this.router.get('/measurements/average-response-time/:days', authenticate, this.getAvgResponseTime.bind(this));
        this.router.get('/measurements/down', authenticate, this.getAllDownMeasurements.bind(this));
        this.router.get('/measurements/service-status', authenticate, this.getServiceStatus.bind(this));
    }
    
    private async getAvgResponseTime(req: Request<ReqParams<'days'>>, res: Response): Promise<void> {
        const days = parseInt(req.params.days, 10);
        const result = await this.gatewayServiceStatusService.getAvgResponseTime(days);

        handleResponse(res, result);
    }

    private async getAllMeasurements(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllMeasurements();
        handleResponse(res, result);
    }

    private async getAllDownMeasurements(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllDownMeasurements();
        handleResponse(res, result);
    }

    private async getServiceStatus(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getServiceStauts();
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}
