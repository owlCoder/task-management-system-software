// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayServiceStatusService } from "../../../Domain/services/service-status/IGatewayServiceStatusService";
import { MeasurementDTO } from "../../../Domain/DTOs/service-status/measurementDTO";
import { AverageTimeDTO } from "../../../Domain/DTOs/service-status/AverageTimeDTO";
import { ServiceStatusDTO } from "../../../Domain/DTOs/service-status/serviceStatusDTO";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";

// Utils
import { handleResponse } from "../../Utils/Http/ResponseHandler";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

/**
 * Routes client requests towards the Service-Status Microservice.
 */
export class GatewayServiceStatusController {
    private readonly router: Router;

    constructor(private readonly gatewayServiceStatusService: IGatewayServiceStatusService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Service-Status Microservice.
     */
    private initializeRoutes() {
        this.router.get('/measurements', authenticate, this.getAllMeasurements.bind(this));
        this.router.get('/measurements/average-response-time/:days', authenticate, this.getAvgResponseTime.bind(this));
        this.router.get('/measurements/down', authenticate, this.getAllDownMeasurements.bind(this));
        this.router.get('/measurements/service-status', authenticate, this.getServiceStatus.bind(this));
    }
    
    /**
     * GET /api/v1/measurements/average-response-time/:days
     * @param {Request} req - the request object, containing the days in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link AverageTimeDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAvgResponseTime(req: Request<ReqParams<'days'>>, res: Response): Promise<void> {
        const days = parseInt(req.params.days, 10);
        const result = await this.gatewayServiceStatusService.getAvgResponseTime(days);

        handleResponse(res, result);
    }

    /**
     * GET /api/v1/measurements
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link MeasurementDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAllMeasurements(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllMeasurements();
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/measurements/down
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link MeasurementDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAllDownMeasurements(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getAllDownMeasurements();
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/measurements/service-status
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ServiceStatusDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getServiceStatus(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayServiceStatusService.getServiceStauts();
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}
