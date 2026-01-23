export const ANALYTICS_ROUTES = Object.freeze({
    BURNDOWN_BY_SPRINT: (sprintId: number) => `/analytics/burndown/${sprintId}`,
    BURNUP_BY_SPRINT: (sprintId: number) => `/analytics/burnup/${sprintId}`,
    VELOCITY_BY_PROJECT: (projectId: number) => `/analytics/velocity/${projectId}`,
    BUDGET_BY_PROJECT: (projectId: number) => `/analytics/budget/${projectId}`,
    RESOURCE_COST_BY_PROJECT: (projectId: number) => `/analytics/resource-cost/${projectId}`,
    PROFIT_MARGIN_BY_PROJECT: (projectId: number) => `/analytics/profit-margin/${projectId}`,
    PROJECTS_LAST_30_DAYS: `/analytics/projects-last-30-days`,
    WORKERS_LAST_30_DAYS: `/analytics/workers-last-30-days`,
} as const);