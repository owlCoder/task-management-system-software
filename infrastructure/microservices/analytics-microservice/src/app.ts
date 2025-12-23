import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import dotenv from 'dotenv';
import { IProjectAnalyticsService } from './Domain/services/IProjectAnalyticsService';
import { ProjectAnalyticsService } from './Services/ProjectAnalyticsService';
import { AnalyticsController } from './WebAPI/controllers/AnalyticsController';
import { IFinancialAnalyticsService } from './Domain/services/IFinancialAnalyticsService';
import { FinancialAnalyticsService } from './Services/FinancialAnalyticsService';

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

(async () => {

  //TODO: NAKON SASTANKA SA PROJECT I TASK TIMOM - ODRADITI

  // //Services
  // const projectAnalyticsService: IProjectAnalyticsService = new ProjectAnalyticsService();
  // const financialAnalyticsService: IFinancialAnalyticsService = new FinancialAnalyticsService();

  // // WebAPI routes
  // const analyticsController = new AnalyticsController(projectAnalyticsService, financialAnalyticsService);

  // // Registering routes
  // app.use('/api/v1', analyticsController.getRouter());
})();
export default app;
