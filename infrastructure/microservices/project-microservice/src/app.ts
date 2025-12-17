import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { LogerService } from "./Services/LogerService";
import { ProjectsController } from "./WebAPI/controllers/ProjectsController";

dotenv.config(/*{ quiet: true }*/);
console.clear();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

initialize_database();

const logger = new LogerService();

const projectsController = new ProjectsController(logger);

app.use("/api/v1", projectsController.getRouter());

app.get("/", (_req, res) => {
  res.send("Project Microservice up and running!");
});

app.listen(PORT, () => {
  logger.log(`Project microservice listening on port ${PORT}`);
});

export default app;
