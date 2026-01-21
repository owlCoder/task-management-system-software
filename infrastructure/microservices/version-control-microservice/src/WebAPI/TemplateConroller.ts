import { ITemplateService } from "../Domain/services/ITemplateService";
import { Router, Request, Response } from "express";
import { toTemplateDTO } from "../Helpers/Converter/toTemplateDTO";
import { errorCodeToHttpStatus } from "../Utils/Converters/ErrorCodeConverter";

export class TemplateController {
    private readonly router: Router;

    constructor(private templateService: ITemplateService) {
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes() {
        this.router.get("/templates/:id", this.getTemplateById.bind(this));
        this.router.get("/templates", this.getAllTemplates.bind(this));
        this.router.post("/templates", this.createTemplate.bind(this));
        this.router.post("/templates/:id/create", this.createTask.bind(this));
        this.router.post("/:id/dependencies/:dependsOnId", this.addDependency);
    }

    async getTemplateById(req: Request, res: Response): Promise<void>{
        try {
            const id = parseInt(req.params.id as string, 10);

            if(isNaN(id)) {
                res.status(400).json({message: "Passed id is not a number"});
                return;
            }

            const result = await this.templateService.getTemplateById(id);

            if(result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(errorCodeToHttpStatus(result.code)).json(result.error);
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message});
        }
    }

    async getAllTemplates(req: Request, res: Response): Promise<void>{
        try {
            const result = await this.templateService.getAllTemplates();

            if(result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(errorCodeToHttpStatus(result.code)).json(result.error);
            }
        } catch (err) {
            res.status(500).json({message: (err as Error).message});
        }
    } 

    async createTemplate(req: Request, res: Response): Promise<void>{
        try {
            const templateData = req.body;

            const result = await this.templateService.createTemplate(templateData);

            if(result.success) {
                res.status(201).json(result.data);
            } else {
                res.status(errorCodeToHttpStatus(result.code)).json(result.error);
            }
        } catch (err) {
            res.status(500).json({message: (err as Error).message});
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const template_id = parseInt(req.params.id as string, 10);
            const sprint_id = Number(req.body.sprint_id); 
            const worker_id = Number(req.body.worker_id);

            const pmIdHeader = (req.headers['x-user-id']);

            if(!pmIdHeader || typeof pmIdHeader !== 'string') {
                res.status(400).json({message: "Missing x-user-id header"});
                return;
            }

            const pm_id = parseInt(pmIdHeader, 10);

            const result = await this.templateService.createTaskFromTemplate(template_id, sprint_id, worker_id, pm_id);

            if(result.success){
                res.status(201).json(result.data);
            } else {
                res.status(errorCodeToHttpStatus(result.code)).json({message: result.error});
            }
        } catch (err) {
            res.status(500).json({message: (err as Error).message});
        }
    }

    async addDependency(req: Request, res: Response): Promise<void> {
        try {
        const templateId = parseInt(req.params.id as string, 10);
        const dependsOnId = parseInt(req.params.dependsOnId as string, 10);

        if (isNaN(templateId) || isNaN(dependsOnId)) {
            res.status(400).json({ message: "Invalid IDs provided" });
            return;
        }

        const result = await this.templateService.addDependency(templateId, dependsOnId);

        if (result.success) {
            res.status(204).send(); 
        } else {
            res.status(errorCodeToHttpStatus(result.code)).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
    }

}

