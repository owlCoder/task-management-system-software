import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

/**
 * Creates a configured axios instance for a specific microservice.
 * 
 * Content-Type defaults to `application/json`.
 * Timeout defaults to 5000ms.
 * @param {string} baseURL - The base URL for the microservice.
 * @param {CreateAxiosDefaults} options - Optional configuration to override defaults.
 * @returns {AxiosInstance} Configured axios instance.
 */
export function createAxiosClient(baseURL: string, options?: CreateAxiosDefaults): AxiosInstance {
    return axios.create({
        baseURL: baseURL,
        headers: { "Content-Type" : "application/json" },
        timeout: 5000,
        ...options
    });
}