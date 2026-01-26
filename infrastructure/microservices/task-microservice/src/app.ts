import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { Db } from './Database/DbConnectionPool';
import { Task } from './Domain/models/Task';
import { Comment } from './Domain/models/Comment';
import { ITaskService } from './Domain/services/ITaskService';
import { TaskService } from './Services/TaskService';
import { TaskController } from './WebAPI/controllers/TaskController';
import { ICommentService } from './Domain/services/ICommentService';
import { CommentService } from './Services/CommentServices';
import { IProjectServiceClient } from './Domain/services/external-services/IProjectServiceClient';
import { ProjectServiceClient } from './Services/external-services/ProjectServiceClient';
import { IUserServiceClient } from './Domain/services/external-services/IUserServiceClient';
import { UserServiceClient } from './Services/external-services/UserServiceClient';
import { TaskVersion } from './Domain/models/TaskVersion';
import { TaskVersionService } from './Services/TaskVersionService';
import { ITaskVersionService } from './Domain/services/ITaskVersionService';
import { IFileServiceClient } from './Domain/services/external-services/IFileServiceClient';
import { FileServiceClient } from './Services/external-services/FileServiceClient';


dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET","POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

(async () => {
  await initialize_database();

  // ORM Repositories
  const taskRepository: Repository<Task> = Db.getRepository(Task);
  const commentRepository: Repository<Comment> = Db.getRepository(Comment);
  const taskVersionRepository: Repository<TaskVersion> = Db.getRepository(TaskVersion);

  // Services
  const fileServiceClient : IFileServiceClient = new FileServiceClient();
  const projectServiceClient : IProjectServiceClient = new ProjectServiceClient();
  const userServiceClient: IUserServiceClient = new UserServiceClient();
  const taskVersionService: ITaskVersionService = new TaskVersionService(taskVersionRepository);
  const taskService : ITaskService = new TaskService(taskRepository,projectServiceClient,userServiceClient,taskVersionService,fileServiceClient);
  const commentService : ICommentService = new CommentService(
    taskRepository,
    commentRepository,
    projectServiceClient,
    userServiceClient
  );

  // WebAPI routes
  const taskController = new TaskController(taskService,commentService,taskVersionService);
  // Registering routes
  app.use('/api/v1', taskController.getRouter());
  //health
  app.get("/health", (req, res) => {res.status(200).send("OK");});
})();
export default app;
