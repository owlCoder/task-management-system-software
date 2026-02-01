import { UserDTO } from "../../DTOs/external-dtos/UserDTO";
import { Result } from "../../types/Result";

export interface IUserServiceClient {
    getUserById(userId: number): Promise<Result<UserDTO>>;
    getUsersByIds(userIds: number[]): Promise<Result<UserDTO[]>>;
    verifyUserExists(userId: number): Promise<boolean>;
}
