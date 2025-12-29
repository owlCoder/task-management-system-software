import { RegistrationUserDTO } from "../../DTOs/user/RegistrationUserDTO";
import { UpdateUserDTO } from "../../DTOs/user/UpdateUserDTO";
import { UserDTO } from "../../DTOs/user/UserDTO";
import { UserRoleDTO } from "../../DTOs/user/UserRoleDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayUserService {
    createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>>;
    getUserById(id: number): Promise<Result<UserDTO>>;
    getUsersByIds(ids: number[]): Promise<Result<UserDTO[]>>;
    getUsers(): Promise<Result<UserDTO[]>>;
    updateUserById(id: number, data: UpdateUserDTO): Promise<Result<UserDTO>>;
    logicallyDeleteUserById(id: number): Promise<Result<void>>;
    getCreationRoles(): Promise<Result<UserRoleDTO[]>>;
}