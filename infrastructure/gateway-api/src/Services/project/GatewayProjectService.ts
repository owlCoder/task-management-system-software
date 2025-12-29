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

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

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
        return await makeAPICall<ProjectDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_BY_ID(id)
        });
    }

    /**
     * Posts new project.
     * @param {ProjectCreateDTO} data - data of the project. 
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
    async createProject(data: ProjectCreateDTO): Promise<Result<ProjectDTO>> {
        return await makeAPICall<ProjectDTO, ProjectCreateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.POST,
            url: PROJECT_ROUTES.CREATE,
            data: data
        });
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
        return await makeAPICall<ProjectDTO, ProjectUpdateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.PUT,
            url: PROJECT_ROUTES.UPDATE(id),
            data: data
        });
    }

    /**
     * Requests the deletion of a specific project.
     * @param {number} id - id of the project. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteProject(id: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.DELETE,
            url: PROJECT_ROUTES.DELETE(id)
        });
    }

}