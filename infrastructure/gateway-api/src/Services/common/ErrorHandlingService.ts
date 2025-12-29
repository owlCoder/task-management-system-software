// Libraries
import axios, { AxiosError } from "axios";

// Domain
import { ILoggerService } from "../../Domain/services/common/ILoggerService";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { Result } from "../../Domain/types/common/Result";

/**
 * Centralized error handler for client requests.
 */
export class ErrorHandlingService implements IErrorHandlingService {
    constructor(private readonly loggerService: ILoggerService) {}

    /**
     * Entry point for the error handling. Types of error: timeout, network error, http error, internal error.
     * @param {AxiosError | unknown} error - the error that occured. 
     * @param {string} serviceName - name of the service where error occured.
     * @param {string} method - method that was called. 
     * @param {string} url - url that was targeted. 
     * @returns {Result<never>} containing the status code and error message.
     */
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

        return this.handleInternalError(error, method, url);
    }

    /**
     * Handles the timeout error.
     * @param {AxiosError} error - the error that occured.
     * @param {string} serviceName - name of the service where error occured.
     * @param {string} method - method that was called. 
     * @param {string} url - url that was targeted. 
     * @returns {Result<never>} containing the status code 504 and error message.
     */
    private handleTimeout(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const message = `${serviceName} timed out`
        this.loggerService.err(serviceName, error.code ?? "ECONNABORTED", url, method, message);

        return {
            success: false,
            status: 504,
            message: message
        }
    }

    /**
     * Handles network errors.
     * @param {AxiosError} error - the error that occured. 
     * @param {string} serviceName - name of the service where error occured.
     * @param {string} method - method that was called. 
     * @param {string} url - url that was targeted. 
     * @returns {Result<never>} containing the status code 503 and error message.
     */
    private handleNetworkError(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const message = `${serviceName} is unavailable`;
        this.loggerService.err(serviceName, error.code ?? "ECONNREFUSED", url, method, message);

        return {
            success: false,
            status: 503,
            message: message
        }
    }

    /**
     * Handles HTTP errors. Requires check if error has response before being called.
     * @param {AxiosError} error - the error that occured. 
     * @param {string} serviceName - name of the service where error occured.
     * @param {string} method - method that was called. 
     * @param {string} url - url that was targeted. 
     * @returns {Result<never>} containing the status code and error message upstreamed from the microservice.
     */
    private handleHttpError(error: AxiosError, serviceName: string, method: string, url: string): Result<never> {
        const status = error.response!.status;
        const responseMessage = (error.response!.data as any)?.message ||  error.response!.statusText || 'Request failed';
        const message = `${serviceName} request failed: ${responseMessage}`;

        if(status >= 500){
            this.loggerService.err(serviceName, error.code ?? "ECONNREFUSED", url, method, message);
        }
        else {
            this.loggerService.warn(serviceName, error.code ?? "REQUEST_FAILED", url, method, message);
        }

        return { 
            success: false, 
            status: status,
            message: responseMessage
        };
    }

    /**
     * Handles internal gateway errors. A sign that a code has a logical flaw.
     * @param {unknown} error - the error that occured.
     * @param {string} method - method that was called. 
     * @param {string} url - url that was targeted. 
     * @returns {Result<never>} containing the status code 500 and error message.
     */
    private handleInternalError(error: unknown, method: string, url: string): Result<never> {
        this.loggerService.err("Gateway", "GATEWAY_ERROR", url, method, `Gateway error ${error instanceof Error ? `- ${error.message}` : ""}`);

        return {
            success: false,
            status: 500,
            message: "Internal Gateway Error"
        };
    }
}