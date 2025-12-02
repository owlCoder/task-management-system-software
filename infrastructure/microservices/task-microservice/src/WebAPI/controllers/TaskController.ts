import { Router,Request,Response } from "express";
import { ITaskService } from "../../Domain/services/ITaskService";

export class TaskController {
    private readonly router: Router;

    constructor(private taskService: ITaskService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        // TASKS
        this.router.get('/tasks/:taskId', this.getTaskById.bind(this));
        this.router.post('/projects/:projectId/tasks', this.addTaskForProject.bind(this));

        // GET ALL TASKS FOR PROJECT
        this.router.get('/projects/:projectId/tasks', this.getAllTasksForProject.bind(this));

        // COMMENTS
        this.router.post('/tasks/:taskId/comments', this.addCommentToTask.bind(this));

        // DEV / DUMMY
        this.router.get('/dev/dummy-tasks', this.getAllDummyTasksForProject.bind(this));
    }
    
    
    async addTaskForProject(req: Request, res: Response): Promise<void> {
        try {
            const projectId = parseInt(req.params.projectId, 10);
            const { worker_id, project_manager_id, title, task_description, estimated_cost } = req.body;
            if(isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const result = await this.taskService.addTaskForProject(projectId, worker_id, project_manager_id, title, task_description, estimated_cost);
            if (result.success) {
                res.status(result.statusCode).json(result.data);
                return;
            }
            res.status(result.statusCode).json({ message: result.message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getTaskById(req: Request, res: Response): Promise<void> {
        try{
            const taskId = parseInt(req.params.taskId, 10);
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
        const taskId = parseInt(req.params.taskId, 10);
        if(isNaN(taskId)) {
            res.status(400).json({ message: "Invalid task ID" });
            return;
        }
        const { user_id, comment } = req.body;

        const result = await this.taskService.addComment(taskId, user_id, comment);
        if (result.success) {
            res.status(result.statusCode).json(result.data);
            return;
        }
        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.log(error);
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