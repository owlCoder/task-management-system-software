import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { Repository } from "typeorm";
import { initialize_database } from "./Database/InitializeConnection";
import { Db } from "./Database/DbConnectionPool";
import { Review } from "./Domain/models/Review";
import { ReviewComment } from "./Domain/models/ReviewComment";
import { ReviewService } from "./Services/ReviewService";
import { ReviewController } from "./WebAPI/controllers/ReviewController";
import { TaskTemplate } from "./Domain/models/TaskTemplate";
import { TemplateDependency } from "./Domain/models/TemplateDependency";
import { TemplateService } from "./Services/TemplateService";
import { TemplateController } from "./WebAPI/TemplateConroller";
import { TaskServiceClient } from "./Services/external-services/TaskServiceClient";

dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map(m => m.trim()) ??
  ["GET", "POST"];

app.use(cors({ origin: corsOrigin, methods: corsMethods }));
app.use(express.json());

(async () => {
  await initialize_database();

  const reviewRepository: Repository<Review> = Db.getRepository(Review);
  const reviewCommentRepository: Repository<ReviewComment> = Db.getRepository(ReviewComment);

  const reviewService = new ReviewService(reviewRepository, reviewCommentRepository);

  const reviewController = new ReviewController(reviewService);

  const templateRepository: Repository<TaskTemplate> = Db.getRepository(TaskTemplate);
  const dependenciesRepository: Repository<TemplateDependency> = Db.getRepository(TemplateDependency);
  const taskService = new TaskServiceClient();
  const templateService = new TemplateService(templateRepository, dependenciesRepository, taskService);

  const templateController = new TemplateController(templateService);



  app.use("/api/v1", reviewController.getRouter());
  app.use("/api/v1", templateController.getRouter());
})();

export default app;
