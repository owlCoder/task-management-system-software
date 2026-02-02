import { AxiosInstance } from "axios";
import { createAxiosClient } from "../../siem/Domen/axios/client/AxiosClientFactory";
import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";
import { BusinessLLMOutputDTO, BusinessRecommendation, BusinessIssue } from "../../Domain/DTOs/BusinessLLMOutputDto";
import { ILLMAnalyticsService } from "./ILLMAnalyticsService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { mapBusinessToSiem } from "../../helpers/BusinessToSIEMContextMapper";
import { SiemResponseDTO } from "../../Domain/DTOs/SiemResponseDTO";
import { mapSiemRecommendationsToBusiness } from "../../helpers/SIEMToBusinessContext";

export class LLMAnalyticsService implements ILLMAnalyticsService {
  private readonly siemLLMClient: AxiosInstance;

  constructor(private readonly loggerService: ILogerService) {
    const siemLLMUrl = process.env.SIEM_LLM_API;
    if (!siemLLMUrl) {
      throw new Error("SIEM_LLM_API environment variable is not set");
    }
    this.siemLLMClient = createAxiosClient(siemLLMUrl);
    this.loggerService.log(`LLMAnalyticsService initialized with SIEM_LLM_API: ${siemLLMUrl}`);
  }

  async analyze(input: BusinessLLMInputDto): Promise<BusinessLLMOutputDTO> {
    try {
      this.loggerService.log(
        `Sending business data to SIEM LLM: ${input.projects_performance.length} projects, period ${input.time_window.from} - ${input.time_window.to}`
      );

  const siemContext = mapBusinessToSiem(input);

  const response = await this.siemLLMClient.post<SiemResponseDTO[]>(
    "/AnalysisEngine/recommendations",
    siemContext
  );

  return mapSiemRecommendationsToBusiness(response.data);

  } catch (error) {
      this.loggerService.log(
        `LLM Analysis failed, using fallback: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw error;
    }
  }

  /*private getFallbackResponse(input: BusinessLLMInputDto): BusinessLLMOutputDTO {
    const overBudgetProjects = input.projects_financials.filter(p => p.variance < 0);
    const lowProfitProjects = input.projects_financials.filter(
      p => p.profit_margin_percentage < 10
    );

    const recommendations: BusinessRecommendation[] = [];
    const issues: BusinessIssue[] = [];

    if (input.activity.projects_started_last_30_days > 5) {
      recommendations.push({
        priority: 'high',
        category: 'staffing',
        title: 'High Project Intake',
        description: `${input.activity.projects_started_last_30_days} projects started in last 30 days. Ensure sufficient staffing.`,
        action_items: [
          'Review team capacity',
          'Consider hiring additional staff',
          'Prioritize critical projects'
        ]
      });
    }

    if (input.activity.workers_added_last_30_days < 2 && input.projects_performance.length > 3) {
      recommendations.push({
        priority: 'medium',
        category: 'staffing',
        title: 'Low Worker Onboarding',
        description: 'Consider increasing team size to handle project load.',
      });
    }

    if (overBudgetProjects.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'budget',
        title: 'Budget Oversight Needed',
        description: `${overBudgetProjects.length} project(s) are over budget. Immediate review required.`,
        action_items: [
          'Conduct budget review meetings',
          'Identify cost-saving opportunities',
          'Adjust project scope if necessary'
        ]
      });
    }

    overBudgetProjects.forEach(p => {
      issues.push({
        severity: 'warning',
        category: 'budget',
        title: `Project Over Budget`,
        description: `Project ID ${p.project_id} exceeded budget by ${Math.abs(p.variance).toFixed(2)}`,
        affected_projects: [`Project ${p.project_id}`]
      });
    });

    lowProfitProjects.forEach(p => {
      issues.push({
        severity: 'info',
        category: 'budget',
        title: `Low Profit Margin`,
        description: `Project ID ${p.project_id} has profit margin of ${p.profit_margin_percentage.toFixed(2)}%`,
        affected_projects: [`Project ${p.project_id}`]
      });
    });

    if (input.projects_performance.some(p => p.average_velocity_hours === 0)) {
      issues.push({
        severity: 'warning',
        category: 'timeline',
        title: 'Projects with Zero Velocity',
        description: 'Some projects show no progress. Review may be needed.',
      });
    }

    const totalBudget = input.projects_financials.reduce((sum, p) => sum + p.allowed_budget, 0);
    const totalSpent = input.projects_financials.reduce((sum, p) => sum + p.total_spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      summary: `Analyzed ${input.projects_performance.length} projects from ${input.time_window.from} to ${input.time_window.to}. LLM service unavailable - showing basic analysis.`,
      recommendations,
      issues,
      key_metrics: {
        total_projects_analyzed: input.projects_performance.length,
        projects_at_risk: overBudgetProjects.length + lowProfitProjects.length,
        budget_utilization_percentage: budgetUtilization,
        overall_health_score: this.calculateHealthScore(input, overBudgetProjects.length, lowProfitProjects.length)
      }
    };
  }

  private calculateHealthScore(
    input: BusinessLLMInputDto,
    overBudgetCount: number,
    lowProfitCount: number
  ): number {
    let score = 100;
    score -= (overBudgetCount / input.projects_financials.length) * 30;
    score -= (lowProfitCount / input.projects_financials.length) * 20;

    const zeroVelocityCount = input.projects_performance.filter(p => p.average_velocity_hours === 0).length;
    score -= (zeroVelocityCount / input.projects_performance.length) * 25;

    if (input.activity.projects_started_last_30_days > 5 && input.activity.workers_added_last_30_days < 2) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }*/
}