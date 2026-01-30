// Framework
import { Request } from "express";

import { UserDTO } from "../../DTOs/user/UserDTO";
import { UserRoleDTO } from "../../DTOs/user/UserRoleDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayUserService {
    createUser(req: Request): Promise<Result<UserDTO>>;
    getUserById(userId: number): Promise<Result<UserDTO>>;
    getUsersByIds(userIds: number[]): Promise<Result<UserDTO[]>>;
    getUsers(): Promise<Result<UserDTO[]>>;
    updateUserById(userId: number, req: Request): Promise<Result<UserDTO>>;
    logicallyDeleteUserById(userId: number): Promise<Result<void>>;
    getRolesByImpactLevel(impactLevel: number): Promise<Result<UserRoleDTO[]>>;
}