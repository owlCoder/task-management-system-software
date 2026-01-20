import { IReviewService } from "../../Domain/services/IReview";
import { Router, Request, Response } from "express";
import { toReviewDTO } from "../../Helpers/Converter/toReviewDTO";
import { errorCodeToHttpStatus } from "../../Utils/Converters/ErrorCodeConverter";

export class ReviewController {
  private readonly router: Router;

  constructor(private reviewService: IReviewService) {
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

      const result = await this.reviewService.sendToReview(taskId,user_id);

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res
          .status(errorCodeToHttpStatus(result.code))
          .json({ message: result.error });
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
      if (userRole !== "PROJECTMANAGER") {
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

      const result = await this.reviewService.approveReview(taskId,user_id);

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res
          .status(errorCodeToHttpStatus(result.code))
          .json({ message: result.error });
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
      if (userRole !== "PROJECTMANAGER") {
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

      const result = await this.reviewService.rejectReview(taskId, user_id,commentText);

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res
          .status(errorCodeToHttpStatus(result.code))
          .json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const userRole = req.headers["x-user-role"];
      if (userRole !== "PROJECTMANAGER") {
        res.status(403).json({ message: "Only Project Manager can view reviews" });
        return;
      }

      const result = await this.reviewService.getTaskForReview();

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res
          .status(errorCodeToHttpStatus(result.code))
          .json({ message: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
