/**
 * @field serviceName - Name of the service that is being called.
 * @field method - The HTTP method used for the request.
 * @field url - The URL of the API endpoint.
 * @field headers - HTTP Headers (optional).
 * @field timeout - Request timeout (optional).
 */
export interface BaseAPICallConfig {
    serviceName: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
}