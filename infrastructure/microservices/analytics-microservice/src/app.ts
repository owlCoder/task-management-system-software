import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { IProjectAnalyticsService } from "./Domain/services/IProjectAnalyticsService";
import { ProjectAnalyticsService } from "./Services/ProjectAnalyticsService";

import { IFinancialAnalyticsService } from "./Domain/services/IFinancialAnalyticsService";
import { FinancialAnalyticsService } from "./Services/FinancialAnalyticsService";
import { ProjectServiceClient } from "./Services/external-services/ProjectServiceClient";
import { TaskServiceClient } from "./Services/external-services/TaskServiceClient";
import { IProjectServiceClient } from "./Services/external-services/IProjectServiceClient";
import { ITaskServiceClient } from "./Services/external-services/ITaskServiceClient";

import { AnalyticsController } from "./WebAPI/controllers/AnalyticsController";
import { ILogerService } from "./Domain/services/ILogerService";
import { LogerService } from "./Services/LogerService";
import { ISIEMService } from "./siem/Domen/services/ISIEMService";
import { SIEMService } from "./siem/Services/SIEMService";
import { IBusinessInsightsService } from "./Services/external-services/IBusinessInsightsService";
import { BusinessInsightsService } from "./Services/external-services/BusinessInsightsService";
import { ILLMAnalyticsService } from "./Services/external-services/ILLMAnalyticsService";
import { LLMAnalyticsService } from "./Services/external-services/LLMAnalyticsService";

dotenv.config({ quiet: true });

const app = express();

/* ===========================
   CORS
=========================== */
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? ["GET", "OPTIONS"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

/* ===========================
   READ-ONLY HTTP GUARD
=========================== */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res
      .status(405)
      .json({ error: "Analytics microservice is read-only (GET only)." });
  }
  next();
});

/* ===========================
/* ===========================
   ENV HELPERS (fallbacks)
   - By default analytics can reuse DB_HOST/DB_PORT/DB_USER/DB_PASSWORD
   - and override only DB name per DB.
=========================== */
function env(name: string, fallback?: string) {
  const v = process.env[name];
  return v !== undefined && v !== "" ? v : fallback;
}

function numEnv(name: string, fallback?: number) {
  const v = process.env[name];
  const n = v ? Number(v) : undefined;
  return Number.isFinite(n) ? (n as number) : fallback;
}

/*
  Set DB_SSL="true" if needed.
 */
function buildSsl() {
  const sslOn = (process.env.DB_SSL ?? "false").toLowerCase() === "true";
  return sslOn ? { rejectUnauthorized: false } : undefined;
}




/* ===========================
   RUNTIME WRITE/DDL BLOCKER
=========================== */
function enforceReadOnly(ds: DataSource) {
  const originalCreateQueryRunner = ds.createQueryRunner.bind(ds);
  const originalDsQuery = ds.query.bind(ds);

  const isWriteOrDDL = (sql: string) => {
    const q = sql.trim().toUpperCase();
    return (
      q.startsWith("INSERT") ||
      q.startsWith("UPDATE") ||
      q.startsWith("DELETE") ||
      q.startsWith("REPLACE") ||
      q.startsWith("ALTER") ||
      q.startsWith("DROP") ||
      q.startsWith("CREATE") ||
      q.startsWith("TRUNCATE") ||
      q.startsWith("GRANT") ||
      q.startsWith("REVOKE")
    );
  };

  // ds.createQueryRunner = (...args: any[]) => {
  //   const qr = originalCreateQueryRunner(...args);
  //   const originalQrQuery = qr.query.bind(qr);

  //   qr.query = async (query: string, parameters?: any[]) => {
  //     if (isWriteOrDDL(query)) {
  //       throw new Error("READ-ONLY MODE: write/DDL queries are blocked.");
  //     }
  //     return originalQrQuery(query, parameters);
  //   };

  //   return qr;
  // };

  //block direct ds.query usage
  ds.query = async (query: string, parameters?: any[]) => {
    if (isWriteOrDDL(query)) {
      throw new Error("READ-ONLY MODE: write/DDL queries are blocked.");
    }
    return originalDsQuery(query, parameters);
  };
}

/* ===========================
   INIT + ROUTES
=========================== */
let initialized = false;

export async function initApp(): Promise<express.Express> {
  if (initialized) return app;

  // Services

  const projectServiceClient: IProjectServiceClient = new ProjectServiceClient();
  const taskServiceClient: ITaskServiceClient = new TaskServiceClient();

  const projectAnalyticsService: IProjectAnalyticsService =
    new ProjectAnalyticsService(projectServiceClient, taskServiceClient);
  const financialAnalyticsService: IFinancialAnalyticsService =
    new FinancialAnalyticsService(projectServiceClient, taskServiceClient);
  const loggerService: ILogerService = new LogerService();
  const siemService: ISIEMService = new SIEMService(loggerService);
  const llmAnalyticsService : ILLMAnalyticsService = new LLMAnalyticsService();

  const businessInsightsService: IBusinessInsightsService =
    new BusinessInsightsService(
      projectAnalyticsService,
      financialAnalyticsService,
      projectServiceClient,
      llmAnalyticsService
    );

  // Controller
  const analyticsController = new AnalyticsController(
    projectAnalyticsService,
    financialAnalyticsService,
    loggerService,
    siemService,
    businessInsightsService
  );

  // Routes
  app.use("/api/v1", analyticsController.getRouter());

  // Health
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  initialized = true;
  return app;
}

export default app;
