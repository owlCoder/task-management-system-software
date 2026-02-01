import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";
import { BusinessLLMOutputDTO } from "../../Domain/DTOs/BusinessLLMOutputDto";
import { ILLMAnalyticsService } from "./ILLMAnalyticsService";

export class LLMAnalyticsService implements ILLMAnalyticsService {

async analyze(input: BusinessLLMInputDto): Promise<BusinessLLMOutputDTO> {
  return {
    summary: `Analyzed ${input.projects_performance.length} projects in selected period.`,
    recommendations: [
      input.activity.projects_started_last_30_days > 5
        ? "Ensure sufficient staffing for increased project intake"
        : "Project intake is stable"
    ],
    issues:
      input.projects_financials.some(p => p.variance < 0)
        ? ["Some projects are over budget"]
        : []
  };
}

}