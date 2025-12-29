// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayProjectService } from "../../Domain/services/project/IGatewayProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/project/ProjectCreateDTO";
import { ProjectDTO } from "../../Domain/DTOs/project/ProjectDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/project/ProjectUpdateDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { PROJECT_ROUTES } from "../../Constants/routes/project/ProjectRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

/**
 * Makes API requests to the Project Microservice
 */
export class GatewayProjectService implements IGatewayProjectService {
    private readonly projectClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.projectClient = axios.create({
            baseURL: API_ENDPOINTS.PROJECT,
            timeout: 5000,
        });
    }

    /**
     * Fetches the specific project.
     * @param {number} id - id of the project. 
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
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

    /**
     * Posts new project.
     * @param {ProjectCreateDTO} data - data of the project. 
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
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

    /**
     * Updates the existing project.
     * @param {number} id - id of the project. 
     * @param {ProjectUpdateDTO} data - update data for the project.
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
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

    /**
     * Requests the deletion of a specific project.
     * @param {number} id - id of the project. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteProject(id: number): Promise<Result<void>> {
        try {
            await this.projectClient.delete<boolean>(PROJECT_ROUTES.DELETE(id));

            return {
                success: true,
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.PROJECT, HTTP_METHODS.DELETE, PROJECT_ROUTES.DELETE(id));
        }
    }

}