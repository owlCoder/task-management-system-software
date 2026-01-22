import { Result } from "../../types/Result";

export interface IUserServiceClient {
    getUserById(userId: number): Promise<Result<any>>;
    verifyUserExists(userId: number): Promise<boolean>;
}
