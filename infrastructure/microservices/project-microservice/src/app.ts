import express from "express";
import cors from "cors";
import "reflect-metadata";
import { initialize_database } from "./Database/InitializeConnection";
import dotenv from "dotenv";
import { Repository } from "typeorm";
import { Db } from "./Database/DbConnectionPool";
import { UsersController } from "./WebAPI/controllers/UsersController";
import { ILogerService } from "./Domain/services/ILogerService";
import { LogerService } from "./Services/LogerService";

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map((m) =>
  m.trim()
) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

initialize_database();

// Registering routes
//app.use("/api/v1", userController.getRouter());

export default app;
