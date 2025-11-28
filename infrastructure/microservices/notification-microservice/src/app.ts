import express from "express";
import cors from "cors";
import "reflect-metadata";
//import { initialize_database } from "./Database/InitializeConnection";
//import dotenv from "dotenv";  // resi problem skini npm i .dotenv nece iz nekog razloga ?
//import { Repository } from "typeorm";

//dotenv.config({ quiet: true });

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

/*
initialize_database();

// ORM Repositories
const userRepository: Repository<User> = Db.getRepository(User);
const userRoleRepository: Repository<UserRole> = Db.getRepository(UserRole);

// Services
const userService: IUsersService = new UsersService(userRepository);
const userRoleService: IUserRoleService = new UserRoleService(
  userRoleRepository
);
const logerService: ILogerService = new LogerService();

// WebAPI routes
const userController = new UsersController(
  userService,
  userRoleService,
  logerService
);
*/

// Registering routes
//app.use("/api/v1", userController.getRouter());

export default app;
