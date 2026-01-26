import { ProjectDTO, ProjectUserDTO, SprintDTO } from "./types";

export interface IProjectServiceClient {
  getProjectById(projectId: number): Promise<ProjectDTO | null>;
  getSprintsByProject(projectId: number): Promise<SprintDTO[]>;
  getUsersForProject(projectId: number): Promise<ProjectUserDTO[]>;
  getSprintById(sprintId: number): Promise<SprintDTO | null>;
  getProjectsStartedAfter(startDate: Date): Promise<ProjectDTO[]>;
  getProjectUsersAddedAfter(startDate: Date): Promise<ProjectUserDTO[]>;
}
