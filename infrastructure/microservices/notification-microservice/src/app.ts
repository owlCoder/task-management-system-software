import express, { Application, Request, Response } from "express";
import "reflect-metadata";
import { createNotificationRoutes } from "./WebAPI/routes";
import { INotificationService } from "./Domain/Services/INotificationService";
import { corsMiddleware } from "./Middleware/CorsMiddleware";
import { loggerMiddleware } from "./Middleware/LoggerMiddleware";
import { notFoundHandler, errorHandler } from "./Middleware/ErrorMiddleware";

export const createApp = (notificationService: INotificationService): Application => {
  
  const app: Application = express();

  // MIDDLEWARE
  app.use(corsMiddleware);                          // CORS zastita
  app.use(express.json());                          // JSON parser
  
  app.use(express.urlencoded({ extended: true })); // URL encoded parser
  app.use(loggerMiddleware);                        // request logger

  // ROUTES
  // Health Check Route
  // GET /health - Provera da li je server aktivan
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "OK",
      service: process.env.SERVICE_NAME || "Notification Service",
      version: process.env.SERVICE_VERSION || "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // notification routes
  // sve rute su pod /api prefiksom
  const notificationRoutes = createNotificationRoutes(notificationService);
  app.use("/api/v1", notificationRoutes);

  // ERROR HANDLING
  app.use(notFoundHandler);  // 404 handler
  app.use(errorHandler);     // global error handler

  return app;
};

export default createApp;