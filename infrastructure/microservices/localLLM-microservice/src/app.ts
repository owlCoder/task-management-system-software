import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { llmRoutes } from "./routes/llmRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ quiet: true });

export async function initApp() {
  const app = express();

  const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4000";

  app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "local-llm-service" });
  });

  app.use("/api/v1/llm", llmRoutes);

  app.use(errorHandler);

  return app;
}
