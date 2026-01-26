// Framework
import { Request } from "express";

import { ProjectDTO } from "../../DTOs/project/ProjectDTO";
import { ProjectUserAssignDTO } from "../../DTOs/project/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../../DTOs/project/ProjectUserDTO";
import { SprintCreateDTO } from "../../DTOs/project/SprintCreateDTO";
import { SprintDTO } from "../../DTOs/project/SprintDTO";
import { SprintUpdateDTO } from "../../DTOs/project/SprintUpdateDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayProjectService {
    getProjectById(projectId: number): Promise<Result<ProjectDTO>>;
    getAllProjects(): Promise<Result<ProjectDTO[]>>;
    getProjectsFromUser(userId: number): Promise<Result<ProjectDTO[]>>;
    createProject(req: Request): Promise<Result<ProjectDTO>>;
    updateProject(projectId: number, req: Request): Promise<Result<ProjectDTO>>;
    deleteProject(projectId: number): Promise<Result<void>>;

    getSprintsByProject(projectId: number): Promise<Result<SprintDTO[]>>;
    getSprintById(sprintId: number): Promise<Result<SprintDTO>>;
    createSprint(projectId: number, data: SprintCreateDTO): Promise<Result<SprintDTO>>;
    updateSprint(sprintId: number, data: SprintUpdateDTO): Promise<Result<SprintDTO>>;
    deleteSprint(sprintId: number): Promise<Result<void>>;

    getUsersFromProject(projectId: number): Promise<Result<ProjectUserDTO[]>>;
    assignUserToProject(projectId: number, data: ProjectUserAssignDTO): Promise<Result<ProjectUserDTO>>;
    removeUserFromProject(projectId: number, userId: number): Promise<Result<void>>;
    getAllProjectIds(): Promise<Result<number[]>>;
}
