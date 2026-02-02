import { BusinessLLMOutputDTO } from "../Domain/DTOs/BusinessLLMOutputDto";
import { SiemResponseDTO } from "../Domain/DTOs/SiemResponseDTO";

export function mapSiemRecommendationsToBusiness(
  recs: SiemResponseDTO[]
): BusinessLLMOutputDTO {

  return {
    summary: `Received ${recs.length} recommendations from SIEM LLM`,
    recommendations: recs.map(r => ({
      priority: mapPriority(r.priority),
      category: mapCategory(r.category),
      title: r.title,
      description: r.rationale,
      action_items: r.suggestedActions
    })),
    issues: [] 
  };
}

function mapPriority(p: string): 'high' | 'medium' | 'low' {
  switch (p) {
    case 'HIGH': return 'high';
    case 'MEDIUM': return 'medium';
    default: return 'low';
  }
}

function mapCategory(c: string) {
  switch (c) {
    case 'SECURITY': return 'security';
    case 'BUDGET': return 'budget';
    default: return 'general';
  }
}
