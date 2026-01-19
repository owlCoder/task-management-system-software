import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Project } from "./Domain/models/Project";
import { Sprint } from "./Domain/models/Sprint";
import { ProjectUser } from "./Domain/models/ProjectUser";

import { Task } from "./Domain/models/Task";
import { Comment } from "./Domain/models/Comment";

import { IProjectAnalyticsService } from "./Domain/services/IProjectAnalyticsService";
import { ProjectAnalyticsService } from "./Services/ProjectAnalyticsService";

import { IFinancialAnalyticsService } from "./Domain/services/IFinancialAnalyticsService";
// import { FinancialAnalyticsService } from "./Services/FinancialAnalyticsService";

import { AnalyticsController } from "./WebAPI/controllers/AnalyticsController";

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
   DATA SOURCES
=========================== */

// projects_db DataSource
const projectsDataSource = new DataSource({
  type: "mysql",
  host: env("PROJECTS_DB_HOST", env("DB_HOST")),
  port: numEnv("PROJECTS_DB_PORT", numEnv("DB_PORT", 3306)),
  username: env("PROJECTS_DB_USER", env("DB_USER")),
  password: env("PROJECTS_DB_PASSWORD", env("DB_PASSWORD")),
  database: env("PROJECTS_DB_NAME", "projects_db"),
  ssl: buildSsl(),

  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  logging: ["error"],


  entities: [Project, Sprint, ProjectUser],
});

// tasks_db DataSource
const tasksDataSource = new DataSource({
  type: "mysql",
  host: env("TASKS_DB_HOST", env("DB_HOST")),
  port: numEnv("TASKS_DB_PORT", numEnv("DB_PORT", 3306)),
  username: env("TASKS_DB_USER", env("DB_USER")),
  password: env("TASKS_DB_PASSWORD", env("DB_PASSWORD")),
  database: env("TASKS_DB_NAME", "tasks_db"),
  ssl: buildSsl(),

  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  logging: ["error"],

  entities: [Task],
});

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

  // Init DB connections
  if (!projectsDataSource.isInitialized) {
    await projectsDataSource.initialize();

  }
  if (!tasksDataSource.isInitialized) {
    await tasksDataSource.initialize();
  }

  // Best-effort read-only guards
  enforceReadOnly(projectsDataSource);
  enforceReadOnly(tasksDataSource);


  // Repos
  const projectRepository = projectsDataSource.getRepository(Project);
  const sprintRepository = projectsDataSource.getRepository(Sprint);
  const taskRepository = tasksDataSource.getRepository(Task);



  const count = await sprintRepository.count();
  console.log(count);



  // Services
  const projectAnalyticsService: IProjectAnalyticsService =
    new ProjectAnalyticsService(taskRepository, sprintRepository, projectRepository);

  // const financialAnalyticsService: IFinancialAnalyticsService =
  // new FinancialAnalyticsService(projectRepository, sprintRepository, taskRepository);

  // Controller
  const analyticsController = new AnalyticsController(
    projectAnalyticsService
    // financialAnalyticsService
  );

  // Routes
  app.use("/api/v1", analyticsController.getRouter());

  // Health
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  initialized = true;
  return app;
}

export default app;
