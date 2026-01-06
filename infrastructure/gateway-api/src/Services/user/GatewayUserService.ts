// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayUserService } from "../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../Domain/DTOs/user/RegistrationUserDTO";
import { UserDTO } from "../../Domain/DTOs/user/UserDTO";
import { UpdateUserDTO } from "../../Domain/DTOs/user/UpdateUserDTO";
import { UserRoleDTO } from "../../Domain/DTOs/user/UserRoleDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { USER_ROUTES } from "../../Constants/routes/user/UserRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the User Microservice.
 */
export class GatewayUserService implements IGatewayUserService {
    private readonly userClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.userClient = createAxiosClient(API_ENDPOINTS.USER);
    }

    /**
     * Creates a new user.
     * @param {RegistrationUserDTO} data - registration data of the user. 
     * @returns {Promise<Result<UserDTO>>} - A promise that resolves to a Result object containing the data of the user.
     * - On success returns data as {@link UserDTO}.
     * - On failure returns status code and error message.
     */
    async createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>> {
        return await makeAPICall<UserDTO, RegistrationUserDTO>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.POST,
            url: USER_ROUTES.REGISTER_USER,
            data: data
        });
    }

    /**
     * Fetches a specific user.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<UserDTO>>} - A promise that resolves to a Result object containing the data of the user.
     * - On success returns data as {@link UserDTO}.
     * - On failure returns status code and error message.
     */
    async getUserById(userId: number): Promise<Result<UserDTO>> {
        return await makeAPICall<UserDTO>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.GET,
            url: USER_ROUTES.GET_USER(userId)
        });
    }

    /**
     * Fetches multiple users.
     * @param {number[]} userIds - ids of the users. 
     * @returns {Promise<Result<UserDTO[]>>} - A promise that resolves to a Result object containing the data of the users.
     * - On success returns data as {@link UserDTO[]}.
     * - On failure returns status code and error message.
     */
    async getUsersByIds(userIds: number[]): Promise<Result<UserDTO[]>> {
        return await makeAPICall<UserDTO[], undefined, { ids: string }>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.GET,
            url: USER_ROUTES.GET_MULTIPLE_USERS,
            params: {ids: userIds.join(',')}
        });
    }

    /**
     * Fetches all users.
     * @returns {Promise<Result<UserDTO[]>>} - A promise that resolves to a Result object containing the data of the users.
     * - On success returns data as {@link UserDTO[]}.
     * - On failure returns status code and error message.
     */
    async getUsers(): Promise<Result<UserDTO[]>> {
        return await makeAPICall<UserDTO[]>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.GET,
            url: USER_ROUTES.GET_ALL_USERS
        });
    }

    /**
     * Updates data of a specific user.
     * @param {number} userId - id of the user.
     * @param {UpdateUserDTO} data - updated data of the user. 
     * @returns {Promise<Result<UserDTO>>} - A promise that resolves to a Result object containing the data of the user.
     * - On success returns data as {@link UserDTO}.
     * - On failure returns status code and error message.
     */
    async updateUserById(userId: number, data: UpdateUserDTO): Promise<Result<UserDTO>> {
        return await makeAPICall<UserDTO, UpdateUserDTO>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.PUT,
            url: USER_ROUTES.UPDATE_USER(userId),
            data: data
        });
    }

    /**
     * Requests the deletion of the user.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async logicallyDeleteUserById(userId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.DELETE,
            url: USER_ROUTES.DELETE_USER(userId)
        });
    }

    /**
     * Fetches user roles based on impact level.
     * @returns {Promise<Result<UserRoleDTO[]>>} - A promise that resolves to a Result object containing the data of the user roles.
     * - On success returns data as {@link UserRoleDTO[]}.
     * - On failure returns status code and error message.
     */
    async getRolesByImpactLevel(impactLevel: number): Promise<Result<UserRoleDTO[]>> {
        return await makeAPICall<UserRoleDTO[]>(this.userClient, this.errorHandlingService, {
            serviceName: SERVICES.USER,
            method: HTTP_METHODS.GET,
            url: USER_ROUTES.GET_ROLES_BY_IMPACT_LEVEL(impactLevel)
        });
    }

}