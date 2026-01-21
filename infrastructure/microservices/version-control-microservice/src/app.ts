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

  app.use("/api/v1", reviewController.getRouter());
})();

export default app;
