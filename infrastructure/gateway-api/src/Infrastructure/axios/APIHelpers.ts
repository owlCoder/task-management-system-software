// Libraries
import { AxiosInstance, AxiosResponse } from "axios";
import { Readable } from "stream";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { Result } from "../../Domain/types/common/Result";
import { StreamResponse } from "../../Domain/types/common/StreamResponse";

// Config
import { APICallConfig } from "./config/APICallConfig";

/**
 * Calls an API based on configuration parameters.
 * @param {AxiosInstance} client - The axios instance used to make the HTTP request.
 * @param {IErrorHandlingService} handler - Service used for handling errors.
 * @param {APICallConfig<D, P>} config - Configuration object containing information on the API request
 * @returns {Promise<Result<T>>} - A promise that resolves to the result of the API call.
 *     - On success returns the response data from the API call.
 *     - On failure returns status code and error message.
 * @template T - The type of the response data expected from the API.
 * @template D - The type of the request body data. Defaults to undefined.
 * @template P - The type of the query parameters. Defaults to undefined.
 */
export async function makeAPICall<T, D = undefined, P = undefined>(
    client: AxiosInstance, 
    handler: IErrorHandlingService, 
    config: APICallConfig<D, P>
): Promise<Result<T>> {
    try{
        const response = await client.request<T>({
            method: config.method.toLowerCase(),
            url: config.url,
            ...(config.data && { data: config.data }),
            ...(config.params && { params: config.params }),
            ...(config.headers && { headers: config.headers }),
            ...(config.responseType && { responseType: config.responseType }),
            ...(config.timeout && { timeout: config.timeout }),
            ...(config.maxBodyLength && { maxBodyLength: config.maxBodyLength }),
            ...(config.maxContentLength && { maxContentLength: config.maxContentLength })
        });

        return {
            success: true,
            data: response.data
        };
    } catch(error) {
        return handler.handle(error, config.serviceName, config.method, config.url);
    }
}

/**
 * Calls an API based on configuration parameters and transforms the data.
 * @param {AxiosInstance} client - The axios instance used to make the HTTP request.
 * @param {IErrorHandlingService} handler - Service used for handling errors.
 * @param {APICallConfig<D, P>} config - Configuration object containing information on the API request
 * @param {(response: AxiosResponse) => T} transformer - A function that transforms the Axios response into a desired format.
 * @returns {Promise<Result<T>>} - The result containing the transformed data.
 *     - On success returns the response data from the API call.
 *     - On failure returns status code and error message.
 * @template T - The type of the data returned by transformer.
 * @template D - The type of the request body data. Defaults to undefined.
 * @template P - The type of the query parameters. Defaults to undefined.
 */
export async function makeAPICallWithTransform<T, D = undefined, P = undefined>(
    client: AxiosInstance, 
    handler: IErrorHandlingService, 
    config: APICallConfig<D, P>, 
    transformer: (response: AxiosResponse) => T
): Promise<Result<T>> {
    try {
        const response = await client.request<T>({
            method: config.method.toLowerCase(),
            url: config.url,
            ...(config.data && { data: config.data }),
            ...(config.params && { params: config.params }),
            ...(config.headers && { headers: config.headers }),
            ...(config.responseType && { responseType: config.responseType }),
            ...(config.timeout && { timeout: config.timeout }),
            ...(config.maxBodyLength && { maxBodyLength: config.maxBodyLength }),
            ...(config.maxContentLength && { maxContentLength: config.maxContentLength })
        });

        return {
            success: true,
            data: transformer(response)
        };
    } catch (error) {
        return handler.handle(error, config.serviceName, config.method, config.url);
    }
}

/**
 * Calls an API that returns a stream response.
 * @param {AxiosInstance} client - The axios instance used to make the HTTP request.
 * @param {IErrorHandlingService} handler - Service used for handling errors.
 * @param {APICallConfig<D, P>} config - Configuration object containing information on the API request.
 * @returns {Promise<Result<StreamResponse>>} - A promise that resolves to the result containing the stream and headers.
 *     - On success returns a StreamResponse with the readable stream and response headers.
 *     - On failure returns status code and error message.
 * @template D - The type of the request body data. Defaults to undefined.
 * @template P - The type of the query parameters. Defaults to undefined.
 */
export async function makeAPIStreamCall<D = undefined, P = undefined>(
    client: AxiosInstance, 
    handler: IErrorHandlingService, 
    config: APICallConfig<D, P>
): Promise<Result<StreamResponse>> {
    try{
        const response = await client.request<Readable>({
            method: config.method.toLowerCase(),
            url: config.url,
            ...(config.data && { data: config.data }),
            ...(config.params && { params: config.params }),
            ...(config.headers && { headers: config.headers }),
            ...(config.responseType && { responseType: config.responseType }),
            ...(config.timeout && { timeout: config.timeout }),
            ...(config.maxBodyLength && { maxBodyLength: config.maxBodyLength }),
            ...(config.maxContentLength && { maxContentLength: config.maxContentLength })
        });

        return {
            success: true,
            data: {
                stream: response.data,
                headers: response.headers
            }
        };
    } catch(error) {
        return handler.handle(error, config.serviceName, config.method, config.url);
    }
}