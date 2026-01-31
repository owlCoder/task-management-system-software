import { Router, Request, Response } from "express";
import { ITaskService } from "../../Domain/services/ITaskService";
import { ICommentService } from "../../Domain/services/ICommentService";
import { CreateTaskDTO } from "../../Domain/DTOs/CreateTaskDTO";
import { UpdateTaskDTO } from "../../Domain/DTOs/UpdateTaskDTO";
import { CreateCommentDTO } from "../../Domain/DTOs/CreateCommentDTO";
import { taskToTaskDTO } from "../../Utils/Converters/TaskConverter";
import { commentToCommentDTO } from "../../Utils/Converters/CommentConverter";
import { ITaskVersionService } from "../../Domain/services/ITaskVersionService";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";
import { validateCreateTask, validateTaskId, validateUpdateTask, validateUpdateTaskStatus } from "../validators/TaskValidators";
import { validateCommentId, validateCreateComment } from "../validators/CommentValidators";
import { UpdateTaskStatusDTO } from "../../Domain/DTOs/UpdateTaskStatusDTO";

export class TaskController {
    private readonly router: Router;

    constructor(private taskService: ITaskService,
        private commentService: ICommentService,
        private taskVersionService: ITaskVersionService,
        private readonly siemService: ISIEMService,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes() {
        // TASKS
        this.router.get('/tasks/:taskId', this.getTaskById.bind(this));
        this.router.post('/tasks/sprints/batch', this.getTasksForSprintIds.bind(this));
        this.router.post('/tasks/sprints/:sprintId', this.addTaskForSprint.bind(this));
        this.router.put('/tasks/:taskId', this.updateTask.bind(this));
        this.router.delete('/tasks/:taskId', this.deleteTask.bind(this));
        this.router.patch('/tasks/:taskId/status', this.updateTaskStatus.bind(this));

        // GET ALL TASKS FOR PROJECT
        this.router.get('/tasks/sprints/:sprintId', this.getAllTasksForSprint.bind(this));

        // COMMENTS
        this.router.post('/tasks/:taskId/comments', this.addCommentToTask.bind(this));
        this.router.delete('/comments/:commentId', this.deleteComment.bind(this));

        // TASK VERSIONS
        this.router.get("/tasks/:taskId/versions", this.getTaskVersions.bind(this));
        this.router.get("/tasks/:taskId/versions/:versionId", this.getTaskVersionById.bind(this));
    }

    async addTaskForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.sprintId as string, 10);
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }

            const createTask = req.body as CreateTaskDTO;
            const dtoValidation = validateCreateTask(createTask);
            if (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                return;
            }

            const result = await this.taskService.addTaskForSprint(sprintId, createTask, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }

    async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string, 10);
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.getTaskById(taskId, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }

    async getAllTasksForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.sprintId as string, 10);

            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.getAllTasksForSprint(sprintId, user_id);

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message)
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }

    async getTasksForSprintIds(req: Request, res: Response): Promise<void> {
        try {
            const sprintIds = req.body?.sprint_ids;
            if (!Array.isArray(sprintIds) || sprintIds.length === 0) {
                res.status(400).json({ message: "Sprint ids were not provided" });
                return;
            }

            const parsed = sprintIds
                .map((id) => Number.parseInt(id, 10))
                .filter((id) => Number.isFinite(id) && id > 0);

            if (parsed.length === 0) {
                res.status(400).json({ message: "Invalid sprint IDs" });
                return;
            }

            const result = await this.taskService.getTasksBySprintIds(parsed);

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }
        } catch(error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }

    async addCommentToTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string, 10);
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }

            const createComment = req.body as CreateCommentDTO;
            const dtoValidation = validateCreateComment(createComment);
            if  (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                return;
            }

            const result = await this.commentService.addComment(taskId, createComment, user_id);

            if (result.success) {
                res.status(200).json(commentToCommentDTO(result.data, taskId));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string, 10);
            
            const taskIdValidation = validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const updateTaskDTO: UpdateTaskDTO = req.body;

            const dtoValidation = validateUpdateTask(updateTaskDTO);
            if (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                return;
            }

            const result = await this.taskService.updateTask(taskId, updateTaskDTO, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error",),
            );
        }
    }

    async updateTaskStatus(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string);

            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }

            const updateStatusDTO = req.body as UpdateTaskStatusDTO;
            const dtoValidation = validateUpdateTaskStatus(updateStatusDTO);
            if (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                return;
            }

            const result = await this.taskService.updateTaskStatus(taskId, updateStatusDTO, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error"),
            );
        }
    }


    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string, 10);

            const taskIdValidation = validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.deleteTask(taskId, user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
             this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error" 
                ),
            );
        }
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = parseInt(req.params.commentId as string, 10);

            const commentIdValidation = validateCommentId(commentId);
            if (!commentIdValidation.isValid) {
                res.status(400).json({ message: commentIdValidation.message });
                return;
            }

            const user_id = parseInt(req.headers['x-user-id'] as string, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.commentService.deleteComment(commentId, user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(result.errorCode).json({ message: result.message });
                this.siemService.sendEvent(
                    generateEvent("task-microservice", req, result.errorCode, result.message),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, error instanceof Error ? error.message : "Internal server error",),
            );
        }
    }

    private async getTaskVersions(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId as string, 10);
            if(isNaN(taskId)){
                res.status(400).json({ error: "Invalid taskId" });
                return;
            }

            const versions = await this.taskVersionService.getVersionsForTask(taskId);
            res.status(200).json(versions);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, "Internal server error"),
            );
        }
    }

    private async getTaskVersionById(req: Request, res: Response): Promise<void> {
        try {
            const versionId = parseInt(req.params.versionId as string, 10);

            if (isNaN(versionId)) {
                res.status(400).json({ message: "Invalid version ID" });
                return;
            }

            const version = await this.taskVersionService.getVersionById(versionId);
            res.status(200).json(version);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent("task-microservice", req, 500, "Internal server error"),
            );
        }
    }
}
