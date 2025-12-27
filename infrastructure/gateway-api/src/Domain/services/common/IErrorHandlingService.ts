// Libraries
import { AxiosError } from "axios";

// Domain
import { Result } from "../../types/common/Result";

export interface IErrorHandlingService {
    handle(error: AxiosError | unknown, serviceName: string, method: string, url: string): Result<never>;
}