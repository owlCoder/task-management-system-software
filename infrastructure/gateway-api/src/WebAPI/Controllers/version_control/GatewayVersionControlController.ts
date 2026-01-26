// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayVersionControlService } from "../../../Domain/services/version-control/IGatewayVersionControlService";
import { TemplatePolicies } from "../../../Domain/access-policies/version-control/TemplatePolicies";
import { RejectReviewDTO } from "../../../Domain/DTOs/version-control/RejectReviewDTO";
import { CreateTaskDTO } from "../../../Domain/DTOs/version-control/CreateTaskDTO";
import { CreateTemplateDTO } from "../../../Domain/DTOs/version-control/CreateTemplateDTO";
import { ReviewPolicies } from "../../../Domain/access-policies/version-control/ReviewPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

export class GatewayVersionControlController {
    private readonly router: Router;

    constructor(private readonly gatewayVersionSevice : IGatewayVersionControlService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const reviewReadAccess = [authenticate, authorize(...ReviewPolicies.READ)];
        const reviewWriteAccess = [authenticate, authorize(...ReviewPolicies.WRITE)];

        const templateReadAccess = [authenticate, authorize(...TemplatePolicies.READ)];
        const templateWriteAccess = [authenticate, authorize(...TemplatePolicies.WRITE)];

        this.router.get("/reviews", ...reviewReadAccess, this.getReviews.bind(this));
        this.router.get("/reviews/:taskId/history", ...reviewReadAccess, this.getReviewHistory.bind(this));
        this.router.post("/reviews/:taskId/accept", ...reviewWriteAccess, this.acceptReview.bind(this));
        this.router.post("/reviews/:taskId/reject", ...reviewWriteAccess, this.rejectReview.bind(this));
        this.router.post("/reviews/:taskId/send", authenticate, this.sendToReview.bind(this));

        this.router.get("/templates/:templateId", ...templateReadAccess, this.getTemplate.bind(this));
        this.router.get("/templates", ...templateReadAccess, this.getAllTemplates.bind(this));
        this.router.post("/templates", ...templateWriteAccess, this.createTemplate.bind(this));
        this.router.post("/templates/:templateId/create", ...templateWriteAccess, this.createTask.bind(this));
        this.router.post("/templates/:templateId/dependencies/:dependsOnId", ...templateWriteAccess, this.addDependency.bind(this));
        this.router.get("/reviewComments/:commentId", ...reviewReadAccess, this.getReviewComment.bind(this));

    }

    private async getReviews(req: Request, res: Response): Promise<void> {
        const senderRole = req.user!.role;
        const status = typeof req.query.status === "string" ? req.query.status : undefined;

        const result = await this.gatewayVersionSevice.getReviews(senderRole, { status });
        handleResponse(res, result);
    }

    private async getReviewHistory(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const senderRole = req.user!.role;

        const result = await this.gatewayVersionSevice.getReviewHistory(taskId, senderRole);
        handleResponse(res, result);
    }

    private async getReviewComment(req: Request<ReqParams<'commentId'>>, res: Response): Promise<void> {
        const commentId = parseInt(req.params.commentId, 10);
        const senderRole = req.user!.role;

        const result = await this.gatewayVersionSevice.getReviewComment(commentId, senderRole);
        handleResponse(res, result);
    }

    private async sendToReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const senderId = req.user!.id;
        const senderRole = req.user!.role;

        const result = await this.gatewayVersionSevice.sendToReview(taskId, senderId, senderRole);
        handleResponse(res, result, 201);
    }

    private async acceptReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const senderId = req.user!.id;
        const senderRole = req.user!.role;

        const result = await this.gatewayVersionSevice.acceptReview(taskId, senderId, senderRole);
        handleResponse(res, result, 201);
    }

    private async rejectReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const data = req.body as RejectReviewDTO;
        const senderId = req.user!.id;
        const senderRole = req.user!.role;

        const result = await this.gatewayVersionSevice.rejectReview(taskId, data, senderId, senderRole);
        handleResponse(res, result, 201);
    }

    private async getTemplate(req: Request<ReqParams<'templateId'>>, res: Response): Promise<void> {
        const templateId = parseInt(req.params.templateId, 10);

        const result = await this.gatewayVersionSevice.getTemplateById(templateId);
        handleResponse(res,result);
    }

    private async getAllTemplates(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayVersionSevice.getAllTemplates();
        handleResponse(res, result);
    }

    private async createTemplate(req: Request, res: Response): Promise<void> {
        const data = req.body as CreateTemplateDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.createTemplate(data, senderId);
        handleResponse(res, result, 201);
    }

    private async createTask(req: Request<ReqParams<'templateId'>>, res: Response): Promise<void> {
        const templateId = parseInt(req.params.templateId, 10);
        const data = req.body as CreateTaskDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.createTaskFromTemplate(templateId, data, senderId);
        handleResponse(res, result, 201);
    }

    private async addDependency(req: Request<ReqParams<'templateId' | 'dependsOnId'>>, res: Response): Promise<void> {
        const templateId = parseInt(req.params.templateId, 10);
        const dependsOnId = parseInt(req.params.dependsOnId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.addDependency(templateId, dependsOnId, senderId);
        handleEmptyResponse(res, result);
    }
    
    public getRouter(): Router {
        return this.router;
    }
}
