export interface BusinessRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action_items?: string[];
}

export interface BusinessIssue {
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  affected_projects?: string[];
}

export interface BusinessLLMOutputDTO {
  summary: string;
  recommendations: BusinessRecommendation[];
  issues: BusinessIssue[];
  key_metrics?: {
    total_projects_analyzed: number;
    projects_at_risk: number;
    budget_utilization_percentage: number;
    overall_health_score: number;
  };
}