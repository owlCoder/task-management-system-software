    import { Router,Request,Response } from "express";
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

    export class TaskController {
    private readonly router: Router;

    constructor(private taskService: ITaskService,
                private commentService : ICommentService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }
    //enum za status
    //dto za servis
    //validacije
    public getRouter(): Router {
    return this.router;
    }
    private initializeRoutes() {

        // TASKS
        this.router.get('/tasks/:taskId', this.getTaskById.bind(this));
        this.router.post('/tasks/sprints/:sprintId', this.addTaskForSprint.bind(this));
        this.router.put('/tasks/:taskId', this.updateTask.bind(this));
        this.router.delete('/tasks/:taskId', this.deleteTask.bind(this));

        // GET ALL TASKS FOR PROJECT
        this.router.get('/tasks/sprints/:sprintId', this.getAllTasksForSprint.bind(this));

        // COMMENTS
        this.router.post('/tasks/:taskId/comments', this.addCommentToTask.bind(this));
        this.router.delete('/comments/:commentId', this.deleteComment.bind(this));

        // DEV / DUMMY
        this.router.get('/dev/dummy-tasks', this.getAllDummyTasksForProject.bind(this));
    }


    async addTaskForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprint_id = Number(req.params.sprintId);
            if (isNaN(sprint_id)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const createTask: CreateTaskDTO = req.body;

            const result = await this.taskService.addTaskForSprint(sprint_id, createTask,user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId, 10);
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.getTaskById(taskId,user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllTasksForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprint_id = parseInt(req.params.sprintId, 10);
            if (isNaN(sprint_id)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.getAllTasksForSprint(sprint_id,user_id);

            if (result.success) {
                res.status(200).json(result.data.map(taskToTaskDTO));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async addCommentToTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId, 10);
            if (isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const createComment: CreateCommentDTO = req.body;

            const result = await this.commentService.addComment(taskId, createComment,user_id);

            if (result.success) {
                res.status(200).json(commentToCommentDTO(result.data, taskId));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
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
            const taskId = parseInt(req.params.taskId, 10);
            const taskIdValidation = DeleteTaskValidator.validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const updateTaskDTO: UpdateTaskDTO = req.body;

            const dtoValidation = UpdateTaskValidator.validateUpdateTaskDTO(updateTaskDTO);
            if (!dtoValidation.isValid) {
                res.status(400).json({ message: dtoValidation.message });
                return;
            }

            const result = await this.taskService.updateTask(taskId, updateTaskDTO,user_id);

            if (result.success) {
                res.status(200).json(taskToTaskDTO(result.data));
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId, 10);
            const taskIdValidation = DeleteTaskValidator.validateTaskId(taskId);
            if (!taskIdValidation.isValid) {
                res.status(400).json({ message: taskIdValidation.message });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.taskService.deleteTask(taskId,user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = parseInt(req.params.commentId, 10);
            const commentIdValidation = DeleteCommentValidator.validateCommentId(commentId);
            if (!commentIdValidation.isValid) {
                res.status(400).json({ message: commentIdValidation.message });
                return;
            }
            const userIdHeader = req.headers['x-user-id'];

            if (typeof userIdHeader !== 'string') {
                res.status(400).json({ message: "Missing or invalid x-user-id header" });
                return;
            }

            const user_id = parseInt(userIdHeader, 10);
            if (isNaN(user_id)) {
                res.status(400).json({ message: "Invalid user id" });
                return;
            }
            const result = await this.commentService.deleteComment(commentId,user_id);

            if (result.success) {
                res.status(204).json();
            } else {
                res.status(errorCodeToHttpStatus(result.errorCode)).json({ message: result.message });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
