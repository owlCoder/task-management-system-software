import axios, { AxiosError, AxiosInstance } from "axios";
import { ServiceStatusDTO } from "../../models/service-status/ServiceStatusDTO";
import { IServiceStatusAPI } from "./IServiceStatusAPI";
import { readValueByKey } from "../../helpers/local_storage";
import { AverageTimeDTO } from "../../models/service-status/AverageTimeDTO";
import { MeasurementDto } from "../../models/service-status/MeasurementDTO";


const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;


export class ServiceStatusAPI implements IServiceStatusAPI {
    private readonly client: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: GATEWAY_URL,
            timeout: 30000,
        });

        this.client.interceptors.request.use(
            (config) => {
                const token = readValueByKey("authToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    console.error("Unauthorized - token expired or invalid");
                } else if (error.response?.status === 403) {
                    console.error("Forbidden - insufficient permissions");
                }
                return Promise.reject(error);
            }
        );
    }


    async getAllDownMeasurements(): Promise<MeasurementDto[]> {
        try {
            const response = await this.client.get<MeasurementDto[]>(`/measurements/down`);
            return response.data;
        } catch (error) {
            console.error("Error getting status of microservices:", error);
            return [];
        }
    }


    async getServiceStatus(): Promise<ServiceStatusDTO[]> {
        try {
            const response = await this.client.get<ServiceStatusDTO[]>(`/measurements/service-status`);
            return response.data;
        } catch (error) {
            console.error("Error getting status of microservices:", error);
            return [];
        }
    }

    async getAvgResponseTime(days: number): Promise<AverageTimeDTO[]> {
        try {
            const response = await this.client.get<AverageTimeDTO[]>(`measurements/average-response-time/${days}`);
            return response.data;
        } catch (error) {
            console.error("Error getting status of microservices:", error);
            return [];
        }
    }

}