import { TaskTemplateDependencyDTO } from "./TaskTemplateDependencyDTO";

export interface TaskTemplateDTO {
  template_id: number;
  template_title: string;
  template_description: string;
  estimated_cost: number;
  attachment_type: string;
  dependencies: TaskTemplateDependencyDTO[];
}
