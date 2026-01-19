import { TaskTemplateDTO } from "../../models/task/TaskTemplateDTO";

export interface ITaskTemplateAPI {
  getTemplates(): Promise<TaskTemplateDTO[]>;
  getTemplate(templateId: number): Promise<TaskTemplateDTO>;
}
