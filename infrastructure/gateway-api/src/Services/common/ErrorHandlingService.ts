import axios, { AxiosError } from "axios";
import { Result } from "../../Domain/types/common/Result";
import { logger } from "../../Utils/Logger/Logger";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { ILoggerService } from "../../Domain/services/common/ILoggerService";

export class ErrorHandlingService implements IErrorHandlingService {
    constructor(private readonly loggerService: ILoggerService) {}

    handle(error: any, serviceName: string, method:string, url: string): Result<never> {
        if(axios.isAxiosError(error)){
            const axiosError = error as AxiosError;

            // timeout
            if(axiosError.code == "ECONNABORTED"){
                this.loggerService.err(serviceName, axiosError.code, url, method.toUpperCase(), `${serviceName} timed out`);

                return {
                    success: false,
                    status: 504,
                    message: `${serviceName || 'Service'} timed out`
                }
            }

            // network error
            if(!axiosError.response){
                this.loggerService.err(serviceName, axiosError.code ?? "ECONNREFUSED", url, method.toUpperCase(), `${serviceName} is unavailable`);

                return {
                    success: false,
                    status: 503,
                    message: `${serviceName || 'Service'} is unavailable`
                }
            }

            const status = axiosError.response.status;
            const message = (axiosError.response.data as any)?.message ||  axiosError.response.statusText || 'Request failed';

            if(status >= 500){
                this.loggerService.err(serviceName, axiosError.code ?? "ECONNREFUSED", url, method, `${serviceName || 'Service'} request failed: ${message}`);
            }
            else {
                this.loggerService.warn(serviceName, axiosError.code ?? "REQUEST_FAILED", url, method, `${serviceName || 'Service'} request failed: ${message}`);
            }

            return { success: false, status: status, message: message };
        }

        this.loggerService.err("Gateway", "GATEWAY_ERROR", url, method, `Gateway error ${error?.message ? ` - ${error.message}` : ""}`);

        return {
            success: false,
            status: 500,
            message: "Internal Gateway Error"
        };
    }
}