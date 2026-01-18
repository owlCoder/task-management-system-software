import { TaskTemplate } from "../../Domain/models/TaskTemplate";
import { TaskTemplateDTO } from "../../Domain/DTOs/TaskTemplateDTO";

export function templateToTemplateDTO(template: TaskTemplate): TaskTemplateDTO {
    return {
        template_id: template.template_id,
        template_title: template.template_title,
        template_description: template.template_description,
        estimated_cost: template.estimated_cost,
        attachment_type: template.attachment_type,
        dependencies: template.dependencies?.map(d => ({
            depends_on_template_id: d.depends_on_template_id 
        })) || []
    };
}
