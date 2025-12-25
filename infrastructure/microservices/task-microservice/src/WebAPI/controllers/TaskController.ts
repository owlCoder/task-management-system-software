    import { Router,Request,Response } from "express";
    import { ITaskService } from "../../Domain/services/ITaskService";
    import { ICommentService } from "../../Domain/services/ICommentService";
    import { CreateTaskDTO } from "../DTOs/Request/CreateTaskDTO";
    import { TaskResponseDTO } from "../DTOs/Response/TaskResponseDTO";
    import { ApiResponse } from "../types/ApiResponse";
    import { commentToResponseDTO, mapErrorToStatus, mapTaskToTaskResponseDTO } from "../../Utils/Converters/Mappers";
    import { CommentResponseDTO } from "../DTOs/Response/CommentResponseDTO";
    import { Console } from "console";
import { CreateCommentDTO } from "../DTOs/Request/CreateCommentDTO";

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

        // GET ALL TASKS FOR PROJECT
        this.router.get('/tasks/sprints/:sprintId', this.getAllTasksForSprint.bind(this));

        // COMMENTS
        this.router.post('/tasks/:taskId/comments', this.addCommentToTask.bind(this));

        // DEV / DUMMY
        this.router.get('/dev/dummy-tasks', this.getAllDummyTasksForProject.bind(this));
    }


    async addTaskForSprint(req: Request, res: Response): Promise<void> {
        try {
            const sprint_id = Number(req.params.sprintId);
            console.log(sprint_id);
            if (isNaN(sprint_id)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const createTask: CreateTaskDTO = req.body;

            const {
                worker_id,
                project_manager_id,
                title,
                task_description,
                estimated_cost
            } = createTask;

            const result = await this.taskService.addTaskForSprint(
                sprint_id,
                worker_id,
                project_manager_id,
                title,
                task_description,
                estimated_cost
            );

            let response: ApiResponse<TaskResponseDTO>;

            if (result.success) {
                response = {
                    success: true,
                    data: mapTaskToTaskResponseDTO(result.data),
                    statusCode: 200
                };
            } else {
                response = {
                    success: false,
                    statusCode: mapErrorToStatus(result.errorCode),
                    message: result.message
                };
            }

            res.status(response.statusCode).json(response);

        } catch (error) {
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

            const result = await this.taskService.getTaskById(taskId);
            let response: ApiResponse<TaskResponseDTO>;

            if (result.success) {
                response = {
                    success: true,
                    data: mapTaskToTaskResponseDTO(result.data),
                    statusCode: 200
                };
            } else {
                response = {
                    success: false,
                    statusCode: mapErrorToStatus(result.errorCode),
                    message: result.errorCode.toString()
                };
            }

            res.status(response.statusCode).json(response);

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

            const result = await this.taskService.getAllTasksForSprint(sprint_id);

            let response: ApiResponse<TaskResponseDTO[]>;

            if (result.success) {
                response = {
                    success: true,
                    data: result.data.map(mapTaskToTaskResponseDTO),
                    statusCode: 200
                };
            } else {
                response = {
                    success: false,
                    statusCode: mapErrorToStatus(result.errorCode),
                    message: result.message
                };
            }

            res.status(response.statusCode).json(response);

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

            const createComment: CreateCommentDTO = req.body;

            const {
                user_id,
                comment
            } = createComment;

            const result = await this.commentService.addComment(taskId, user_id, comment);

            let response: ApiResponse<CommentResponseDTO>; 

            if (result.success) {
                response = {
                    success: true,
                    data: commentToResponseDTO(result.data), 
                    statusCode: 200
                };
            } else {
                response = {
                    success: false,
                    statusCode: mapErrorToStatus(result.errorCode),
                    message: result.message
                };
            }

            res.status(response.statusCode).json(response);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllDummyTasksForProject(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.taskService.getAllDummyTasksForSprint();

            let response: ApiResponse<TaskResponseDTO[]>;

            if (result.success) {
                response = {
                    success: true,
                    data: result.data.map(mapTaskToTaskResponseDTO),
                    statusCode: 200
                };
            } else {
                response = {
                    success: false,
                    statusCode: mapErrorToStatus(result.errorCode),
                    message: result.message
                };
            }

            res.status(response.statusCode).json(response);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
