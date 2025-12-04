import axios, { AxiosInstance } from "axios";
import { IGatewayUserService } from "../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { UserDTO } from "../../Domain/DTOs/user/UserDTO";
import { Result } from "../../Domain/types/common/Result";
import { UpdateUserDTO } from "../../Domain/DTOs/user/UpdateUserDTO";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { ILoggerService } from "../../Domain/services/common/ILoggerService";
import { USER_ROUTES } from "../../Constants/routes/user/UserRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";

export class GatewayUserService implements IGatewayUserService {
    private static readonly serviceName: string = "User Service";
    private readonly userClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService, private readonly loggerService: ILoggerService) {
        const userBaseURL = process.env.USER_SERVICE_API;

        this.userClient = axios.create({
            baseURL: userBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.post<UserDTO>(USER_ROUTES.CREATE, data);

            this.loggerService.info(
                GatewayUserService.serviceName, 
                'USER_CREATED',
                USER_ROUTES.CREATE, 
                HTTP_METHODS.POST, 
                `User created: ${data.username}`
            );

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayUserService.serviceName, HTTP_METHODS.POST, USER_ROUTES.CREATE);
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
            return this.errorHandlingService.handle(error, GatewayUserService.serviceName, HTTP_METHODS.GET, USER_ROUTES.GET_BY_ID(id));
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
            return this.errorHandlingService.handle(error, GatewayUserService.serviceName, HTTP_METHODS.GET, USER_ROUTES.GET_ALL);
        }
    }

    async updateUserById(id: number, data: UpdateUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.put<UserDTO>(USER_ROUTES.UPDATE(id), data);

            this.loggerService.info(
                GatewayUserService.serviceName, 
                'USER_UPDATED',
                USER_ROUTES.UPDATE(id), 
                HTTP_METHODS.PUT, 
                `User with id ${id} updated`
            );

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayUserService.serviceName, HTTP_METHODS.PUT, USER_ROUTES.UPDATE(id));
        }
    }

    async logicallyDeleteUserById(id: number): Promise<Result<boolean>> {
        try {
            const response = await this.userClient.delete<boolean>(USER_ROUTES.DELETE(id));

            this.loggerService.info(
                GatewayUserService.serviceName, 
                'USER_DELETED',
                USER_ROUTES.DELETE(id), 
                HTTP_METHODS.DELETE, 
                `User with id ${id} deleted`
            );

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayUserService.serviceName, HTTP_METHODS.DELETE, USER_ROUTES.DELETE(id));
        }
    }

}