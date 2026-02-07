import { TaskTemplateDTO } from "../../models/task/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../models/task/CreateTemplateDTO";

export interface ITaskTemplateAPI {
  getTemplates(): Promise<TaskTemplateDTO[]>;
  getTemplate(templateId: number): Promise<TaskTemplateDTO>;
  createTemplate(data: CreateTemplateDTO): Promise<TaskTemplateDTO>;
}
