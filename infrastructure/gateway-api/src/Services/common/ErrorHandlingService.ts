// Libraries
import axios, { AxiosError } from "axios";

// Domain
import { ILoggerService } from "../../Domain/services/common/ILoggerService";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { Result } from "../../Domain/types/common/Result";

export class ErrorHandlingService implements IErrorHandlingService {
    constructor(private readonly loggerService: ILoggerService) {}

    handle(error: AxiosError | unknown, serviceName: string, method: string, url: string): Result<never> {
        if(axios.isAxiosError(error)){
            const axiosError = error as AxiosError;

            if(axiosError.code == "ECONNABORTED"){
                return this.handleTimeout(axiosError, serviceName, method, url);
            }

            if(!axiosError.response){
                return this.handleNetworkError(axiosError, serviceName, method, url);
            }

            return this.handleHttpError(axiosError, serviceName, method, url);
        }

        return this.handleInternalError(error, serviceName, method, url);
    }

    private handleTimeout(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const message = `${serviceName} timed out`
        this.loggerService.err(serviceName, error.code!, url, method, message);

        return {
            success: false,
            status: 504,
            message: message
        }
    }

    private handleNetworkError(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const message = `${serviceName} is unavailable`;
        this.loggerService.err(serviceName, error.code ?? "ECONNREFUSED", url, method, message);

        return {
            success: false,
            status: 503,
            message: message
        }
    }

    private handleHttpError(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const status = error.response!.status;
        const responseMessage = (error.response!.data as any)?.message ||  error.response!.statusText || 'Request failed';
        const message = `${serviceName} request failed: ${responseMessage}`;

        if(status >= 500){
            this.loggerService.err(serviceName, error.code ?? "ECONNREFUSED", url, method, `${message}`);
        }
        else {
            this.loggerService.warn(serviceName, error.code ?? "REQUEST_FAILED", url, method, `${message}`);
        }

        return { 
            success: false, 
            status: status,
            message: responseMessage
        };
    }

    private handleInternalError(error: unknown, serviceName: string, method: string, url: string): Result<never> {
        this.loggerService.err("Gateway", "GATEWAY_ERROR", url, method, `Gateway error ${error instanceof Error ? `- ${error.message}` : ""}`);

        return {
            success: false,
            status: 500,
            message: "Internal Gateway Error"
        };
    }
}