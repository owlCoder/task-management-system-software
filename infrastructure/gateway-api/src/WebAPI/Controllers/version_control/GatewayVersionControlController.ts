import { Request, Response, Router } from "express";
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";
import { IGatewayVersionControlService } from "../../../Domain/services/version-control/IGatewayVersionControlService";

export class GatewayVersionControlController {
    private readonly router: Router;

    constructor(private readonly gatewayVersionSevice : IGatewayVersionControlService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
    
    }
}