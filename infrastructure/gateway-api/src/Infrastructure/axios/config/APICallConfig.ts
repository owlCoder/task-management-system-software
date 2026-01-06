import { BaseAPICallConfig } from "./BaseAPICallConfig";

/**
 * @extends BaseAPICallConfig
 * @field data - The data to send with the request (optional).
 * @field params - The query parameters to include in the request URL (optional).
 */
export interface APICallConfig<D = undefined, P = undefined> extends BaseAPICallConfig {
    data?: D;
    params?: P;
};