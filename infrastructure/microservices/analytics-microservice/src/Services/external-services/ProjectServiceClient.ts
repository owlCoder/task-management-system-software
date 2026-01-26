import axios, { AxiosInstance } from "axios";
import { IProjectServiceClient } from "./IProjectServiceClient";
import { ProjectDTO, ProjectUserDTO, SprintDTO } from "./types";

export class ProjectServiceClient implements IProjectServiceClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = process.env.PROJECT_SERVICE_API || "http://localhost:5000/api/v1") {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000
    });
  }

  async getProjectById(projectId: number): Promise<ProjectDTO | null> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}`);
      return response.data as ProjectDTO;
    } catch {
      return null;
    }
  }

  async getSprintsByProject(projectId: number): Promise<SprintDTO[]> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/sprints`);
      return (response.data ?? []) as SprintDTO[];
    } catch {
      return [];
    }
  }

  async getUsersForProject(projectId: number): Promise<ProjectUserDTO[]> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/users`);
      return (response.data ?? []) as ProjectUserDTO[];
    } catch {
      return [];
    }
  }

  // ProjectServiceClient.ts - dodaj ove metode
  async getSprintById(sprintId: number): Promise<SprintDTO | null> {
    try {
      const response = await this.axiosInstance.get(`/sprints/${sprintId}`);
      return response.data as SprintDTO;
    } catch {
      return null;
    }
  }

  async getProjectsStartedAfter(startDate: Date): Promise<ProjectDTO[]> {
    try {
      const startDateStr = startDate.toISOString().slice(0, 10);
      const response = await this.axiosInstance.get(`/projects`, {
        params: { start_date_from: startDateStr }
      });
      return (response.data ?? []) as ProjectDTO[];
    } catch {
      return [];
    }
  }

  async getProjectUsersAddedAfter(startDate: Date): Promise<ProjectUserDTO[]> {
    try {
      const response = await this.axiosInstance.get(`/project-users`, {
        params: { added_after: startDate.toISOString() }
      });
      return (response.data ?? []) as ProjectUserDTO[];
    } catch {
      return [];
    }
  }
}
