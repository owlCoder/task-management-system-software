export interface ProjectPerformanceMetricsDto {
  project_id: number;
  project_name?: string;
  average_velocity_hours: number;   // iz getVelocityForProject
  sprints_completed: number;        // broj zavrsenih sprintova do danas
}

export interface ProjectFinancialMetricsDto {
  project_id: number;
  allowed_budget: number;
  total_spent: number;              // iz BudgetTrackingDto.total_spent
  remaining_budget: number;
  variance: number;
  profit: number;
  profit_margin_percentage: number;
}

export interface ActivityMetricsDto {
  projects_started_last_30_days: number;
  workers_added_last_30_days: number;
}

export interface BusinessLLMInputDto {
  timeWindow: {
    from: string; // ISO string
    to: string;   // ISO string
  };

  activity: ActivityMetricsDto;

  projects_performance: ProjectPerformanceMetricsDto[];
  projects_financials: ProjectFinancialMetricsDto[];
}