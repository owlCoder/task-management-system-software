import axios, { AxiosError, AxiosInstance } from 'axios';
import { IProjectServiceClient } from '../../Domain/services/external-services/IProjectServiceClient';
import { Result } from '../../Domain/types/Result';
import { ErrorCode } from '../../Domain/enums/ErrorCode';
import { SprintDTO } from '../../Domain/external-dtos/SprintDTO';
import { ProjectUserDTO } from '../../Domain/external-dtos/ProjectUserDTO';
import { ProjectDTO } from '../../Domain/external-dtos/ProjectDTO';


export class ProjectServiceClient implements IProjectServiceClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string = process.env.PROJECT_SERVICE_API || 'http://localhost:5000/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });
    }

    async getSprintById(sprintId: number): Promise<Result<SprintDTO>> {
        try {
            const response = await this.axiosInstance.get<SprintDTO>(`/sprints/${sprintId}`);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.SPRINT_NOT_FOUND, message: "Sprint not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch sprint" };
        }
    }

    async getUsersForProject(projectId: number): Promise<Result<ProjectUserDTO[]>> {
        try {
            const response = await this.axiosInstance.get<ProjectUserDTO[]>(`/projects/${projectId}/users`);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.PROJECT_NOT_FOUND, message: "Project not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch project users" };
        }
    }

    async getProjectById(projectId: number): Promise<Result<ProjectDTO>> {
        try {
            const response = await this.axiosInstance.get<ProjectDTO>(`/projects/${projectId}`);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.PROJECT_NOT_FOUND, message: "Project not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch project" };
        }
    }

    async projectExists(projectId: number): Promise<boolean> {
        const result = await this.getProjectById(projectId);
        return result.success;
    }
}