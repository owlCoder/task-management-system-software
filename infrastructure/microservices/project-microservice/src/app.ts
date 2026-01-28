import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { initialize_database } from "./Database/InitializeConnection";
import { Repository } from "typeorm";
import { Project } from "./Domain/models/Project";
import { ProjectUser } from "./Domain/models/ProjectUser";
import { Sprint } from "./Domain/models/Sprint";
import { Db } from "./Database/DbConnectionPool";
import { IProjectService } from "./Domain/services/IProjectService";
import { ProjectService } from "./Services/ProjectService";
import { IProjectUserService } from "./Domain/services/IProjectUserService";
import { ProjectUserService } from "./Services/ProjectUserService";
import { ISprintService } from "./Domain/services/ISprintService";
import { SprintService } from "./Services/SprintService";
import { ProjectController } from "./WebAPI/controllers/ProjectController";
import { ProjectUserController } from "./WebAPI/controllers/ProjectUserController";
import { SprintController } from "./WebAPI/controllers/SprintController";
import { R2StorageService, IR2StorageService } from "./Storage/R2StorageService";
import { LogerService } from "./Services/LogerService";
import { SIEMService } from "./Siem/Services/SIEMService";
import { INotifyService } from "./Domain/services/INotifyService";
import { NotifyService } from "./Services/NotifyService";

dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? [
    "GET",
    "POST",
    "PUT",
    "DELETE",
];

app.use(
    cors({
        origin: corsOrigin,
        methods: corsMethods,
    })
);

app.use(express.json());

(async () => {
    await initialize_database();

    // Storage Service
    const storageService: IR2StorageService = new R2StorageService();

    // Repos
    const projectRepository: Repository<Project> = Db.getRepository(Project);
    const projectUserRepository: Repository<ProjectUser> = Db.getRepository(ProjectUser);
    const sprintRepository: Repository<Sprint> = Db.getRepository(Sprint);

    const notifyService: INotifyService = new NotifyService();
    const projectUserService: IProjectUserService = new ProjectUserService(
        projectUserRepository,
        projectRepository,
        notifyService
    );
    const projectService: IProjectService = new ProjectService(
        projectRepository, 
        storageService, 
        projectUserService,
        notifyService
    );
    const sprintService: ISprintService = new SprintService(sprintRepository, projectRepository);

    // Controllers
    const logerService = new LogerService();
    const siemService = new SIEMService(logerService);
    const projectController = new ProjectController(projectService, storageService, projectUserService, logerService, siemService);
    const projectUserController = new ProjectUserController(projectUserService, logerService, siemService);
    const sprintController = new SprintController(sprintService, logerService, siemService);

    // Routes
    app.use("/api/v1", projectController.getRouter());
    app.use("/api/v1", projectUserController.getRouter());
    app.use("/api/v1", sprintController.getRouter());
})();

export default app;
