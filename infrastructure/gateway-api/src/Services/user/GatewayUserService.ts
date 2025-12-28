// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayUserService } from "../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { UserDTO } from "../../Domain/DTOs/user/UserDTO";
import { UpdateUserDTO } from "../../Domain/DTOs/user/UpdateUserDTO";
import { UserRoleDTO } from "../../Domain/DTOs/user/UserRoleDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { USER_ROUTES } from "../../Constants/routes/user/UserRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

export class GatewayUserService implements IGatewayUserService {
    private readonly userClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.userClient = axios.create({
            baseURL: API_ENDPOINTS.USER,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.post<UserDTO>(USER_ROUTES.CREATE, data);

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.POST, USER_ROUTES.CREATE);
        }
    }

    async getUserById(id: number): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.get<UserDTO>(USER_ROUTES.GET_BY_ID(id));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.GET, USER_ROUTES.GET_BY_ID(id));
        }
    }

    async getUsersByIds(ids: number[]): Promise<Result<UserDTO[]>> {
        try {
            const response = await this.userClient.get<UserDTO[]>(USER_ROUTES.GET_BY_IDS, { 
                params:{
                    ids: ids.join(",")
                } 
            });

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.GET, USER_ROUTES.GET_BY_IDS);
        }
    }

    async getUsers(): Promise<Result<UserDTO[]>> {
        try{
            const response = await this.userClient.get<UserDTO[]>(USER_ROUTES.GET_ALL);
            
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.GET, USER_ROUTES.GET_ALL);
        }
    }

    async updateUserById(id: number, data: UpdateUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.put<UserDTO>(USER_ROUTES.UPDATE(id), data);

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.PUT, USER_ROUTES.UPDATE(id));
        }
    }

    async logicallyDeleteUserById(id: number): Promise<Result<void>> {
        try {
            await this.userClient.delete<void>(USER_ROUTES.DELETE(id));

            return {
                success: true,
                data: undefined
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.DELETE, USER_ROUTES.DELETE(id));
        }
    }

    async getCreationRoles(): Promise<Result<UserRoleDTO[]>> {
        try {
            const response = await this.userClient.get<UserRoleDTO[]>(USER_ROUTES.CREATION_ROLES);

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.USER, HTTP_METHODS.GET, USER_ROUTES.CREATION_ROLES);
        }
    }

}