import { Request, Response, Router } from "express";
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";
import { IGatewayVersionControlService } from "../../../Domain/services/version-control/IGatewayVersionControlService";
import { ReviewCommentDTO } from "../../../Domain/DTOs/version-control/ReviewCommentDTO";
import { ReviewPolicies } from "../../../Domain/access-policies/version-control/ReviewPolicies";

export class GatewayVersionControlController {
    private readonly router: Router;

    constructor(private readonly gatewayVersionSevice : IGatewayVersionControlService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const reviewReadAccess = [authenticate, authorize(...ReviewPolicies.READ)];
        const reviewWriteAccess = [authenticate, authorize(...ReviewPolicies.WRITE)];
        const reviewSendAccess = [authenticate, authorize(...ReviewPolicies.SEND)];

        this.router.get("/reviews",...reviewReadAccess,this.getReviews.bind(this));
        this.router.post("/reviews/:taskId/accept" ,...reviewWriteAccess,this.acceptReview.bind(this));
        this.router.post("/reviews/:taskId/reject" ,...reviewWriteAccess,this.rejectReview.bind(this));
        this.router.post("/reviews/:taskId/send" ,...reviewSendAccess,this.sendToReview.bind(this));
    }

    private async sendToReview(req:Request<ReqParams<'taskId'>> , res : Response) : Promise<void> {
        const taskId = parseInt(req.params.taskId,10);
        const authorId = req.user!.id;
        const result = await this.gatewayVersionSevice.sendToReview(taskId,authorId);

        handleResponse(res,result);
    }

    private async acceptReview(req:Request<ReqParams<'taskId'>> , res : Response) : Promise<void> {
        const taskId = parseInt(req.params.taskId,10);
        const authorId = req.user!.id;
        const result = await this.gatewayVersionSevice.acceptReview(taskId,authorId);

        handleResponse(res,result);
    }

    private async rejectReview(req:Request<ReqParams<'taskId'>> , res : Response) : Promise<void> {
        const taskId = parseInt(req.params.taskId,10);
        const authorId = req.user!.id;
        const { commentText } = req.body;
        
        if (!commentText || commentText.trim() === "") {
            res.status(400).json({ message: "Comment text is required" });
            return;
        }

        const result = await this.gatewayVersionSevice.rejectReview(taskId,authorId,commentText);
        handleResponse(res,result);
    }

    private async getReviews(req : Request , res : Response) : Promise<void> {

        const result = await this.gatewayVersionSevice.getReviews();
        handleResponse(res,result);
    }
    
    public getRouter(): Router {
        return this.router;
    }
}