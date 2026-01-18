import { TaskTemplateDTO } from "../DTOs/TaskTemplateDTO";
import { CreateTemplateDTO } from "../DTOs/CreateTemplateDTO";
import { UpdateTemplateDTO } from "../DTOs/UpdateTemplateDTO";
import { TaskResponseDTO } from "../DTOs/TaskResponseDTO";
import { Result } from "../types/Result";

export interface ITemplateService {
    getTemplateById(template_id: number): Promise<Result<TaskTemplateDTO>>;
    getAllTemplates(): Promise<Result<TaskTemplateDTO[]>>;
    createTemplate(data: CreateTemplateDTO): Promise<Result<TaskTemplateDTO>>;
    updateTemplate(template_id: number, data: UpdateTemplateDTO): Promise<Result<TaskTemplateDTO>>;
    deleteTemplate(template_id: number): Promise<Result<boolean>>;
    createTaskFromTemplate(template_id: number, sprint_id: number, pm_id: number): Promise<Result<TaskResponseDTO>>;
    addDependency(template_id: number, depends_on_id: number): Promise<Result<void>>;
}


