import axios, { AxiosError } from "axios";
import { Result } from "../../Domain/types/common/Result";

export class ErrorHandlingService {
    static handle(error: any, serviceName?: string): Result<never> {
        if(axios.isAxiosError(error)){
            const axiosError = error as AxiosError;

            // timeout
            if(axiosError.code == "ECONNABORTED"){
                return {
                    success: false,
                    status: 504,
                    message: `${serviceName || 'Service'} timed out`
                }
            }

            // network error
            if(!axiosError.response){
                return {
                    success: false,
                    status: 503,
                    message: `${serviceName || 'Service'} unavailable`
                }
            }

            const status = axiosError.response.status;
            const message = (axiosError.response.data as any)?.message ||  axiosError.response.statusText || 'Request failed';

            return { success: false, status: status, message: message };
        }

        return {
            success: false,
            status: 500,
            message: "Internal gateway error"
        };
    }
}