import express from "express";
import cors from "cors";
import "reflect-metadata";
import { initialize_database } from "./Database/InitializeConnection";
import dotenv from "dotenv";
import { Repository } from "typeorm";
import { User } from "./Domain/models/User";
import { Db } from "./Database/DbConnectionPool";
import { IUsersService } from "./Domain/services/IUsersService";
import { UsersService } from "./Services/UsersService";
import { UsersController } from "./WebAPI/controllers/UsersController";
import { ILogerService } from "./Domain/services/ILogerService";
import { LogerService } from "./Services/LogerService";
import { UserRole } from "./Domain/models/UserRole";
import { UserRoleService } from "./Services/UserRoleService";
import { IUserRoleService } from "./Domain/services/IUserRoleService";
import { R2StorageService, IR2StorageService } from "./Storage/R2StorageService";

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

// ORM Repositories
const userRepository: Repository<User> = Db.getRepository(User);
const userRoleRepository: Repository<UserRole> = Db.getRepository(UserRole);

// Storage service
const storageService: IR2StorageService = new R2StorageService();

// Services
const userService: IUsersService = new UsersService(
  userRepository,
  userRoleRepository,
  storageService
);
const userRoleService: IUserRoleService = new UserRoleService(
  userRoleRepository
);
const logerService: ILogerService = new LogerService();

// WebAPI routes
const userController = new UsersController(
  userService,
  userRoleService,
  logerService,
  storageService
);

// Registering routes
app.use("/api/v1", userController.getRouter());

export default app;