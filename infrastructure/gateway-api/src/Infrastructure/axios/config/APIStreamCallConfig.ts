import { BaseAPICallConfig } from "./BaseAPICallConfig";

/**
 * @extends BaseAPICallConfig
 * @field params - The query parameters to include in the request URL (optional).
 * @field maxContentLength - maximum length of the content (optional).
 */
export interface APIDownloadStreamCallConfig<P = undefined> extends BaseAPICallConfig {
    params?: P;
    maxContentLength?: number;  
};

/**
 * @extends BaseAPICallConfig
 * @field data - data that needs to be uploaded
 * @field maxContentLength - maximum length of the content (optional).
 * @field maxBodyLength - maximum length of the body (optional).
 */
export interface APIUploadStreamCallConfig<D = undefined> extends BaseAPICallConfig {
    data: D;
    maxContentLength?: number;
    maxBodyLength?: number;
}