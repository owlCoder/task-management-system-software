import { TaskTemplateDependencyDTO } from "./TemplateDependencyDTO";

export interface UpdateTemplateDTO {
    template_title?: string;
    template_description?: string;
    estimated_cost?: number;
    attachment_type?: string;
    dependencies?: TaskTemplateDependencyDTO[];
}