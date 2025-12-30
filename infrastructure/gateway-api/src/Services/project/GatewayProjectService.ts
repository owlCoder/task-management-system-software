// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayProjectService } from "../../Domain/services/project/IGatewayProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/project/ProjectCreateDTO";
import { ProjectDTO } from "../../Domain/DTOs/project/ProjectDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/project/ProjectUpdateDTO";
import { ProjectUserAssignDTO } from "../../Domain/DTOs/project/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../../Domain/DTOs/project/ProjectUserDTO";
import { SprintCreateDTO } from "../../Domain/DTOs/project/SprintCreateDTO";
import { SprintDTO } from "../../Domain/DTOs/project/SprintDTO";
import { SprintUpdateDTO } from "../../Domain/DTOs/project/SprintUpdateDTO";
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
            url: PROJECT_ROUTES.GET_PROJECT(id)
        });
    }

    /**
     * Fetches the projects a specific user works on.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<ProjectDTO[]>>} - A promise that resolves to a Result object containing the data of the projects.
     * - On success returns data as {@link ProjectDTO[]}.
     * - On failure returns status code and error message.
     */
    async getProjectsFromUser(userId: number): Promise<Result<ProjectDTO[]>> {
        return await makeAPICall<ProjectDTO[]>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_PROJECTS_FROM_USER(userId)
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
            url: PROJECT_ROUTES.CREATE_PROJECT,
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
            url: PROJECT_ROUTES.UPDATE_PROJECT(id),
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
            url: PROJECT_ROUTES.DELETE_PROJECT(id)
        });
    }

    /**
     * Fetches the sprints from the project.
     * @param {number} projectId - id of the project. 
     * @returns {Promise<Result<SprintDTO[]>>} - A promise that resolves to a Result object containing the sprints from a specific project.
     * - On success returns data as {@link SprintDTO[]}.
     * - On failure returns status code and error message.
     */
    async getSprintsByProject(projectId: number): Promise<Result<SprintDTO[]>> {
        return await makeAPICall<SprintDTO[]>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_SPRINTS_FROM_PROJECT(projectId)
        });
    }

    /**
     * Fetches the specific sprint.
     * @param {number} sprintId - id of the sprint. 
     * @returns {Promise<Result<SprintDTO>>} - A promise that resolves to a Result object containing the data of the sprint.
     * - On success returns data as {@link SprintDTO}.
     * - On failure returns status code and error message.
     */
    async getSprintById(sprintId: number): Promise<Result<SprintDTO>> {
        return await makeAPICall<SprintDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_SPRINT(sprintId)
        });
    }

    /**
     * Adds a new sprint to a specific project.
     * @param {number} projectId - id of the project. 
     * @param {SprintCreateDTO} data - data of the new sprint.
     * @returns {Promise<Result<SprintDTO>>} - A promise that resolves to a Result object containing the data of the sprint.
     * - On success returns data as {@link SprintDTO}.
     * - On failure returns status code and error message.
     */
    async createSprint(projectId: number, data: SprintCreateDTO): Promise<Result<SprintDTO>> {
        return await makeAPICall<SprintDTO, SprintCreateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.POST,
            url: PROJECT_ROUTES.CREATE_SPRINT_FOR_PROJECT(projectId),
            data: data
        });
    }

    /**
     * Updates the data of a specific sprint.
     * @param {number} sprintId - id of the sprint. 
     * @param {SprintUpdateDTO} data - new data for a specific sprint.
     * @returns {Promise<Result<SprintDTO>>} - A promise that resolves to a Result object containing the data of the sprint.
     * - On success returns data as {@link SprintDTO}.
     * - On failure returns status code and error message.
     */
    async updateSprint(sprintId: number, data: SprintUpdateDTO): Promise<Result<SprintDTO>> {
        return await makeAPICall<SprintDTO, SprintUpdateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.PUT,
            url: PROJECT_ROUTES.UPDATE_SPRINT(sprintId),
            data: data
        });
    }

    /**
     * Requests a deletion of a specific sprint.
     * @param {number} sprintId - id of the sprint. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteSprint(sprintId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.DELETE,
            url: PROJECT_ROUTES.DELETE_SPRINT(sprintId)
        });
    }

    /**
     * Fetches the users working on a specific project.
     * @param {number} projectId - id of the project. 
     * @returns {Promise<Result<ProjectUserDTO[]>>} - A promise that resolves to a Result object containing the users working on a project.
     * - On success returns data as {@link ProjectUserDTO[]}.
     * - On failure returns status code and error message.
     */
    async getUsersFromProject(projectId: number): Promise<Result<ProjectUserDTO[]>> {
        return await makeAPICall<ProjectUserDTO[]>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_USERS_FROM_PROJECT(projectId)
        });
    }

    /**
     * Assigns a user to a project.
     * @param {number} projectId - id of the project.
     * @param {ProjectUserDTO} data - user data required for assignation.
     * @returns {Promise<Result<ProjectUserDTO>>} - A promise that resolves to a Result object containing the data of the assigned user.
     * - On success returns data as {@link ProjectUserDTO}.
     * - On failure returns status code and error message.
     */
    async assignUserToProject(projectId: number, data: ProjectUserAssignDTO): Promise<Result<ProjectUserDTO>> {
        return await makeAPICall<ProjectUserDTO, ProjectUserAssignDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.POST,
            url: PROJECT_ROUTES.ASSIGN_USER_TO_PROJECT(projectId),
            data: data
        });
    }

    /**
     * Removes a user from the project.
     * @param {number} projectId - id of the project. 
     * @param {number} userId - id of the user.
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async removeUserFromProject(projectId: number, userId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.DELETE,
            url: PROJECT_ROUTES.REMOVE_USER_FROM_PROJECT(projectId, userId)
        });
    }
}