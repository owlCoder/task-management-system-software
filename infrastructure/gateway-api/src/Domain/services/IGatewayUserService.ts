import { RegistrationUserDTO } from "../DTOs/RegistrationUserDTO";
import { UserDTO } from "../DTOs/UserDTO";
import { Result } from "../types/Result";

export interface IGatewayUserService {
    createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>>;
    getUserById(id: number): Promise<Result<UserDTO>>;
    getUsers(): Promise<Result<UserDTO[]>>;
    updateUserById(id: number, data: UserDTO): Promise<Result<UserDTO>>;
    logicallyDeleteUserById(id: number): Promise<Result<boolean>>;
}