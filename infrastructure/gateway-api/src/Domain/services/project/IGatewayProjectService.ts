import { ProjectCreateDTO } from "../../DTOs/project/ProjectCreateDTO";
import { ProjectDTO } from "../../DTOs/project/ProjectDTO";
import { ProjectUpdateDTO } from "../../DTOs/project/ProjectUpdateDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayProjectService {
    getProjectById(id: number): Promise<Result<ProjectDTO>>;
    createProject(data: ProjectCreateDTO): Promise<Result<ProjectDTO>>;
    updateProject(id: number, data: ProjectUpdateDTO): Promise<Result<ProjectDTO>>;
    deleteProject(id: number): Promise<Result<boolean>>;
}