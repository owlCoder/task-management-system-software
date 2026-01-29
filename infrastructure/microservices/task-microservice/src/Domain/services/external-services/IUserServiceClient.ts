import { UserDTO } from "../../external-dtos/UserDTO";
import { Result } from "../../types/Result";

export interface IUserServiceClient {
    getUserById(userId: number): Promise<Result<UserDTO>>;
    verifyUserExists(userId: number): Promise<boolean>;
}
