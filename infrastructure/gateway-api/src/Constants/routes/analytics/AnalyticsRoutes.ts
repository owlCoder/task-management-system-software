export const ANALYTICS_ROUTES = {
    BURNDOWN_BY_SPRINT: (sprintId: number) => `/analytics/burndown/${sprintId}`,
    BURNUP_BY_SPRINT: (sprintId: number) => `/analytics/burnup/${sprintId}`,
    VELOCITY_BY_PROJECT: (projectId: number) => `/analytics/velocity/${projectId}`,
    BUDGET_BY_PROJECT: (projectId: number) => `/analytics/budget/${projectId}`,
    RESOURCE_COST_BY_PROJECT: (projectId: number) => `/analytics/resource-cost/${projectId}`,
    PROFIT_MARGIN_BY_PROJECT: (projectId: number) => `/analytics/profit-margin/${projectId}`
}