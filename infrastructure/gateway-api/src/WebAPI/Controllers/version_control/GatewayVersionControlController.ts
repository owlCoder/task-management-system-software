// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayVersionControlService } from "../../../Domain/services/version-control/IGatewayVersionControlService";
import { TemplatePolicies } from "../../../Domain/access-policies/version-control/TemplatePolicies";
import { RejectReviewDTO } from "../../../Domain/DTOs/version-control/RejectReviewDTO";
import { ReviewDTO } from "../../../Domain/DTOs/version-control/ReviewDTO";
import { ReviewHistoryItemDTO } from "../../../Domain/DTOs/version-control/ReviewHistoryItemDTO";
import { ReviewCommentDTO } from "../../../Domain/DTOs/version-control/ReviewCommentDTO";
import { CreateTaskDTO } from "../../../Domain/DTOs/version-control/CreateTaskDTO";
import { CreateTemplateDTO } from "../../../Domain/DTOs/version-control/CreateTemplateDTO";
import { TaskTemplateDTO } from "../../../Domain/DTOs/version-control/TaskTemplateDTO";
import { TaskResponseDTO } from "../../../Domain/DTOs/version-control/TaskResponseDTO";
import { ReviewPolicies } from "../../../Domain/access-policies/version-control/ReviewPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { parseOptionalString } from "../../Utils/Query/QueryUtils";

/**
 * Routes client requests towards the Version-Control Microservice.
 */
export class GatewayVersionControlController {
    private readonly router: Router;

    constructor(private readonly gatewayVersionSevice : IGatewayVersionControlService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Version-Control Microservice.
     */
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
        this.router.get("/reviewComments/:commentId", ...reviewReadAccess, this.getReviewComment.bind(this));

        this.router.get("/templates/:templateId", ...templateReadAccess, this.getTemplate.bind(this));
        this.router.get("/templates", ...templateReadAccess, this.getAllTemplates.bind(this));
        this.router.post("/templates", ...templateWriteAccess, this.createTemplate.bind(this));
        this.router.post("/templates/:templateId/create", ...templateWriteAccess, this.createTask.bind(this));
        this.router.post("/templates/:templateId/dependencies/:dependsOnId", ...templateWriteAccess, this.addDependency.bind(this));
       

    }

    /**
     * GET /api/v1/reviews
     * @param {Request} req - the request object, containing the status in query.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ReviewDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getReviews(req: Request, res: Response): Promise<void> {
        const status = parseOptionalString(req.query.status)

        const result = await this.gatewayVersionSevice.getReviews({ status });
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/reviews/:taskId/history
     * @param {Request} req - the request object, containing the task id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ReviewHistoryItemDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getReviewHistory(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);

        const result = await this.gatewayVersionSevice.getReviewHistory(taskId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/reviewComments/:commentId
     * @param {Request} req - the request object, containing the comment id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ReviewCommentDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getReviewComment(req: Request<ReqParams<'commentId'>>, res: Response): Promise<void> {
        const commentId = parseInt(req.params.commentId, 10);

        const result = await this.gatewayVersionSevice.getReviewComment(commentId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/reviews/:taskId/send
     * @param {Request} req - the request object, containing the task id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link ReviewDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async sendToReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.sendToReview(taskId, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * POST /api/v1/reviews/:taskId/accept
     * @param {Request} req - the request object, containing the task id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link ReviewDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async acceptReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.acceptReview(taskId, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * POST /api/v1/reviews/:taskId/reject
     * @param {Request} req - the request object, containing the task id in params and reject review data in body as {@link RejectReviewDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link ReviewCommentDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async rejectReview(req: Request<ReqParams<'taskId'>>, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const data = req.body as RejectReviewDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.rejectReview(taskId, data, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * GET /api/v1/templates/:templateId
     * @param {Request} req - the request object, containing the template id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link TaskTemplateDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getTemplate(req: Request<ReqParams<'templateId'>>, res: Response): Promise<void> {
        const templateId = parseInt(req.params.templateId, 10);

        const result = await this.gatewayVersionSevice.getTemplateById(templateId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/templates
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link TaskTemplateDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAllTemplates(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayVersionSevice.getAllTemplates();
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/templates
     * @param {Request} req - the request object, containing the template data in body as {@link CreateTemplateDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link TaskTemplateDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createTemplate(req: Request, res: Response): Promise<void> {
        const data = req.body as CreateTemplateDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.createTemplate(data, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * POST /api/v1/templates/:templateId/create
     * @param {Request} req - the request object, containing the template id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link TaskResponseDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createTask(req: Request<ReqParams<'templateId'>>, res: Response): Promise<void> {
        const templateId = parseInt(req.params.templateId, 10);
        const data = req.body as CreateTaskDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayVersionSevice.createTaskFromTemplate(templateId, data, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * POST /api/v1/templates/:templateId/dependencies/:dependsOnId
     * @param {Request} req - the request object, containing the template id and dependency id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
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
