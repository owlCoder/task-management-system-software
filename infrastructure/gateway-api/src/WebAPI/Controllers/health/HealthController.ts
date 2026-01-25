// Framework
import { Request, Response, Router } from "express";

// Constants
import { SERVICES } from "../../../Constants/services/Services";

export class HealthController {
    private readonly router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/health", this.healthCheck.bind(this));
    }
    
    /**
     * GET /health
     * @param {Request} _req - The request object.
     * @param {Response} res - The response object.
     * @returns {void} Sends a 200 OK response with:
     * - `status`: Current service status.
     * - `service`: Service name.
     * - `timestamp`: ISO timestamp of the check.
     * - `uptime`: Service uptime in seconds.
     */
    private healthCheck(_req: Request, res: Response): void {
        res.status(200).json({
            status: "OK",
            service: SERVICES.SELF,
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime())
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}