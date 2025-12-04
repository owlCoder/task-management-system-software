import type { ProjectDTO } from "../../models/project/ProjectDTO";

export interface IProjectAPI {
  getAllProjects(): Promise<ProjectDTO[]>;
  getProjectById(id: string): Promise<ProjectDTO | undefined>;
  createProject(project: ProjectDTO): Promise<ProjectDTO>;
  updateProject(id: string, updatedData: Partial<ProjectDTO>): Promise<ProjectDTO | undefined>;
  deleteProject(id: string): Promise<boolean>;
}