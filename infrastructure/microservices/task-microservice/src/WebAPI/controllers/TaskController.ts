import { Router,Request,Response } from "express";
import { ITaskService } from "../../Domain/services/ITaskService";

export class TaskController {
    private readonly router: Router;

    constructor(private taskService: ITaskService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

            this.router.get('/tasks/:id', this.getTaskById.bind(this));
            this.router.get('/projects/:projectId/tasks', this.getAllTasksForProject.bind(this));
            this.router.get('/projects/dummy-tasks', this.getAllDummyTasksForProject.bind(this));
            this.router.post('/tasks/:id/comments', this.addCommentToTask.bind(this));
    }

    async getTaskById(req: Request, res: Response): Promise<void> {
        try{
            const taskId = parseInt(req.params.id, 10);
            if(isNaN(taskId)) {
                res.status(400).json({ message: "Invalid task ID" });
                return;
            }
            const result = await this.taskService.getTaskById(taskId);
            if(result.success) {
                res.status(result.statusCode).json(result.data);
                return;
            }
            res.status(result.statusCode).json({ message: result.message });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllTasksForProject(req: Request, res: Response): Promise<void> {
        try{
            const projectId =  parseInt(req.params.projectId, 10);
            if(isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const result =  await this.taskService.getAllTasksForProject(projectId);
            if(result.success) {
                res.status(result.statusCode).json(result.data);
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async addCommentToTask(req: Request, res: Response): Promise<void> {
    try {
        const taskId = parseInt(req.params.id, 10);
        const { user_id, comment } = req.body;

        if (isNaN(taskId) || !user_id || !comment) {
            res.status(400).json({ message: "Invalid input" });
            return;
        }

        // Proveravamo da li task postoji
        const taskExists = await this.taskService.getTaskById(taskId);
        if (!taskExists.success) {
            res.status(404).json({ message: `Task with id ${taskId} not found` });
            return;
        }

        const result = await this.taskService.addComment(taskId, user_id, comment);
        if (result.success) {
            res.status(result.statusCode).json(result.data);
            return;
        }

        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
    async getAllDummyTasksForProject(req: Request, res: Response): Promise<void> {
        const result = await this.taskService.getAllDummyTasksForProject();
        if(result.success) {
            res.status(result.statusCode).json(result.data);
            return;
        }   
    }

    public getRouter(): Router {
        return this.router;
    }
}