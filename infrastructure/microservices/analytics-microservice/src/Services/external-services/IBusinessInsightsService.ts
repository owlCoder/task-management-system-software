import { BusinessInsightsDto } from "../../Domain/DTOs/BusinessInsightsDto";

export interface IBusinessInsightsService {
    generateInsights(from: string, to: string, services: string[]): Promise<BusinessInsightsDto>;
}