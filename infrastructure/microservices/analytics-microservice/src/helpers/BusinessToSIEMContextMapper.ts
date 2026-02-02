import { BusinessLLMInputDto } from "../Domain/DTOs/BusinessLLMInputDto";
import { SiemRecommendationContext } from "../Domain/DTOs/SiemRecommendationContextDTo";

export function mapBusinessToSiem(
  input: BusinessLLMInputDto
): SiemRecommendationContext {

  const now = new Date().toISOString();

  return {
    window: {
      fromUtc: input.time_window.from,
      toUtc: input.time_window.to,
    },

    latest: {
      mttd_minutes: 30,
      mttr_minutes: 120,
      false_alarm_rate: 0.1,
      score_value: 80,
      maturity_level: "INTERMEDIATE",
    },

    avg7d: {
      mttd_minutes: 35,
      mttr_minutes: 130,
      false_alarm_rate: 0.12,
      total_alerts: input.projects_financials.length,
    },

    series: input.projects_performance.map(p => ({
      fromUtc: now,
      mttd: p.average_velocity_hours === 0 ? 999 : 40,
      mttr: 120,
      far: 0.1,
      score: p.average_velocity_hours === 0 ? 40 : 85,
      total: p.sprints_completed,
    })),

    incidentsByCategory7d: input.projects_financials
      .filter(p => p.variance < 0)
      .map(() => ({
        category: "BUDGET",
        count: 1,
      })),
  };
}
