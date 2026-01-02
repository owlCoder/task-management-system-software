// Libraries
import { ResponseType } from "axios";

/**
 * @field serviceName - Name of the service that is being called.
 * @field method - The HTTP method used for the request.
 * @field url - The URL of the API endpoint.
 * @field data - The data to send with the request (optional).
 * @field params - The query parameters to include in the request URL (optional).
 * @field headers - HTTP Headers (optional).
 * @field responseType - Expected type of the response (optional).
 * @field timeout - Request timeout (optional).
 * @field maxBodyLength - maximum length of the body (optional).
 * @field maxContentLength - maximum length of the body (optional).
 */
export interface APICallConfig<D = undefined, P = undefined> {
    serviceName: string,
    method: string,
    url: string,
    data?: D,
    params?: P
    headers?: Record<string, string>;
    responseType?: ResponseType;
    timeout?: number;
    maxBodyLength?: number;
    maxContentLength?: number;
};