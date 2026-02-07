import { TaskTemplateDependencyDTO } from "./TaskTemplateDependencyDTO";

export interface CreateTemplateDTO {
    template_title: string;
    template_description: string;
    estimated_cost: number;
    attachment_type: string;
    dependencies: TaskTemplateDependencyDTO[];
}