import { IReviewService } from "../../Domain/services/IReview";
import { Router, Request, Response } from "express";
import { errorCodeToHttpStatus } from "../../Utils/Converters/ErrorCodeConverter";
import { ReviewStatus } from "../../Domain/enums/ReviewStatus";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";
import { ILogerService } from "../../Domain/services/ILogerService";

export class ReviewController {
  private readonly router: Router;

  constructor(
    private readonly reviewService: IReviewService,    
    private readonly siemService: ISIEMService,
    private readonly logger: ILogerService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes() {
    this.router.get("/reviews", this.getReviews.bind(this));
    this.router.post("/reviews/:taskId/send", this.sendReview.bind(this));
    this.router.post("/reviews/:taskId/accept", this.approveReview.bind(this));
    this.router.post("/reviews/:taskId/reject", this.rejectReview.bind(this));
    this.router.get("/reviews/:taskId/history", this.getReviewHistory.bind(this));
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

      this.logger.log("Sending review");
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
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
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

      this.logger.log("Approving review");

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
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
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

      this.logger.log("Rejecting review");
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
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {     
      const statusRaw = (req.query.status as string | undefined)?.toUpperCase();
      const status =
        statusRaw && (Object.values(ReviewStatus) as string[]).includes(statusRaw)
          ? (statusRaw as ReviewStatus)
          : undefined;

      this.logger.log(`Fetching all reviews for status ${status}`);
      const result = await this.reviewService.getReviews(status);

      if (result.success) 
      {
        res.status(200).json(result.data);
      }else {
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        res.status(400).json({ message: "Invalid comment ID" });
        return;
      }

      this.logger.log(`Fething comment with ID ${commentId}`);
      const result = await this.reviewService.getCommentById(commentId);

      if (result.success) 
      {
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
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

      this.logger.log(`Fetching review history for task with ID ${taskId}`);
      const result = await this.reviewService.getReviewHistory(taskId);

      if (result.success) 
      {
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        res.status(errorCodeToHttpStatus(result.code)).json({ message: result.error });
      }
    } catch (error) {
      this.logger.log((error as Error).message);
      this.siemService.sendEvent(generateEvent(
          "version-control-microservice",req,500,"Internal server error"), 
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
