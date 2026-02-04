import { AxiosInstance } from "axios";
import axios from "axios";
import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";
import { BusinessLLMOutputDTO, BusinessRecommendation, BusinessIssue } from "../../Domain/DTOs/BusinessLLMOutputDto";
import { ILLMAnalyticsService } from "./ILLMAnalyticsService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SiemResponseDTO } from "../../Domain/DTOs/SiemResponseDTO";
import { validateBusinessLLMInput } from "../../WebAPI/validators/ValidateBusinessLLMInput";
import { validateBusinessLLMOutput } from "../../WebAPI/validators/ValidateBusinessLLMOuput";

export class LLMAnalyticsService implements ILLMAnalyticsService {
  private readonly siemLLMClient: AxiosInstance;

  constructor(private readonly loggerService: ILogerService) {
    const siemLLMUrl = process.env.SIEM_LLM_API;
    if (!siemLLMUrl) {
      throw new Error("SIEM_LLM_API environment variable is not set");
    }
    this.siemLLMClient = axios.create({
      baseURL: siemLLMUrl,
      timeout: 30000 
    });
  }

  async analyze(input: BusinessLLMInputDto): Promise<BusinessLLMOutputDTO> {
    try {
      validateBusinessLLMInput(input);

      this.loggerService.log(
        `Sending business data to SIEM LLM: ${input.projects_performance.length} projects, period ${input.timeWindow.from} - ${input.timeWindow.to}`
      );

      const res = await this.siemLLMClient.post<BusinessLLMOutputDTO>(
        "/AnalysisEngine/generateBusinessInsights",
        input
      );

      validateBusinessLLMOutput(res.data);

      return res.data;

  } catch (error) {
      this.loggerService.log(
        `LLM Analysis failed, using fallback: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw error;
    }
  }
}