import { ProjectCreateDTO } from "../DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../DTOs/ProjectUpdateDTO";
import { ProjectDTO } from "../DTOs/ProjectDTO";
import { Result } from "../types/Result";

export interface IProjectService {
    CreateProject(data: ProjectCreateDTO): Promise<Result<ProjectDTO>>;
    getProjects(): Promise<Result<ProjectDTO[]>>;
    getProjectsByUserId(user_id: number): Promise<Result<ProjectDTO[]>>;
    getProjectById(project_id: number): Promise<Result<ProjectDTO>>;
    updateProject(project_id: number, data: ProjectUpdateDTO): Promise<Result<ProjectDTO>>;
    deleteProject(project_id: number): Promise<Result<boolean>>;
    projectExists(project_id: number): Promise<Result<boolean>>;
}