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
import { TemplateController } from "./WebAPI/controllers/TemplateConroller";
import { TaskServiceClient } from "./Services/external-services/TaskServiceClient";
import { UserServiceClient } from "./Services/external-services/UserServiceClient";
import { LogerService } from "./Services/LogerService";
import { SIEMService } from "./siem/Services/SIEMService";
import { INotifyService } from "./Domain/services/INotifyService";
import { NotifyService } from "./Services/NotifyService";

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

  const templateRepository: Repository<TaskTemplate> = Db.getRepository(TaskTemplate);
  const dependenciesRepository: Repository<TemplateDependency> = Db.getRepository(TemplateDependency);
  const taskService = new TaskServiceClient();
  const userService = new UserServiceClient();
  const notifyService: INotifyService = new NotifyService();
  const templateService = new TemplateService(templateRepository, dependenciesRepository, taskService, userService, notifyService);
  const logger = new LogerService();
  const siemService = new SIEMService(logger);

  const templateController = new TemplateController(templateService, logger, siemService);

  const reviewRepository: Repository<Review> = Db.getRepository(Review);
  const reviewCommentRepository: Repository<ReviewComment> = Db.getRepository(ReviewComment);

  const reviewService = new ReviewService(reviewRepository, reviewCommentRepository, userService, notifyService);

  const reviewController = new ReviewController(reviewService, siemService,logger);



  app.use("/api/v1", reviewController.getRouter());
  app.use("/api/v1", templateController.getRouter());
  //health
  app.get("/health", (req, res) => {res.status(200).send("OK");});
})();

export default app;
