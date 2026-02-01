import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";


export interface IBusinessInsightsService {
    generateInsights(from: string, to: string, services: string[]): Promise<any>;
}