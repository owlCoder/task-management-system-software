import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { initialize_database } from "./Database/InitializeConnection";
import { Repository } from 'typeorm';
import { Project } from './Domain/models/Project';
import { ProjectUser } from './Domain/models/ProjectUser';
import { Sprint } from './Domain/models/Sprint';
import { Db } from './Database/DbConnectionPool';
import { IProjectService } from './Domain/services/IProjectService';
import { ProjectService } from './Services/ProjectService';
import { IProjectUserService } from './Domain/services/IProjectUserService';
import { ProjectUserService } from './Services/ProjectUserService';
import { ISprintService } from './Domain/services/ISprintService';
import { SprintService } from './Services/SprintService';
import { ProjectController } from './WebAPI/controllers/ProjectController';
import { ProjectUserController } from './WebAPI/controllers/ProjectUserController';
import { SprintController } from './WebAPI/controllers/SprintController';


dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(".").map((m) =>
  m.trim()
) ?? ["POST"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

(async () => {
  await initialize_database();

  //Repos
  const projectRepository: Repository<Project> = Db.getRepository(Project);
  const projectUserRepository: Repository<ProjectUser> = Db.getRepository(ProjectUser);
  const sprintRepository: Repository<Sprint> = Db.getRepository(Sprint);

  //Services
  const projectService: IProjectService = new ProjectService(projectRepository);
  const projectUserService: IProjectUserService = new ProjectUserService(
    projectUserRepository,
    projectRepository
  );
  const sprintService: ISprintService = new SprintService(
    sprintRepository,
    projectRepository
  );

  //Controllers
  const projectController = new ProjectController(projectService);
  const projectUserController = new ProjectUserController(projectUserService);
  const sprintController = new SprintController(sprintService);

  //Routes
  app.use("/api/v1", projectController.getRouter());
  app.use("/api/v1", projectUserController.getRouter());
  app.use("/api/v1", sprintController.getRouter());
})();

export default app;