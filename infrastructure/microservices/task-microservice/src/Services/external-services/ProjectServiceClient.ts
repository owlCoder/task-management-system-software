// ProjectServiceClient.ts - implementacija
import axios, { AxiosInstance } from 'axios';
import { IProjectServiceClient } from '../../Domain/services/external-services/IProjectServiceClient';
import { Result } from '../../Domain/types/Result';
import { ErrorCode } from '../../Domain/enums/ErrorCode';


export class ProjectServiceClient implements IProjectServiceClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string = process.env.PROJECT_SERVICE_API || 'http://localhost:5000/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });
    }

    async getSprintById(sprintId: number): Promise<Result<any>> {
        try {
            const response = await this.axiosInstance.get(`/sprints/${sprintId}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log(error);
            if (error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.SPRINT_NOT_FOUND, message: "Sprint not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch sprint" };
        }
    }

    async getUsersForProject(projectId: number): Promise<Result<any>> {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}/users`);
            return { success: true, data: response.data };
        } catch (error: any) {
            if (error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.PROJECT_NOT_FOUND, message: "Project not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch project users" };
        }
    }

    async getProjectById(projectId: number): Promise<Result<any>> {
        try {
            const response = await this.axiosInstance.get(`/projects/${projectId}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            if (error.response?.status === 404) {
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