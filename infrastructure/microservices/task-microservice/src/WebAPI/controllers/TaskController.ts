import { Router, Request, Response } from "express";
import { ITaskService } from "../../Domain/services/ITaskService";
import { ICommentService } from "../../Domain/services/ICommentService";
import { CreateTaskDTO } from "../../Domain/DTOs/CreateTaskDTO";
import { UpdateTaskDTO } from "../../Domain/DTOs/UpdateTaskDTO";
import { TaskDTO } from "../../Domain/DTOs/TaskDTO";
import { CreateCommentDTO } from "../../Domain/DTOs/CreateCommentDTO";
import { taskToTaskDTO } from "../../Utils/Converters/TaskConverter";
import { commentToCommentDTO } from "../../Utils/Converters/CommentConverter";
import { errorCodeToHttpStatus } from "../../Utils/Converters/ErrorCodeConverter";
import { UpdateTaskValidator } from "../validators/UpdateTaskValidator";
import { DeleteTaskValidator } from "../validators/DeleteTaskValidator";
import { DeleteCommentValidator } from "../validators/DeleteCommentValidator";
import { ITaskVersionService } from "../../Domain/services/ITaskVersionService";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";

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
    //enum za status
    //dto za servis
    //validacije

    private paramAsString(p: string | string[] | undefined): string | null {
        if (!p) return null;
        return Array.isArray(p) ? p[0] : p;
    }

    private parseId(p: string | string[] | undefined): number | null {
        const s = this.paramAsString(p);
        if (!s) return null;
        const n = Number.parseInt(s, 10);
        return Number.isFinite(n) ? n : null;
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

        // DEV / DUMMY
        this.router.get('/dev/dummy-tasks', this.getAllDummyTasksForProject.bind(this));

        // TASK VERSIONS
        this.router.get("/tasks/:taskId/versions", this.getTaskVersions.bind(this));
        this.router.get("/tasks/:taskId/versions/:versionId", this.getTaskVersionById.bind(this));
    }


    async addTaskForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = Number(req.params.sprintId);
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid sprint ID",
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const createTask: CreateTaskDTO = req.body;

            const result = await this.taskService.addTaskForSprint(sprintId, createTask, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(404).json({ message: "Task not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
            generateEvent(
                "task-microservice",
                req,
                500,
                "Internal server error",
            ),
            );
        }
    }


    async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId",
                ),
                );
                return;
            }
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId",
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id" ,
                ),
                );
                return;
            }
            const result = await this.taskService.getTaskById(taskId, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(404).json({ message: "Task not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error",
                ),
                );
        }
    }

    async getAllTasksForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = this.parseId((req.params as any).sprintId);
            if (sprintId === null) {
                res.status(400).json({ error: "Invalid sprint_id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid sprint_id",
                ),
                );
                return;
            }
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid sprint ID",
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const result = await this.taskService.getAllTasksForSprint(sprintId, user_id);

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    200,
                    "Task deleted",
                ),
                );
            } else {
                res.status(404).json({ message: "Sprint not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Sprint not found",
                ),
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                   "Internal server error",
                ),
                );
        }
    }

    async getTasksForSprintIds(req: Request, res: Response): Promise<void> {
        try {
            const sprintIds = (req.body as any)?.sprint_ids;

            if (!Array.isArray(sprintIds) || sprintIds.length === 0) {
                res.status(400).json({ message: "sprint_ids must be a non-empty array" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                   "sprint_ids must be a non-empty array",
                ),
                );
                return;
            }

            const parsed = sprintIds
                .map((id) => Number.parseInt(id, 10))
                .filter((id) => Number.isFinite(id) && id > 0);

            if (parsed.length === 0) {
                res.status(400).json({ message: "Invalid sprint IDs" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid sprint IDs",
                ),
                );
                return;
            }

            const result = await this.taskService.getTasksBySprintIds(parsed);

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
            } else {
                res.status(404).json({ message: "Sprint id not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Sprint id not found",
                ),
                );
            }
        } catch {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error",
                ),
                );
        }
    }

    async addCommentToTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId",
                ),
                );
                return;
            }
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid task ID" ,
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const createComment: CreateCommentDTO = req.body;

            const result = await this.commentService.addComment(taskId, createComment, user_id);

            if (result.success) {
                res.status(200).json(commentToCommentDTO(result.data, taskId));
            } else {
                res.status(404).json({ message: "Task not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error",
                ),
                );
        }
    }

    async getAllDummyTasksForProject(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.taskService.getAllDummyTasksForSprint();

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId",
                ),
                );
                return;
            }
            const taskIdValidation = DeleteTaskValidator.validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    taskIdValidation.message ?? "TaskId Validation Error",
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const updateTaskDTO: UpdateTaskDTO = req.body;

            const dtoValidation = UpdateTaskValidator.validateUpdateTaskDTO(updateTaskDTO);
            if (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    dtoValidation.message ?? "DTO validation",
                ),
                );
                return;
            }

            const result = await this.taskService.updateTask(taskId, updateTaskDTO, user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(404).json({ message: "Task not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error",
                ),
                );
        }
    }

    async updateTaskStatus(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                   "Invalid taskId",
                ),
                );
                return;
            }
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid task ID",
                ),
                );
                return;
            }

            const userIdHeader = req.headers['x-user-id'];
            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id" ,
                ),
                );
                return;
            }

            const { status, file_id } = req.body;
            if (status === undefined) {
                res.status(400).json({ message: "Status is required" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Status is required",
                ),
                );
                return;
            }

            const result = await this.taskService.updateTaskStatus(taskId, status, user_id, file_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(404).json({ message: "Task not found"});
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error" ,
                ),
                );
        }
    }


    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId",
                ),
                );
                return;
            }
            const taskIdValidation = DeleteTaskValidator.validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Task id validation error",
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header",
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const result = await this.taskService.deleteTask(taskId, user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Task not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Task not found",
                ),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
             this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error" 
                ),
                );
        }
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = this.parseId((req.params as any).commentId);
            if (commentId === null) {
                res.status(400).json({ error: "Invalid commentId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid commentId",
                ),
                );
                return;
            }
            const commentIdValidation = DeleteCommentValidator.validateCommentId(commentId);
            if (!commentIdValidation.isValid) {
                res.status(400).json({ message: commentIdValidation.message });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                   "Comment id Validation error"
                ),
                );
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Missing or invalid x-user-id header" ,
                ),
                );
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid user id",
                ),
                );
                return;
            }
            const result = await this.commentService.deleteComment(commentId, user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Comment not found" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    404,
                    "Comment not found",
                ),
                );
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error" ,
                ),
                );
        }
    }

    private async getTaskVersions(req: Request, res: Response): Promise<void> {
        try {
            const taskId = this.parseId((req.params as any).taskId);
            if (taskId === null) {
                res.status(400).json({ error: "Invalid taskId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid taskId" ,
                ),
                );
                return;
            }

            const versions = await this.taskVersionService.getVersionsForTask(taskId);
            res.status(200).json(versions);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                   "Internal server error" ,
                ),
                );
        }
    }

    private async getTaskVersionById(req: Request, res: Response): Promise<void> {
        try {
            const versionId = this.parseId((req.params as any).versionId);
            if (versionId === null) {
                res.status(400).json({ error: "Invalid versionId" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid versionId",
                ),
                );
                return;
            }
            if (isNaN(versionId)) {
                res.status(400).json({ message: "Invalid version ID" });
                this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    400,
                    "Invalid version ID",
                ),
                );
                return;
            }

            const version = await this.taskVersionService.getVersionById(versionId);
            res.status(200).json(version);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            this.siemService.sendEvent(
                generateEvent(
                    "task-microservice",
                    req,
                    500,
                    "Internal server error",
                ),
                );
        }
    }
}
