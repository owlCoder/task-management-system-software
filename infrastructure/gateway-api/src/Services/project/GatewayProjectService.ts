import axios, { AxiosInstance } from "axios";
import { ProjectCreateDTO } from "../../Domain/DTOs/project/ProjectCreateDTO";
import { ProjectDTO } from "../../Domain/DTOs/project/ProjectDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/project/ProjectUpdateDTO";
import { IGatewayProjectService } from "../../Domain/services/project/IGatewayProjectService";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { Result } from "../../Domain/types/common/Result";
import { PROJECT_ROUTES } from "../../Constants/routes/project/ProjectRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";

export class GatewayProjectService implements IGatewayProjectService {
    private readonly projectClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        const projectBaseURL = process.env.PROJECT_SERVICE_API;
        
        this.projectClient = axios.create({
            baseURL: projectBaseURL,
            timeout: 5000,
        });
    }

    async getProjectById(id: number): Promise<Result<ProjectDTO>> {
        try {
            const response = await this.projectClient.get<ProjectDTO>(PROJECT_ROUTES.GET_BY_ID(id));

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.PROJECT, HTTP_METHODS.GET, PROJECT_ROUTES.GET_BY_ID(id));
        }
    }

    async createProject(data: ProjectCreateDTO): Promise<Result<ProjectDTO>> {
        try {
            const response = await this.projectClient.post<ProjectDTO>(PROJECT_ROUTES.CREATE, data);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.PROJECT, HTTP_METHODS.POST, PROJECT_ROUTES.CREATE);
        }
    }

    async updateProject(id: number, data: ProjectUpdateDTO): Promise<Result<ProjectDTO>> {
        try {
            const response = await this.projectClient.put<ProjectDTO>(PROJECT_ROUTES.UPDATE(id), data);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.PROJECT, HTTP_METHODS.PUT, PROJECT_ROUTES.UPDATE(id));
        }
    }

    async deleteProject(id: number): Promise<Result<boolean>> {
        try {
            const response = await this.projectClient.delete<boolean>(PROJECT_ROUTES.DELETE(id));

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.PROJECT, HTTP_METHODS.DELETE, PROJECT_ROUTES.DELETE(id));
        }
    }

}