import { Request, Response, Router } from "express";
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";
import { IGatewayVersionControlService } from "../../../Domain/services/version-control/IGatewayVersionControlService";
import { ReviewCommentDTO } from "../../../Domain/DTOs/version-control/ReviewCommentDTO";
import { ReviewPolicies } from "../../../Domain/access-policies/version-control/ReviewPolicies";
import { TemplatePolicies } from "../../../Domain/access-policies/version-control/TemplatePolicies";

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

        const templateReadAccess = [authenticate, authorize(...TemplatePolicies.READ)];
        const templateWriteAccess = [authenticate, authorize(...TemplatePolicies.WRITE)];

        this.router.get("/reviews",...reviewReadAccess,this.getReviews.bind(this));
        this.router.post("/reviews/:taskId/accept" ,...reviewWriteAccess,this.acceptReview.bind(this));
        this.router.post("/reviews/:taskId/reject" ,...reviewWriteAccess,this.rejectReview.bind(this));
        this.router.post("/reviews/:taskId/send" ,...reviewSendAccess,this.sendToReview.bind(this));

        this.router.get("/templates/:id",...templateReadAccess, this.getTemplate.bind(this));
        this.router.get("/templates", ...templateReadAccess, this.getAllTemplates.bind(this));
        this.router.post("/templates", ...templateWriteAccess, this.createTemplate.bind(this));
        this.router.post("/templates/:id/create", ...templateWriteAccess, this.createTask.bind(this));
        this.router.post("/templates/:template_id/dependencies/:dependsOn", ...templateWriteAccess, this.addDependency.bind(this));
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

    private async getTemplate(req: Request, res: Response) : Promise<void> {
        const template_id = parseInt(req.params.id, 10);

        const result = await this.gatewayVersionSevice.getTemplateById(template_id);
        handleResponse(res,result);
    }

    private async getAllTemplates(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayVersionSevice.getAllTemplates();

        handleResponse(res, result);
    }

    private async createTemplate(req: Request, res: Response): Promise<void> {
        const pm_id = req.user!.id;

        const data = req.body;

        const result = await this.gatewayVersionSevice.createTemplate(data, pm_id);

        handleResponse(res, result);
    }

    private async createTask(req: Request, res: Response): Promise<void> {
        const template_id = parseInt(req.params.id, 10);
        const sprint_id = parseInt(req.body.sprint_id, 10);
        const worker_id = parseInt(req.body.worker_id, 10);

        const pm_id = req.user!.id;

        const result = await this.gatewayVersionSevice.createTaskFromTemplate(template_id, sprint_id, worker_id, pm_id);

        handleResponse(res, result);
    }

    private async addDependency(req: Request, res: Response): Promise<void> {
        const template_id = parseInt(req.params.dependency_id, 10);
        const dependsOn = parseInt(req.params.dependsOn, 10);

        const pm_id = req.user!.id;

        const result = await this.gatewayVersionSevice.addDependency(template_id, dependsOn, pm_id);

        handleResponse(res, result);
    }

    
    public getRouter(): Router {
        return this.router;
    }
}