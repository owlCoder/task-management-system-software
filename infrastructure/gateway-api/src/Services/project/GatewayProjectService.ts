// Framework
import { Request } from "express";

// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayProjectService } from "../../Domain/services/project/IGatewayProjectService";
import { ProjectDTO } from "../../Domain/DTOs/project/ProjectDTO";
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
import { makeAPICall, makeAPIUploadStreamCall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the Project Microservice
 */
export class GatewayProjectService implements IGatewayProjectService {
    private readonly projectClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.projectClient = createAxiosClient(API_ENDPOINTS.PROJECT, { headers: {} });
    }

    /**
     * Fetches the specific project.
     * @param {number} projectId - id of the project. 
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
    async getProjectById(projectId: number): Promise<Result<ProjectDTO>> {
        return await makeAPICall<ProjectDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_PROJECT(projectId)
        });
    }

    /**
     * Fetches all projects.
     * @returns {Promise<Result<ProjectDTO[]>>} - A promise that resolves to a Result object containing the data of the projects.
     * - On success returns data as {@link ProjectDTO[]}.
     * - On failure returns status code and error message.
     */
    async getAllProjects(): Promise<Result<ProjectDTO[]>> {
        return await makeAPICall<ProjectDTO[]>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_ALL_PROJECTS
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

    async getAllProjectIds(): Promise<Result<number[]>> {
        return await makeAPICall<number[]>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.GET,
            url: PROJECT_ROUTES.GET_ALL_PROJECT_IDS
        });
    }

    /**
     * Passes through the request for creating new project.
     * @param {Request} req - The request object containing the project data. 
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
    async createProject(req: Request): Promise<Result<ProjectDTO>> {
        return await makeAPIUploadStreamCall<ProjectDTO, Request>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.POST,
            url: PROJECT_ROUTES.CREATE_PROJECT,
            data: req,
            headers: {
                "Content-Type": req.headers["content-type"]!,
                ...(req.headers["content-length"] && { 'Content-Length': req.headers["content-length"] })
            },
            timeout: 20000
        });
    }

    /**
     * Passes through the update project by id request.
     * @param {number} projectId - id of the project. 
     * @param {Request} req - the request object containing the update data for the project.
     * @returns {Promise<Result<ProjectDTO>>} - A promise that resolves to a Result object containing the data of the project.
     * - On success returns data as {@link ProjectDTO}.
     * - On failure returns status code and error message.
     */
    async updateProject(projectId: number, req: Request, senderId: number): Promise<Result<ProjectDTO>> {
        return await makeAPIUploadStreamCall<ProjectDTO, Request>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.PUT,
            url: PROJECT_ROUTES.UPDATE_PROJECT(projectId),
            data: req,
            headers: {
                "Content-Type": req.headers["content-type"]!,
                ...(req.headers["content-length"] && { 'Content-Length': req.headers["content-length"] }),
                "X-Sender-ID": senderId.toString()
            },
            timeout: 20000
        });
    }

    /**
     * Requests the deletion of a specific project.
     * @param {number} projectId - id of the project. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteProject(projectId: number, senderId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.DELETE,
            url: PROJECT_ROUTES.DELETE_PROJECT(projectId),
            headers: {
                "X-Sender-ID": senderId.toString()
            }
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
    async createSprint(projectId: number, data: SprintCreateDTO, senderId: number): Promise<Result<SprintDTO>> {
        return await makeAPICall<SprintDTO, SprintCreateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.POST,
            url: PROJECT_ROUTES.CREATE_SPRINT_FOR_PROJECT(projectId),
            data: data,
            headers: {
                "X-Sender-ID": senderId.toString()
            }
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
    async updateSprint(sprintId: number, data: SprintUpdateDTO, senderId: number): Promise<Result<SprintDTO>> {
        return await makeAPICall<SprintDTO, SprintUpdateDTO>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.PUT,
            url: PROJECT_ROUTES.UPDATE_SPRINT(sprintId),
            data: data,
            headers: {
                "X-Sender-ID": senderId.toString()
            }
        });
    }

    /**
     * Requests a deletion of a specific sprint.
     * @param {number} sprintId - id of the sprint. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteSprint(sprintId: number, senderId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.projectClient, this.errorHandlingService, {
            serviceName: SERVICES.PROJECT,
            method: HTTP_METHODS.DELETE,
            url: PROJECT_ROUTES.DELETE_SPRINT(sprintId),
            headers: {
                "X-Sender-ID": senderId.toString()
            }
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