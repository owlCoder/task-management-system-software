import { Router,Request,Response } from "express";
import { ITaskService } from "../../Domain/services/ITaskService";

export class TaskController {
    private readonly router: Router;

    constructor(private taskService: ITaskService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/tasks/:id", this.getTaskById.bind(this));
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
    public getRouter(): Router {
        return this.router;
    }
}