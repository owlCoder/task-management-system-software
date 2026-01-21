import { TaskTemplateDependencyDTO } from "../../Domain/DTOs/TemplateDependencyDTO";
import { TemplateDependency } from "../../Domain/models/TemplateDependency";

export function dependencyToDTO(dep: TemplateDependency): TaskTemplateDependencyDTO {
    return {
        depends_on_template_id: dep.dependsOn.template_id
    };
}