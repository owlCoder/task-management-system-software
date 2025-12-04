import { Result } from "../../types/common/Result";

export interface IErrorHandlingService {
    handle(error: any, serviceName: string, method: string, url: string): Result<never>;
}