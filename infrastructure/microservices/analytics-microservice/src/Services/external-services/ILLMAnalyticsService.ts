import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";
import { BusinessLLMOutputDTO } from "../../Domain/DTOs/BusinessLLMOutputDto";

export interface ILLMAnalyticsService {
    analyze(input : BusinessLLMInputDto) :Promise<BusinessLLMOutputDTO>;
}