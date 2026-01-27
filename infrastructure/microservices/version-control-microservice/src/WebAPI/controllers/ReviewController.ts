import { IReviewService } from "../../Domain/services/IReview";
import { Router, Request, Response } from "express";
import { errorCodeToHttpStatus } from "../../Utils/Converters/ErrorCodeConverter";
import { ReviewStatus } from "../../Domain/enums/ReviewStatus";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";


export class ReviewController {
  private readonly router: Router;

  constructor(
    private readonly reviewService: IReviewService,    
    private readonly siemService: ISIEMService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private normalizeRole(role: unknown): string {
    if (typeof role !== "string") return "";
    return role.trim().toUpperCase().replace(/[\s_-]+/g, "");
  }

  private isProjectManager(role: unknown): boolean {
    return this.normalizeRole(role) === "PROJECTMANAGER";
  }

  private initializeRoutes() {
    this.router.get("/reviews", this.getReviews.bind(this));
    this.router.post("/reviews/:taskId/send", this.sendReview.bind(this));
    this.router.post("/reviews/:taskId/accept", this.approveReview.bind(this));
    this.router.post("/reviews/:taskId/reject", this.rejectReview.bind(this));
    this.router.get("/reviews/:taskId/history", this.getReviewHistory.bind(this));
    this.router.get("/reviews", this.getReviews.bind(this));
    this.router.get("/reviewComments/:commentId", this.getCommentById.bind(this));
  }

  async sendReview(req: Request, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.taskId);
      if (isNaN(taskId)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
      }

      const userIdHeader = req.headers["x-user-id"];
      if (typeof userIdHeader !== "string") {
        res.status(400).json({ message: "Missing or invalid x-user-id header" });
        return;
      }

      const user_id = parseInt(userIdHeader, 10);
      if (isNaN(user_id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
      }

      const result = await this.reviewService.sendToReview(taskId, user_id);

      if (result.success) {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",
          req,
          200,
          "Request successful | Task sent for review",
        ),
      );
        res.status(200).json(result.data);
      } else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async approveReview(req: Request, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.taskId);
      if (isNaN(taskId)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
      }

      const userRole = req.headers["x-user-role"];
      if (!this.isProjectManager(userRole)) {
        res.status(403).json({ message: "Only Project Manager can approve review" });
        return;
      }

      const userIdHeader = req.headers["x-user-id"];
      if (typeof userIdHeader !== "string") {
        res.status(400).json({ message: "Missing or invalid x-user-id header" });
        return;
      }

      const user_id = parseInt(userIdHeader, 10);
      if (isNaN(user_id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
      }

      const result = await this.reviewService.approveReview(taskId, user_id);

      if (result.success) {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",
          req,
          200,
          "Request successful | Review succefully approved",
        ),
      );
        res.status(200).json(result.data);
      } else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async rejectReview(req: Request, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.taskId);
      if (isNaN(taskId)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
      }

      const userRole = req.headers["x-user-role"];
      if (!this.isProjectManager(userRole)) {
        res.status(403).json({ message: "Only Project Manager can reject review" });
        return;
      }

      const userIdHeader = req.headers["x-user-id"];
      if (typeof userIdHeader !== "string") {
        res.status(400).json({ message: "Missing or invalid x-user-id header" });
        return;
      }

      const user_id = parseInt(userIdHeader, 10);
      if (isNaN(user_id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
      }

      const { commentText } = req.body;
      if (!commentText || commentText.trim() === "") {
        res.status(400).json({ message: "Reject comment is required" });
        return;
      }

      const result = await this.reviewService.rejectReview(taskId, user_id, commentText);

      if (result.success) {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",
          req,
          200,
          "Request successful | Review succesfully rejected",
        ),
      );
        res.status(200).json(result.data);
      } else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"];
      if (!this.isProjectManager(userRole)) {
        res.status(403).json({ message: "Only Project Manager can view reviews" });
        return;
      }

      const statusRaw = (req.query.status as string | undefined)?.toUpperCase();
      const status =
        statusRaw && (Object.values(ReviewStatus) as string[]).includes(statusRaw)
          ? (statusRaw as ReviewStatus)
          : undefined;

      const result = await this.reviewService.getReviews(status);

      if (result.success) 
      {
        this.siemService.sendEvent(generateEvent(
        "version-control-microservice",
        req,
        200,
        "Request successful | All reviews fetched",
        ),
      );
        res.status(200).json(result.data);
      }else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
          res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"];
      if (!this.isProjectManager(userRole)) {
        res.status(403).json({ message: "Only Project Manager can view review comments" });
        return;
      }

      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        res.status(400).json({ message: "Invalid comment ID" });
        return;
      }

      const result = await this.reviewService.getCommentById(commentId);

      if (result.success) 
      {
        this.siemService.sendEvent(generateEvent(
        "version-control-microservice",
        req,
        200,
        "Request successful | All comments fetched",
        ),
      );
        res.status(200).json(result.data);
      } else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getReviewHistory(req: Request, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.taskId);
      if (isNaN(taskId)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
      }

      const result = await this.reviewService.getReviewHistory(taskId);

      if (result.success) 
      {
        this.siemService.sendEvent(generateEvent(
        "version-control-microservice",
        req,
        200,
        "Request successful | All reviews for task",
        ),
      );
        res.status(200).json(result.data);
      } else {
        this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,result.code,result.error), 
        );
          res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
