import { BusinessLLMOutputDTO } from "../../Domain/DTOs/BusinessLLMOutputDto";

export interface IBusinessInsightsService {
    generateInsights(from: string, to: string, services: string[]): Promise<BusinessLLMOutputDTO>;
}