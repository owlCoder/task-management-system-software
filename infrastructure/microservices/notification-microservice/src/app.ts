import express, { Application, Request, Response } from "express";
import "reflect-metadata";
import { createNotificationRoutes } from "./WebAPI/routes";
import { INotificationService } from "./Domain/services/INotificationService";
import { corsMiddleware } from "./Middleware/CorsMiddleware";
import { loggerMiddleware } from "./Middleware/LoggerMiddleware";
import { notFoundHandler, errorHandler } from "./Middleware/ErrorMiddleware";

export const createApp = (notificationService: INotificationService): Application => {
  
  const app: Application = express();

  // MIDDLEWARE
  app.use(corsMiddleware);                          // CORS zastita
  app.use(express.json());                          // JSON parser
  
  // DEBUG MIDDLEWARE - Loguj SVE zahteve
  app.use((req: Request, res: Response, next) => {
    console.log('🔥 MIDDLEWARE DEBUG:');
    console.log('  Method:', req.method);
    console.log('  Path:', req.path);
    console.log('  URL:', req.url);
    console.log('  Body:', JSON.stringify(req.body));
    console.log('  Headers:', JSON.stringify(req.headers));
    console.log('---');
    next();
  });
  
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
  app.use("/api", notificationRoutes);

  // DEBUG - Proveri da li bilo koja ruta nije matchovana
  app.use((req: Request, res: Response, next) => {
    console.log('⚠️⚠️⚠️ NO ROUTE MATCHED!');
    console.log('  Method:', req.method);
    console.log('  Path:', req.path);
    console.log('  URL:', req.url);
    console.log('  Body:', req.body);
    next();
  });

  // ERROR HANDLING
  app.use(notFoundHandler);  // 404 handler
  app.use(errorHandler);     // global error handler

  return app;
};

export default createApp;